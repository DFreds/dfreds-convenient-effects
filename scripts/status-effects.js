import Settings from './settings.js';

/**
 * Handles the status effects present on the token HUD
 */
export default class StatusEffects {
  constructor() {
    this._settings = new Settings();
  }

  /**
   * Initialize the token status effects based on the user configured settings.
   */
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

  /**
   * This function is called when a token status effect is toggled. If the
   * status effect is one added by the convenient effect module, it is handled
   * here. Otherwise, the original wrapper function is used.
   *
   * @param {Token5e} token - the token to toggle the effect on
   * @param {fn} wrapper - the original onToggleEffect function
   * @param {any[]} args - any arguments provided with the original onToggleEffect function
   */
  onToggleEffect({ token, wrapper, args }) {
    const [event] = args;
    const statusEffectId = event.currentTarget.dataset.statusId;
    if (statusEffectId.startsWith('Convenient Effect: ')) {
      event.preventDefault();
      event.stopPropagation();
      const effectName = statusEffectId.replace('Convenient Effect: ', '');
      game.dfreds.effectHandler.toggleStatusEffect(effectName, token);
    } else {
      wrapper(...args);
    }
  }
}
