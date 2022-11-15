import DynamicEffectsAdder from './dynamic-effects-adder.js';
import FoundryHelpers from '../foundry-helpers.js';
import Settings from '../settings.js';
import log from '../logger.js';
import Effect from './effect.js';

/**
 * Handles toggling on and off effects on actors
 */
export default class EffectHandler {
  constructor() {
    this._foundryHelpers = new FoundryHelpers();
    this._dynamicEffectsAdder = new DynamicEffectsAdder();
    this._settings = new Settings();
  }

  /**
   * Toggles an effect on or off by name on an actor by UUID
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {boolean} params.overlay - if the effect is an overlay or not
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   */
  async toggleEffect(effectName, { overlay, uuids }) {
    for (const uuid of uuids) {
      if (await this.hasEffectApplied(effectName, uuid)) {
        await this.removeEffect({ effectName, uuid });
      } else {
        await this.addEffect({ effectName, uuid, overlay });
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
  hasEffectApplied(effectName, uuid) {
    const actor = this._foundryHelpers.getActorByUuid(uuid);
    return actor?.effects?.some(
      (activeEffect) =>
        activeEffect?.flags?.isConvenient &&
        activeEffect?.label == effectName &&
        !activeEffect?.disabled
    );
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to remove
   * @param {string} params.uuid - the uuid of the actor to remove the effect from
   * @param {string | undefined} params.origin - only removes the effect if the origin
   * matches. If undefined, removes any effect with the matching name
   */
  async removeEffect({ effectName, uuid, origin }) {
    const actor = this._foundryHelpers.getActorByUuid(uuid);

    let effectToRemove;

    if (origin) {
      effectToRemove = actor.effects.find(
        (activeEffect) =>
          activeEffect?.flags?.isConvenient &&
          activeEffect?.label == effectName &&
          activeEffect?.origin == origin
      );
    } else {
      effectToRemove = actor.effects.find(
        (activeEffect) =>
          activeEffect?.flags?.isConvenient && activeEffect?.label == effectName
      );
    }

    if (!effectToRemove) return;

    await effectToRemove.delete();
    log(`Removed effect ${effectName} from ${actor.name} - ${actor.id}`);
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {object} params - the effect parameters
   * @param {string} params.effectName - the name of the effect to add
   * @param {object} params.effectData - the effect data to add if effectName is not provided
   * @param {string} params.uuid - the uuid of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   */
  async addEffect({ effectName, effectData, uuid, origin, overlay }) {
    let effect = game.dfreds.effectInterface.findEffectByName(effectName);
    let activeEffectsToApply = [];

    if (!effect && effectData) {
      effect = new Effect(effectData);
    }

    const actor = this._foundryHelpers.getActorByUuid(uuid);

    if (effect.name.startsWith('Exhaustion')) {
      await this._removeAllExhaustionEffects(uuid);
    }

    if (effect.name == 'Unconscious') {
      activeEffectsToApply.push(this._getProneEffect());
    }

    if (effect.isDynamic) {
      await this._dynamicEffectsAdder.addDynamicEffects(effect, actor);
    }

    const activeEffectData = effect.convertToActiveEffectData({
      origin,
      overlay,
      includeAte: this._settings.integrateWithAte,
      includeTokenMagic: this._settings.integrateWithTokenMagic,
    });

    activeEffectsToApply.push(activeEffectData);

    await actor.createEmbeddedDocuments('ActiveEffect', activeEffectsToApply);

    log(`Added effect ${effect.name} to ${actor.name} - ${actor.id}`);
  }

  _getProneEffect() {
    let proneActiveEffectData =
      game.dfreds.effectInterface.findEffectByName('Prone');
    return proneActiveEffectData.convertToActiveEffectData({
      origin,
      overlay: false,
      includeAte: this._settings.integrateWithAte,
      includeTokenMagic: this._settings.integrateWithTokenMagic,
    });
  }

  async _removeAllExhaustionEffects(uuid) {
    await this.removeEffect({ effectName: 'Exhaustion 1', uuid });
    await this.removeEffect({ effectName: 'Exhaustion 2', uuid });
    await this.removeEffect({ effectName: 'Exhaustion 3', uuid });
    await this.removeEffect({ effectName: 'Exhaustion 4', uuid });
    await this.removeEffect({ effectName: 'Exhaustion 5', uuid });
  }
}
