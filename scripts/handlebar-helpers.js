import Settings from './settings.js';

/**
 * Handles setting up all handlebar helpers
 */
export default class HandlebarHelpers {
  constructor() {
    this._settings = new Settings();
  }

  /**
   * Registers the handlebar helpers
   */
  registerHelpers() {
    this._registerIsStatusEffectHelper();
    this._registerHasAtlChangesHelper();
    this._registerHasTokenMagicChangesHelper();
  }

  _registerIsStatusEffectHelper() {
    Handlebars.registerHelper('isStatusEffect', (effect, options) => {
      if (
        this._settings.statusEffectType !== 'none' &&
        this._settings.isStatusEffect(effect.name)
      ) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
  }

  _registerHasAtlChangesHelper() {
    Handlebars.registerHelper('hasAtlChanges', (effect, options) => {
      const anyNestedHaveAtlChanges = effect.nestedEffects.some(
        (effect) => effect.atlChanges.length > 0
      );
      if (
        this._settings.integrateWithAtl &&
        (effect.atlChanges.length > 0 || anyNestedHaveAtlChanges)
      ) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
  }

  _registerHasTokenMagicChangesHelper() {
    Handlebars.registerHelper('hasTokenMagicChanges', (effect, options) => {
      const anyNestedHaveTokenMagicChanges = effect.nestedEffects.some(
        (effect) => effect.tokenMagicChanges.length > 0
      );
      if (
        this._settings.integrateWithTokenMagic &&
        (effect.tokenMagicChanges.length > 0 || anyNestedHaveTokenMagicChanges)
      ) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
  }
}
