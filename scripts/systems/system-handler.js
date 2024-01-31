import DynamicEffectsAdderDnd5 from './dnd5e/dynamic-effects-adder-dnd5e.js';
import EffectDefinitionsDnd5e from './dnd5e/effect-definitions-dnd5e.js';
import DynamicEffectsAdderGeneric from './generic/dynamic-effects-adder-generic.js';
import EffectDefinitionsGeneric from './generic/effect-definitions-generic.js';
import DynamicEffectsAdderSw5e from './sw5e/dynamic-effects-adder-sw5e.js';
import EffectDefinitionsSw5e from './sw5e/effect-definitions-sw5e.js';

/**
 * Handles adding dynamic effects for certain effects
 */
export default class SystemHandler {

  static retrieveDynamicEffectsAdder(effectHelpers, settings) {
    let dynamicEffectsAbstract;
    if (game.system.id === 'dnd5e') {
      dynamicEffectsAbstract = new DynamicEffectsAdderDnd5(effectHelpers, settings);
    } else if (game.system.id === 'sw5e') {
      dynamicEffectsAbstract = DynamicEffectsAdderSw5e(effectHelpers, settings);
    } else {
      dynamicEffectsAbstract = DynamicEffectsAdderGeneric(effectHelpers, settings);
    }
    return dynamicEffectsAbstract;
  }

  static retrieveEffectDefinitions(showNestedEffects, flagPrefix = undefined){
    let effectDefinitionsAbstract;
    if (game.system.id === 'dnd5e') {
      flagPrefix = flagPrefix || 'midi-qol';
      if (game.modules.get('wire')?.active) {
        flagPrefix = 'wire';
      }
      effectDefinitionsAbstract = new EffectDefinitionsDnd5e();
    } else if (game.system.id === 'sw5e') {
      flagPrefix = flagPrefix || 'midi-qol';
      if (game.modules.get('wire')?.active) {
        flagPrefix = 'wire';
      }
      effectDefinitionsAbstract = new EffectDefinitionsSw5e();
    } else {
      effectDefinitionsAbstract = new EffectDefinitionsGeneric();
    }

    effectDefinitionsAbstract.initialize(showNestedEffects, flagPrefix);
    return effectDefinitionsAbstract;
  }
}
