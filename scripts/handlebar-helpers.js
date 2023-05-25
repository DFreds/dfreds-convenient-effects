import Constants from './constants.js';
import EffectHelpers from './effects/effect-helpers.js';
import Settings from './settings.js';

/**
 * Handles setting up all handlebar helpers
 */
export default class HandlebarHelpers {
  constructor() {
    this._effectHelpers = new EffectHelpers();
    this._settings = new Settings();
  }

  /**
   * Registers the handlebar helpers
   */
  registerHelpers() {
    this._registerIncHelper();
    this._registerIsGmHelper();
    this._registerCanCreateEffectsHelper();
    this._registerIfCustomFolderHelper();
    this._registerConvenientIconsHelper();
    this._registerEffectDescriptionHelper();
  }

  _registerIncHelper() {
    Handlebars.registerHelper('inc', (value) => {
      return parseInt(value) + 1;
    });
  }

  _registerIsGmHelper() {
    Handlebars.registerHelper('isGm', () => {
      return game.user.isGM;
    });
  }

  _registerCanCreateEffectsHelper() {
    Handlebars.registerHelper('canCreateEffects', () => {
      return game.user.isGM || this._settings.allowPlayerCustomEffects;
    });
  }

  _registerIfCustomFolderHelper() {
    Handlebars.registerHelper('isCustomFolder', (folderId) => {
      return folderId === 'custom';
    });
  }

  _registerHasNestedEffectsHelper() {
    Handlebars.registerHelper('hasNestedEffects', (effect) => {
      const nestedEffectNames =
        effect.getFlag(Constants.MODULE_ID, Constants.FLAGS.NESTED_EFFECTS) ??
        [];

      return nestedEffectNames.length > 0;
    });
  }

  _registerConvenientIconsHelper() {
    Handlebars.registerHelper('convenientIcons', (effect) => {
      let icons = '';

      const nestedEffectNames =
        effect.getFlag(Constants.MODULE_ID, Constants.FLAGS.NESTED_EFFECTS) ??
        [];

      const nestedEffects = nestedEffectNames
        .map((nestedEffect) =>
          game.dfreds.effectInterface.findEffectByName(nestedEffect)
        )
        .filter((effect) => effect !== undefined);

      const subChanges = nestedEffects.flatMap(
        (nestedEffect) => nestedEffect.changes
      );

      const allChanges = [...effect.changes, ...subChanges];

      icons += this._getStatusEffectIcon(effect);
      icons += this._getNestedEffectsIcon(nestedEffects);
      icons += this._getMidiIcon(allChanges);
      icons += this._getWireIcon(allChanges);
      icons += this._getAtlIcon(allChanges);
      icons += this._getTokenMagicIcon(allChanges);

      return icons;
    });
  }

  _registerEffectDescriptionHelper() {
    Handlebars.registerHelper('effectDescription', (effect) => {
      return this._effectHelpers.getDescription(effect);
    });
  }

  _getStatusEffectIcon(effect) {
    return this._settings.modifyStatusEffects !== 'none' &&
      this._settings.isStatusEffect(effect.name)
      ? "<i class='fas fa-street-view integration-icon' title='Token Status Effect'></i>"
      : '';
  }

  _getNestedEffectsIcon(nestedEffects) {
    return nestedEffects.length > 0
      ? "<i class='fas fa-tree integration-icon' title='Nested Effects'></i> "
      : '';
  }

  _getMidiIcon(changes) {
    return changes.some((change) => change.key.startsWith('flags.midi-qol'))
      ? "<i class='fas fa-dice-d20 integration-icon' title='Midi-QoL Effects'></i> "
      : '';
  }

  _getWireIcon(changes) {
    return changes.some((change) => change.key.startsWith('flags.wire'))
      ? "<i class='fas fa-plug integration-icon' title='Wire Effects'></i> "
      : '';
  }

  _getAtlIcon(changes) {
    return changes.some((change) => change.key.startsWith('ATL'))
      ? "<i class='fas fa-lightbulb integration-icon' title='ATL Effects'></i> "
      : '';
  }

  _getTokenMagicIcon(changes) {
    return changes.some((change) => change.key.startsWith('macro.tokenMagic'))
      ? "<i class='fas fa-magic integration-icon' title='Token Magic Effects'></i> "
      : '';
  }
}
