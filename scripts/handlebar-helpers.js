import Settings from './settings.js';

export default class HandlebarHelpers {
  constructor() {
    this._settings = new Settings();
  }

  registerHelpers() {
    this._registerHasAtlChangesHelper();
    this._registerHasTokenMagicChangesHelper();
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
