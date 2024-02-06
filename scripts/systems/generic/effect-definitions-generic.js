import CustomEffectsHandler from '../../effects/custom-effects-handler.js';
import EffectHelpers from '../../effects/effect-helpers.js';
import Settings from '../../settings.js';

export default class EffectDefintionsGeneric {
  constructor() {
    this._customEffectsHandler = new CustomEffectsHandler();
    this._effectHelpers = new EffectHelpers();
    this._settings = new Settings();
  }

  initialize() {
    this._all = [];
  }

  get all() {
    const customEffects = this._customEffectsHandler.getCustomEffects();
    return [...customEffects, this._all];
  }

  get folderStructure() {
    return [];
  }
}
