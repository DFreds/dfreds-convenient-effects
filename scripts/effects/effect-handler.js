import DynamicEffectsAdder from './dynamic-effects-adder.js';
import Settings from '../settings.js';
import log from '../logger.js';

/**
 * Handles toggling on and off effects on actors
 */
export default class EffectHandler {
  constructor() {
    this._dynamicEffectsAdder = new DynamicEffectsAdder();
    this._settings = new Settings();
  }

  /**
   * Toggles an effect on or off by name
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {string[]} identifiers - optional ids to apply the effect to. If not provided, it will use the targeted or selected tokens
   */
  async toggleEffect(effectName, ...identifiers) {
    const actorsToEffect = this._determineActorsToEffect(identifiers);
    if (!actorsToEffect || actorsToEffect.length === 0) return;

    await this._toggleEffect(effectName, actorsToEffect);
  }

  _determineActorsToEffect(identifiers) {
    const definedIdentifiers = identifiers.filter((identifier) => identifier);
    if (definedIdentifiers && definedIdentifiers.length > 0) {
      return [
        ...this._findPlaceablesThatMatch(identifiers),
        ...this._findActorsThatMatch(identifiers),
      ];
    }

    if (canvas.tokens.controlled.length == 0 && game.user.targets.size == 0) {
      ui.notifications.error(
        'Please select or target a token to apply an effect'
      );
      return;
    }

    if (this._settings.prioritizeTargets && game.user.targets.size !== 0) {
      return Array.from(game.user.targets).map((token) => token.actor);
    } else {
      return canvas.tokens.controlled.map((token) => token.actor);
    }
  }

  _findPlaceablesThatMatch(identifiers) {
    return identifiers
      .flatMap((identifier) => {
        return canvas.tokens.placeables.filter((placeable) => {
          return placeable.id === identifier || placeable.name === identifier;
        });
      })
      .map((token) => token.actor);
  }

  _findActorsThatMatch(identifiers) {
    return identifiers.flatMap((identifier) => {
      return game.actors.filter((actor) => {
        return actor.uuid === identifier || actor.id === identifier;
      });
    });
  }

  /**
   * Toggles an effect on or off via the token HUD
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {Token5e} token - token to apply the effect to
   */
  async toggleStatusEffect(effectName, token) {
    await this._toggleEffect(effectName, [token.actor]);
  }

  async _toggleEffect(effectName, actors) {
    let effect = this._findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} was not found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._getNestedEffectSelection(effect);
    }

    for (const actor of actors) {
      if (this.hasEffectApplied(effect.name, actor)) {
        await this.removeEffect(effect.name, actor);
      } else {
        await this.addEffect({ effectName: effect.name, actor });
      }
    }
  }

  /**
   * Checks a provided actor to see if any of its current active effects are a convenient effect
   *
   * @param {string} effectName - name of the effect to check
   * @param {Actor5e} actor - the actor to check
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  hasEffectApplied(effectName, actor) {
    return actor.data.effects.some(
      (activeEffect) =>
        activeEffect?.data?.flags?.isConvenient &&
        activeEffect?.data?.label == effectName
    );
  }

  /**
   * Removes a convenient effect matching the provided name from an actor if the
   * effect exists on it
   *
   * @param {string} effectName - name of the effect to remove
   * @param {Actor5e} actor - the actor to remove the effect from
   */
  async removeEffect(effectName, actor) {
    let effect = this._findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} was not found`);
      return;
    }

    if (!actor) {
      ui.notifications.error('Actor must be defined');
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
   * @param {string} effectName - name of the effect to add
   * @param {Actor5e} actor - the actor to add the effect to
   * @param {string} origin - the origin to add to the effect
   */
  async addEffect({ effectName, actor, origin }) {
    let effect = this._findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} was not found`);
      return;
    }

    if (!actor) {
      ui.notifications.error('Actor must be defined');
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

  _findEffectByName(effectName) {
    return game.dfreds.effects.all.find((effect) => effect.name == effectName);
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
    if (this._settings.chatMessageType === 'none') return;

    const effect = game.dfreds.effects.all.find(
      (effect) => effect.name == effectName
    );

    if (!effect) return;

    const actorName = actor.token ? actor.token.name : actor.name;

    await ChatMessage.create({
      user: game.userId,
      whisper:
        this._settings.chatMessageType === 'gmOnly'
          ? game.users.filter((user) => user.isGM).map((gm) => gm.id)
          : undefined,
      content: `<p><strong>${effect.name}</strong> - ${reason} ${actorName}</p>
         <p>${effect.description}</p>
         `,
    });
  }
}
