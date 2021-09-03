export default class I18nHelper {
  constructor() {}

  /**
   * If midi-qol module is present and active
   *
   * @readonly
   * @memberof I18nHelper
   */
  get _usesMidiQol() {
    return game.modules.get('midi-qol')?.active;
  }

  i18nFormatFromKey(key, data = {}) {
    return this._prepareI18n(key, data);
  }

  i18nFromKey(key) {
    return this._prepareI18n(key, null);
  }

  i18nFromEffect(effect) {
    return this._prepareI18n(effect.customId, null);
  }

  i18nFormatFromEffect(effect, data = {}) {
    return this._prepareI18n(effect.customId, data);
  }

  _prepareI18n(customIdOrKey, data) {
    // TODO Check if is a customId effect or a standard key i18n

    let label = '';

    // Manage a "try and get" on DND5e and if nothing is founded use the module setting...
    // this can be useful in some case or for some strange update of DnD5e system...

    // This is a example done for the conditions ... if you like it we can do the same thing
    // for the feature and the spell SRD

    // An example that comes to mind is that the Dnd5e system has the label for "Exhaustion",
    // but it does not differ in the 5 levels except at the code level while we would only
    // need to show the labels "Exhaustion 1", "Exhaustion 2" , etc. not sure what the best solution can be

    if (customIdOrKey.startWith(MODULE_ID + '.condition')) {
      let keyDnd5e = customIdOrKey.replace(
        MODULE_ID + '.condition',
        'DND5E.Con'
      );
      if (data) {
        label = game.i18n.format(keyDnd5e, data);
      } else {
        label = game.i18n.localize(keyDnd5e);
      }
    }

    // If label is empty (so is not founded on Dnd5e system) we try again with the inner vocabolary
    if (data) {
      label = game.i18n.format(customIdOrKey, data);
    } else {
      label = game.i18n.localize(customIdOrKey);
    }

    // Check for midiqol...
    if (this._usesMidiQol) {
      // TODO do something and update the label
    }

    // this is the label property of the Effect class,
    return label;
  }
}
