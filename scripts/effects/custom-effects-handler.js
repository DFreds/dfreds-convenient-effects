import EffectHelpers from './effect-helpers.js';
import FoundryHelpers from '../foundry-helpers.js';
import Settings from '../settings.js';
import log from '../logger.js';

/**
 * Handles initializing, creating, editing, and deleting custom effects.
 */
export default class CustomEffectsHandler {
  constructor() {
    this._effectHelpers = new EffectHelpers();
    this._foundryHelpers = new FoundryHelpers();
    this._settings = new Settings();
  }

  /**
   * Checks if a custom effect exists with the provided name
   *
   * @param {string} effectName - name of the effect to check if it is custom
   * @returns {boolean} true if a custom effect exists with the name
   */
  isCustomEffect(effectName) {
    const item = this._findCustomEffectsItem();
    return item && item.effects.find((effect) => effect.name == effectName);
  }

  /**
   * Gets all custom effects
   *
   * @returns {ActiveEffect[]} the list of custom effects defined on the custom item
   */
  getCustomEffects() {
    const item = this._findCustomEffectsItem();
    if (!item) return [];

    let customEffects = Array(...item.effects).map((effect) => {
      effect.duration.startTime = null;
      effect.duration.startRound = null;
      effect.duration.startTurn = null;
      return effect;
    });
    customEffects.sort((a, b) => {
      let nameA = a.name.toUpperCase(); // ignore upper and lowercase
      let nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    return customEffects;
  }

  /**
   * Creates a new custom effect on the custom effect item and renders its sheet
   */
  async createNewCustomEffect() {
    const item = await this._findOrCreateCustomEffectsItem();
    const newEffect = this._effectHelpers.createActiveEffect({
      name: 'New Effect',
      origin: item.uuid,
    });

    const effects = await item.createEmbeddedDocuments('ActiveEffect', [
      newEffect,
    ]);

    effects[0].sheet.render(true);
  }

  /**
   * Creates a new custom effect on the custom effect
   *
   * @param {object} params - the params for adding an effect
   * @param {object[]} params.activeEffects - array of active effects to add
   * @returns {Promise} a promise that resolves when the active effects have finished being added
   */
  async createNewCustomEffectsWith({ activeEffects }) {
    const item = await this._findOrCreateCustomEffectsItem();
    const customEffects = activeEffects.map((activeEffect) => {
      if (!activeEffect.origin) {
        activeEffect.origin = item.uuid;
      }
      return this._effectHelpers.createActiveEffect({ ...activeEffect });
    });
    return item.createEmbeddedDocuments('ActiveEffect', customEffects);
  }

  /**
   * Opens the configuration sheet for the custom effect corresponding with the custom ID
   *
   * @param {ActiveEffect} effect - the effect to edit
   */
  async editCustomEffect(effect) {
    const item = await this._findCustomEffectsItem();
    const activeEffect = item.effects.find(
      (activeEffect) => activeEffect.id === effect.id
    );
    activeEffect.sheet.render(true);
  }

  /**
   * Deletes the custom effect corresponding with the custom ID
   *
   * @param {ActiveEffect} effect - the effect to delete
   * @returns {Promise} resolves when the active effect is deleted
   */
  async deleteCustomEffect(effect) {
    const item = await this._findCustomEffectsItem();
    return item.deleteEmbeddedDocuments('ActiveEffect', [effect.id]);
  }

  /**
   * Duplicates an exisiting effect
   *
   * @param {ActiveEffect} effect - the effect to duplicate
   */
  async duplicateExistingEffect(effect) {
    const item = await this._findOrCreateCustomEffectsItem();
    const effects = await item.createEmbeddedDocuments('ActiveEffect', [
      effect,
    ]);

    effects[0].sheet.render(true);
  }

  /**
   * Exports all custom effects on the custom item to JSON
   */
  async exportCustomEffectsToJson() {
    const item = await this._findOrCreateCustomEffectsItem();
    item.exportToJSON();
  }

  /**
   * Imports JSON to the custom effects item via a dialog
   */
  async importCustomEffectsFromJson() {
    const item = await this._findOrCreateCustomEffectsItem();

    const content = await renderTemplate('templates/apps/import-data.html', {
      hint1: game.i18n.format('DOCUMENT.ImportDataHint1', {
        document: item.documentName,
      }),
      hint2: game.i18n.format('DOCUMENT.ImportDataHint2', {
        name: item.name,
      }),
    });

    // NOTE: this is taken from foundry, wrapped in a promise by me
    const importPromise = new Promise((resolve, reject) => {
      new Dialog(
        {
          title: `Import Data: ${item.name}`,
          content: content,
          buttons: {
            import: {
              icon: '<i class="fas fa-file-import"></i>',
              label: 'Import',
              callback: (html) => {
                const form = html.find('form')[0];
                if (!form.data.files.length) {
                  return ui.notifications.error(
                    'You did not upload a data file!'
                  );
                }
                readTextFromFile(form.data.files[0]).then((json) => {
                  let jsonData = this._combinePrevAndNewCustomEffects(
                    item,
                    json
                  );
                  item.importFromJSON(jsonData);
                  resolve(true);
                });
              },
            },
            no: {
              icon: '<i class="fas fa-times"></i>',
              label: 'Cancel',
            },
          },
          default: 'import',
        },
        {
          width: 400,
        }
      ).render(true);
    });

    await importPromise;
    this._foundryHelpers.renderConvenientEffectsAppIfOpen();
  }

  async _findOrCreateCustomEffectsItem() {
    return (
      this._findCustomEffectsItem() ?? (await this._createCustomEffectsItem())
    );
  }

  _findCustomEffectsItem() {
    return game.items.get(this._settings.customEffectsItemId);
  }

  async _createCustomEffectsItem() {
    const item = await CONFIG.Item.documentClass.create({
      name: 'Custom Convenient Effects',
      img: 'modules/dfreds-convenient-effects/images/magic-palm.svg',
      type: 'consumable',
    });

    log(`Creating custom item with ${item.id}`);
    await this._settings.setCustomEffectsItemId(item.id);

    return item;
  }

  _combinePrevAndNewCustomEffects(item, json) {
    let itemDataEffects = Array.from(item.effects);
    let jsonData = JSON.parse(json);

    jsonData.effects.push(...itemDataEffects);

    return JSON.stringify(jsonData, null, 2);
  }
}
