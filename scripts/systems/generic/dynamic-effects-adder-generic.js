import Constants from "../../constants";
import EffectHelpers from "../../effects/effect-helpers";
import Settings from "../../settings";

/**
 * Handles adding dynamic effects for certain effects
 */
export default class DynamicEffectsAdderGeneric {
  constructor(effectHelpers,settings) {
    this._effectHelpers = effectHelpers;
    this._settings = settings;
  }

  /**
   * Adds dynamic effects for specific effects
   *
   * @param {object} effect - the object form of an ActiveEffect to handle
   * @param {Actor} actor - the affected actor
   */
  async addDynamicEffects(effect, actor) {
    // TODO
  }

}
