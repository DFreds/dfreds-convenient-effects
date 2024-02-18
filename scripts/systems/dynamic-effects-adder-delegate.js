import dnd5e from './dnd5e/dnd5e.js';
import DynamicEffectsAdderDnd5e from './dnd5e/dynamic-effects-adder-dnd5e.js';
import DynamicEffectsAdderGeneric from './generic/dynamic-effects-adder-generic.js';

export default class DynamicEffectsAdderDelegate {
  constructor() {
    this._dynamicEffectsAdder = this._retrieveDynamicEffectsAdder();
  }

  /**
   * Adds dynamic effects for specific effects
   *
   * @param {object} effect - the object form of an ActiveEffect to handle
   * @param {Actor} actor - the affected actor
   */
  async addDynamicEffects(effect, actor) {
    await this._dynamicEffectsAdder.addDynamicEffects(effect, actor);
  }

  _retrieveDynamicEffectsAdder() {
    let dynamicEffectsAdder = new DynamicEffectsAdderGeneric();

    if (
      game.system.id === dnd5e.SYSTEM_ID ||
      game.system.id === dnd5e.SW_5E_ID
    ) {
      dynamicEffectsAdder = new DynamicEffectsAdderDnd5e();
    }

    return dynamicEffectsAdder;
  }
}
