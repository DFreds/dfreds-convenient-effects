import Constants from '../constants.js';
import CustomEffectsHandler from './custom-effects-handler.js';
import EffectHelpers from './effect-helpers.js';
import Settings from '../settings.js';

/**
 * Defines all of the effect definitions
 */
export default class EffectDefinitions {
  constructor() {
    this._customEffectsHandler = new CustomEffectsHandler();
    this._effectHelpers = new EffectHelpers();
    this._settings = new Settings();

    this._flagPrefix = 'midi-qol';
    if (game.modules.get('wire')?.active) {
      this._flagPrefix = 'wire';
    }
  }

  initialize() {
    this._conditions = this.conditions;
    this._spells = this.spells;
    this._classFeatures = this.classFeatures;
    this._equipment = this.equipment;
    this._other = this.other;

    this._all = [
      ...this._conditions,
      ...this._spells,
      ...this._classFeatures,
      ...this._equipment,
      ...this._other,
    ];
  }

  /**
   * Get all effects
   *
   * @returns {ActiveEffect[]} all the effects
   */
  get all() {
    const customEffects = this._customEffectsHandler.getCustomEffects();
    return [...customEffects, ...this._all];
  }

  /**
   * Get all the condition effects
   *
   * @returns {ActiveEffect[]} all the condition effects
   */
  get conditions() {
    return (
      this._conditions ??
      this._effectHelpers.createActiveEffects(
        this._settings.defaultEffectDefinitions._conditions
      )
    );
  }

  /**
   * Get all the spell effects
   *
   * @returns {ActiveEffect[]} all the spell effects
   */
  get spells() {
    return (
      this._spells ??
      this._effectHelpers.createActiveEffects(
        this._settings.defaultEffectDefinitions._spells
      )
    );
  }

  /**
   * Get all the class feature effects
   *
   * @returns {ActiveEffect[]} all the class feature effects
   */
  get classFeatures() {
    return (
      this._classFeatures ??
      this._effectHelpers.createActiveEffects(
        this._settings.defaultEffectDefinitions._classFeatures
      )
    );
  }

  /**
   * Get all the equipment effects
   *
   * @returns {ActiveEffect[]} all the equipment effects
   */
  get equipment() {
    return (
      this._equipment ??
      this._effectHelpers.createActiveEffects(
        this._settings.defaultEffectDefinitions._equipment
      )
    );
  }

  /**
   * Get all the other effects
   *
   * @returns {ActiveEffect[]} all the other effects
   */
  get other() {
    return (
      this._other ??
      this._effectHelpers.createActiveEffects(
        this._settings.defaultEffectDefinitions._other
      )
    );
  }
}
