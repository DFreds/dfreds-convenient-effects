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
    this._registerIsGmHelper();
    this._registerHasNestedEffectsHelper();
    this._registerIsStatusEffectHelper();
    this._registerHasMidiQoLChangesHelper();
    this._registerHasAtlChangesHelper();
    this._registerHasTokenMagicChangesHelper();
  }

  _registerIsGmHelper() {
    Handlebars.registerHelper('isGm', (options) => {
      return game.user.isGM ? options.fn(this) : options.inverse(this);
    });
  }

  _registerHasNestedEffectsHelper() {
    Handlebars.registerHelper('hasNestedEffects', (effect, options) => {
      if (effect.nestedEffects.length > 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
  }

  _registerIsStatusEffectHelper() {
    Handlebars.registerHelper('isStatusEffect', (effect, options) => {
      if (
        this._settings.modifyStatusEffects !== 'none' &&
        this._settings.isStatusEffect(effect.name)
      ) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });
  }

  _registerHasMidiQoLChangesHelper() {
    Handlebars.registerHelper('hasMidiQoLChanges', (effect, options) => {
      const anyNestedHaveMidiChanges = effect.nestedEffects
        .flatMap((nestedEffect) => nestedEffect.changes)
        .some((change) => change.key.startsWith('flags.midi-qol'));

      const effectHasMidiQoLChanges = effect.changes.some((change) =>
        change.key.startsWith('flags.midi-qol')
      );

      if (effectHasMidiQoLChanges || anyNestedHaveMidiChanges) {
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
