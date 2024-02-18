import CustomEffectsHandler from '../effects/custom-effects-handler.js';
import dnd5e from './dnd5e/dnd5e.js';
import EffectDefinitionsDnd5e from './dnd5e/effect-definitions-dnd5e.js';
import EffectDefintionsGeneric from './generic/effect-definitions-generic.js';

/**
 * Defines all of the effect definitions
 */
export default class EffectDefinitionsDelegate {
  constructor() {
    this._customEffectsHandler = new CustomEffectsHandler();
    this._effectDefinitions = this._retrieveEffectDefinitions();
  }

  initialize() {
    this._effectDefinitions.initialize();
  }

  /**
   * Get all effects
   *
   * @returns {ActiveEffect[]} all the effects
   */
  get all() {
    const customEffects = this._customEffectsHandler.getCustomEffects();
    return [...customEffects, ...this._effectDefinitions.all];
  }

  get folderStructure() {
    return this._effectDefinitions.folderStructure;
  }

  _retrieveEffectDefinitions() {
    let effectDefinitions = new EffectDefintionsGeneric();

    if (
      game.system.id === dnd5e.SYSTEM_ID ||
      game.system.id === dnd5e.SW_5E_ID
    ) {
      effectDefinitions = new EffectDefinitionsDnd5e();
    }

    return effectDefinitions;
  }
}
