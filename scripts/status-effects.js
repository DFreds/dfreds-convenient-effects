import Settings from './settings.js';

/**
 * Initializes the status effects present on the token HUD
 */
export default class StatusEffects {
  constructor() {
    this._settings = new Settings();
  }

  initializeStatusEffects() {
    const conditions = game.dfreds.effects.conditions;
    const statusEffectType = this._settings.statusEffectType;

    if (statusEffectType === 'replace') {
      CONFIG.statusEffects = conditions.map((condition) => {
        return condition.convertToActiveEffectData();
      });
    } else if (statusEffectType === 'add') {
      CONFIG.statusEffects = CONFIG.statusEffects.concat(
        conditions.map((condition) => {
          return condition.convertToActiveEffectData();
        })
      );
    }
  }
}
