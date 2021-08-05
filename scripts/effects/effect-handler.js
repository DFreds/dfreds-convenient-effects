import DynamicEffectsAdder from './dynamic-effects-adder.js';
import Settings from '../settings.js';
import log from '../logger.js';
import socketInstance from '../socket.js';

/**
 * Handles toggling on and off effects on actors
 */
export default class EffectHandler {
  constructor() {
    this._dynamicEffectsAdder = new DynamicEffectsAdder();
    this._settings = new Settings();
  }

  /**
   * Toggles an effect on or off via the token HUD
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {Token5e} token - token to apply the effect to
   */
  async toggleStatusEffect(effectName, token) {
    await this.toggleEffect(effectName, token.actor.uuid);
  }

  /**
   * Toggles an effect on or off by name
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {string[]} uuids - optional identifiers to apply the effect to. If not provided, it will use the targeted or selected tokens
   */
  async toggleEffect(effectName, ...uuids) {
    let effect = this._findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} was not found`);
      return;
    }

    if (uuids.length === 0) {
      uuids = this._getActorUuidsFromCanvas();
    }

    if (uuids.length == 0) {
      ui.notifications.error(
        `Please select or target a token to toggle ${effectName}`
      );
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._getNestedEffectSelection(effect);
    }

    for (const uuid of uuids) {
      if (await this.hasEffectApplied(effectName, uuid)) {
        await this.removeEffect(effect.name, uuid);
      } else {
        await this.addEffect(effect.name, uuid);
      }
    }
  }

  _findEffectByName(effectName) {
    return game.dfreds.effects.all.find((effect) => effect.name == effectName);
  }

  _getActorUuidsFromCanvas() {
    if (canvas.tokens.controlled.length == 0 && game.user.targets.size == 0) {
      return [];
    }

    if (this._settings.prioritizeTargets && game.user.targets.size !== 0) {
      return Array.from(game.user.targets).map((token) => token.actor.uuid);
    } else {
      return canvas.tokens.controlled.map((token) => token.actor.uuid);
    }
  }

  async _getNestedEffectSelection(effect) {
    const content = await renderTemplate(
      'modules/dfreds-convenient-effects/templates/nested-effects-dialog.html',
      { parentEffect: effect }
    );
    const choice = await Dialog.prompt(
      {
        title: effect.name,
        content: content,
        label: 'Select Effect',
        callback: (html) => {
          const htmlChoice = html.find('select[name="effect-choice"]').val();
          return htmlChoice;
        },
      },
      { width: 300 }
    );

    return effect.nestedEffects.find(
      (nestedEffect) => nestedEffect.name == choice
    );
  }

  /**
   * Checks a provided actor to see if any of its current active effects are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} identifier - the identifier to search for. Can be a token
   * name, token ID, actor ID, or actor UUID
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectApplied(effectName, uuid) {
    const actor = await this._getActorByUuid(uuid);
    return actor?.data?.effects?.some(
      (activeEffect) =>
        activeEffect?.data?.flags?.isConvenient &&
        activeEffect?.data?.label == effectName
    );
  }

  _getUuidByIdentifier(identifier) {
    let actor = game.actors.find((actor) => actor.id === identifier);
    let placeable = canvas.tokens.placeables.find(
      (placeable) =>
        placeable.id === identifier || placeable.name === identifier
    );

    return actor ? actor?.uuid : placeable?.actor?.uuid;
  }

  async _getActorByUuid(uuid) {
    const actorToken = await fromUuid(uuid);
    const actor = actorToken?.actor ? actorToken?.actor : actorToken;
    return actor;
  }

  /**
   * Removes a convenient effect matching the provided name from an actor if the
   * effect exists on it
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the identifier to search for. Can be a token
   * name, token ID, actor ID, or actor UUID
   */
  removeEffect(effectName, uuid) {
    return socketInstance.socket.executeAsGM(
      'removeEffectAsGM',
      effectName,
      uuid
    );
  }

  async removeEffectAsGM(effectName, uuid) {
    let effect = this._findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} could not be found`);
      return;
    }

    const actor = await this._getActorByUuid(uuid);

    if (!actor) {
      ui.notifications.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._getNestedEffectSelection(effect);
    }

    const effectToRemove = actor.data.effects.find(
      (activeEffect) =>
        activeEffect?.data?.flags?.isConvenient &&
        activeEffect?.data?.label == effect.name
    );

    if (effectToRemove) {
      await actor.deleteEmbeddedDocuments('ActiveEffect', [effectToRemove.id]);
      log(`Removed effect ${effect.name} from ${actor.name} - ${actor.id}`);
    }
  }

  /**
   * Adds a convenient effect matching the provided name to an actor
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the identifier to search for. Can be a token
   * name, token ID, actor ID, or actor UUID
   * @param {string} origin - the origin to add to the effect
   */
  addEffect(effectName, uuid, origin) {
    return socketInstance.socket.executeAsGM(
      'addEffectAsGM',
      effectName,
      uuid,
      origin
    );
  }

  async addEffectAsGM(effectName, uuid, origin) {
    let effect = this._findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} could not be found`);
      return;
    }

    const actor = await this._getActorByUuid(uuid);

    if (!actor) {
      ui.notifications.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._getNestedEffectSelection(effect);
    }

    if (effect.isDynamic) {
      await this._dynamicEffectsAdder.addDynamicEffects(effect, actor);
    }

    this._handleIntegrations(effect);

    const activeEffectData = effect.convertToActiveEffectData(origin);
    await actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);

    log(`Added effect ${effect.name} to ${actor.name} - ${actor.id}`);
  }

  _handleIntegrations(effect) {
    if (this._settings.integrateWithAtl && effect.atlChanges.length > 0) {
      this._addAtlChangesToEffect(effect);
    }

    if (
      this._settings.integrateWithTokenMagic &&
      effect.tokenMagicChanges.length > 0
    ) {
      this._addTokenMagicChangesToEffect(effect);
    }
  }

  _addAtlChangesToEffect(effect) {
    effect.changes.push(...effect.atlChanges);
  }

  _addTokenMagicChangesToEffect(effect) {
    effect.changes.push(...effect.tokenMagicChanges);
  }

  /**
   * Creates a chat message when a convenient effect is applied or removed. This
   * only creates the message if the setting is enabled.
   *
   * @param {string} effectName - the name of the effect
   * @param {string} reason - the reason for the chat message
   * @param {Actor5e} actor - the actor the effect change occurred to
   */
  async createChatForEffect({ effectName, reason, actor }) {
    // Handle if it set to None
    if (this._settings.chatMessagePermission > CONST.USER_ROLES.GAMEMASTER)
      return;

    const effect = game.dfreds.effects.all.find(
      (effect) => effect.name == effectName
    );

    if (!effect) return;

    const actorName = actor.token ? actor.token.name : actor.name;

    await ChatMessage.create({
      user: game.userId,
      whisper:
        this._settings.chatMessagePermission === CONST.USER_ROLES.PLAYER
          ? undefined
          : game.users
              .filter(
                (user) => user.role >= this._settings.chatMessagePermission
              )
              .map((user) => user.id),
      content: `<p><strong>${effect.name}</strong> - ${reason} ${actorName}</p>
         <p>${effect.description}</p>
         `,
    });
  }
}
