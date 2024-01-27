import Constants from '../constants.js';
import EffectHelpers from './effect-helpers.js';
import Settings from '../settings.js';
import DynamicEffectsAdderDnd5 from '../systems/dnd5e/dynamic-effects-adder-dnd5e.js';
import DynamicEffectsAdderGeneric from '../systems/generic/dynamic-effects-adder-generic.js';
import DynamicEffectsAdderSw5e from '../systems/sw5e/dynamic-effects-adder-sw5e.js';

/**
 * Handles adding dynamic effects for certain effects
 */
export default class DynamicEffectsAdder {

  constructor() {
    this._effectHelpers = new EffectHelpers();
    this._settings = new Settings();
    if (game.system.id === 'dnd5e') {
      this._addDynamicEffectsAbstract = new DynamicEffectsAdderDnd5(this._effectHelpers, this._settings);
    } else if (game.system.id === 'sw5e') {
      this._addDynamicEffectsAbstract = new DynamicEffectsAdderSw5e(this._effectHelpers, this._settings);
    } else {
      this._addDynamicEffectsAbstract = new DynamicEffectsAdderGeneric(this._effectHelpers, this._settings);
    }
  }

  /**
   * Adds dynamic effects for specific effects
   *
   * @param {object} effect - the object form of an ActiveEffect to handle
   * @param {Actor} actor - the affected actor
   */
  async addDynamicEffects(effect, actor) {
    return await this._addDynamicEffectsAbstract.addDynamicEffects(effect, actor);
  }

}
