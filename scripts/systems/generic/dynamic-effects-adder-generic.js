import EffectHelpers from '../../effects/effect-helpers.js';
import Settings from '../../settings.js';

/**
 * Handles adding dynamic effects for certain effects
 */
export default class DynamicEffectsAdderGeneric {
  constructor() {
    this._effectHelpers = new EffectHelpers();
    this._settings = new Settings();
  }

  /**
   * Adds dynamic effects for specific effects
   *
   * @param {object} effect - the object form of an ActiveEffect to handle
   * @param {Actor} actor - the affected actor
   */
  async addDynamicEffects(effect, actor) {
    // NOTE: likely nothing will ever go here for generic systems
  }
}
