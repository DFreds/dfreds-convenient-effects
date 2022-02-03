import CustomEffectsHandler from './custom-effects-handler.js';
import DynamicEffectsAdder from './dynamic-effects-adder.js';
import Effect from './effect.js';
import FoundryHelpers from '../foundry-helpers.js';
import Settings from '../settings.js';
import log from '../logger.js';

/**
 * Handles toggling on and off effects on actors
 */
export default class EffectHandler {
  constructor() {
    this._customEffectsHandler = new CustomEffectsHandler();
    this._foundryHelpers = new FoundryHelpers();
    this._dynamicEffectsAdder = new DynamicEffectsAdder();
    this._settings = new Settings();
  }

  // TODO should this be here or in effect-interface.js?
  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  findEffectByName(effectName) {
    const effect = this._customEffectsHandler
      .getCustomEffects()
      .find((effect) => effect.name == effectName);

    if (effect) return effect;

    return game.dfreds.effects.all.find((effect) => effect.name == effectName);
  }

  /**
   * Prompts the user to select a nested effect from the choices available
   *
   * @param {Effect} effect - the parent effect
   * @returns {Effect} the chosen nested effect
   */
  async getNestedEffectSelection(effect) {
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
        rejectClose: false,
      },
      { width: 300 }
    );

    return effect.nestedEffects.find(
      (nestedEffect) => nestedEffect.name == choice
    );
  }

  /**
   * Toggles an effect on or off by name on an actor by UUID
   *
   * @param {Effect} effect - the effect to toggle
   * @param {object} params - the effect parameters
   * @param {boolean} params.overlay - if the effect is an overlay or not
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   */
  async toggleEffect(effect, { overlay, uuids }) {
    for (const uuid of uuids) {
      if (await this.hasEffectApplied(effect.name, uuid)) {
        await this.removeEffect({ effect, uuid });
      } else {
        await this.addEffect({ effect, uuid, overlay });
      }
    }
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectApplied(effectName, uuid) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    return actor?.data?.effects?.some(
      (activeEffect) =>
        activeEffect?.data?.flags?.isConvenient &&
        activeEffect?.data?.label == effectName &&
        !activeEffect?.data?.disabled
    );
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effect - the effect to remove
   * @param {string} params.uuid - the uuid of the actor to remove the effect from
   */
  async removeEffect({ effect, uuid }) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    const effectToRemove = actor.data.effects.find(
      (activeEffect) =>
        activeEffect?.data?.flags?.isConvenient &&
        activeEffect?.data?.label == effect.name
    );

    if (!effectToRemove) return;

    await effectToRemove.delete();
    log(`Removed effect ${effect.name} from ${actor.name} - ${actor.id}`);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {object} params - the effect parameters
   * @param {Effect} params.effect - the effect to add
   * @param {string} params.uuid - the uuid of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   */
  async addEffect({ effect, uuid, origin, overlay }) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (effect.name.startsWith('Exhaustion')) {
      await this._removeAllExhaustionEffects(uuid);
    }

    if (effect.isDynamic) {
      await this._dynamicEffectsAdder.addDynamicEffects(effect, actor);
    }

    this._handleIntegrations(effect);

    const activeEffectData = effect.convertToActiveEffectData({
      origin,
      overlay,
    });
    await actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);

    log(`Added effect ${effect.name} to ${actor.name} - ${actor.id}`);
  }

  async _removeAllExhaustionEffects(uuid) {
    await this.removeEffect({ effectName: 'Exhaustion 1', uuid });
    await this.removeEffect({ effectName: 'Exhaustion 2', uuid });
    await this.removeEffect({ effectName: 'Exhaustion 3', uuid });
    await this.removeEffect({ effectName: 'Exhaustion 4', uuid });
    await this.removeEffect({ effectName: 'Exhaustion 5', uuid });
  }

  _handleIntegrations(effect) {
    if (this._settings.integrateWithAte && effect.atlChanges.length > 0) {
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
}
