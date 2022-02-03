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
    this._registerIfCustomFolderHelper();
    this._registerHasNestedEffectsHelper();
    this._registerIsStatusEffectHelper();
    this._registerHasMidiQoLChangesHelper();
    this._registerHasAtlChangesHelper();
    this._registerHasTokenMagicChangesHelper();
  }

  _registerIsGmHelper() {
    Handlebars.registerHelper('isGm', () => {
      return game.user.isGM;
    });
  }

  _registerIfCustomFolderHelper() {
    Handlebars.registerHelper('isCustomFolder', (folderId) => {
      return folderId === 'custom';
    });
  }

  _registerHasNestedEffectsHelper() {
    Handlebars.registerHelper('hasNestedEffects', (effect) => {
      return effect.nestedEffects.length > 0;
    });
  }

  _registerIsStatusEffectHelper() {
    Handlebars.registerHelper('isStatusEffect', (effect) => {
      return (
        this._settings.modifyStatusEffects !== 'none' &&
        this._settings.isStatusEffect(effect.name)
      );
    });
  }

  _registerHasMidiQoLChangesHelper() {
    Handlebars.registerHelper('hasMidiQoLChanges', (effect) => {
      const anyNestedHaveMidiChanges = effect.nestedEffects
        .flatMap((nestedEffect) => nestedEffect.changes)
        .some((change) => change.key.startsWith('flags.midi-qol'));

      const effectHasMidiQoLChanges = effect.changes.some((change) =>
        change.key.startsWith('flags.midi-qol')
      );

      return effectHasMidiQoLChanges || anyNestedHaveMidiChanges;
    });
  }

  _registerHasAtlChangesHelper() {
    Handlebars.registerHelper('hasAtlChanges', (effect) => {
      const anyNestedHaveAtlChanges = effect.nestedEffects.some(
        (effect) => effect.atlChanges.length > 0
      );
      return (
        this._settings.integrateWithAte &&
        (effect.atlChanges.length > 0 || anyNestedHaveAtlChanges)
      );
    });
  }

  _registerHasTokenMagicChangesHelper() {
    Handlebars.registerHelper('hasTokenMagicChanges', (effect) => {
      const anyNestedHaveTokenMagicChanges = effect.nestedEffects.some(
        (effect) => effect.tokenMagicChanges.length > 0
      );
      return (
        this._settings.integrateWithTokenMagic &&
        (effect.tokenMagicChanges.length > 0 || anyNestedHaveTokenMagicChanges)
      );
    });
  }
}
