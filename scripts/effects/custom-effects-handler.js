import Effect from './effect.js';
import Settings from '../settings.js';
import log from '../logger.js';
import FoundryHelpers from '../foundry-helpers.js';

/**
 * Handles initializing, creating, editing, and deleting custom effects.
 */
export default class CustomEffectsHandler {
  constructor() {
    this._foundryHelpers = new FoundryHelpers();
    this._settings = new Settings();
  }

  /**
   * Initializes the custom effect
   */
  initialize() {
    const item = this._findCustomEffectsItem();
    if (!item) return;

    const customEffects = item.effects
      .filter((effect) => this._isValid(effect))
      .map((effect) => this._convertToEffectClass(effect));

    game.dfreds.effects.customEffects = customEffects;
  }

  /**
   * Deletes invalid custom effects
   *
   * @returns {Promise} resolves when all invalid effects are deleted
   */
  deleteInvalidEffects() {
    const item = this._findCustomEffectsItem();
    if (!item) return;

    const invalidCustomEffectIds = item.effects
      .filter((effect) => !this._isValid(effect))
      .map((effect) => effect.id);

    return item.deleteEmbeddedDocuments('ActiveEffect', invalidCustomEffectIds);
  }

  _isValid(effect) {
    const hasNonDefaultName =
      effect.data.label !== game.i18n.localize('DND5E.EffectNew');
    const hasChanges = effect.data.changes.length > 0;
    const isCustomConvenient = effect.data.flags.isCustomConvenient;

    return (hasNonDefaultName || hasChanges) && isCustomConvenient;
  }

  _convertToEffectClass(effect) {
    const atlChanges = effect.data.changes.filter((changes) =>
      changes.key.startsWith('ATL')
    );
    const tokenMagicChanges = effect.data.changes.filter(
      (changes) => changes.key === 'macro.tokenMagic'
    );
    const changes = effect.data.changes.filter(
      (change) =>
        !change.key.startsWith('ATL') && change.key !== 'macro.tokenMagic'
    );

    return new Effect({
      customId: effect.id,
      name: effect.data.label,
      description: effect.data.flags.customEffectDescription,
      icon: effect.data.icon,
      tint: effect.data.tint,
      seconds: effect.data.duration.seconds,
      rounds: effect.data.duration.rounds,
      turns: effect.data.duration.turns,
      flags: effect.data.flags,
      changes,
      atlChanges,
      tokenMagicChanges,
    });
  }

  /**
   * Creates a new custom effect on the custom effect item and renders its sheet
   */
  async createNewCustomEffect() {
    const item = await this._findOrCreateCustomEffectsItem();
    const effects = await item.createEmbeddedDocuments('ActiveEffect', [
      {
        label: game.i18n.localize('DND5E.EffectNew'),
        icon: 'icons/svg/aura.svg',
        origin: item.uuid,
        'duration.rounds': undefined,
        disabled: false,
        flags: {
          isCustomConvenient: true,
        },
      },
    ]);
    effects[0].sheet.render(true);
  }

  /**
   * Opens the configuration sheet for the custom effect corresponding with the custom ID
   *
   * @param {Effect} effect - the effect to edit
   */
  async editCustomEffect(effect) {
    const item = await this._findCustomEffectsItem();
    const activeEffect = item.effects.find(
      (activeEffect) => activeEffect.id === effect.customId
    );
    activeEffect.sheet.render(true);
  }

  /**
   * Deletes the custom effect corresponding with the custom ID
   *
   * @param {Effect} effect - the effect to delete
   * @returns {Promise} resolves when the active effect is deleted
   */
  async deleteCustomEffect(effect) {
    if (this._settings.isStatusEffect(effect.name)) {
      this._settings.removeStatusEffect(effect.name);
    }

    const item = await this._findCustomEffectsItem();
    return item.deleteEmbeddedDocuments('ActiveEffect', [effect.customId]);
  }

  /**
   * Duplicates an exisiting effect
   *
   * @param {Effect} effect - the effect to duplicate
   */
  async duplicateExistingEffect(effect) {
    const item = await this._findOrCreateCustomEffectsItem();
    const effects = await item.createEmbeddedDocuments('ActiveEffect', [
      {
        label: effect.name,
        icon: effect.icon,
        tint: effect.tint,
        duration: {
          seconds: effect.seconds,
          rounds: effect.rounds,
          turns: effect.turns,
        },
        flags: {
          isCustomConvenient: true,
          customEffectDescription: effect.description,
        },
        origin: item.uuid,
        changes: [
          ...effect.changes,
          ...effect.atlChanges,
          ...effect.tokenMagicChanges,
        ],
      },
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
                  item.importFromJSON(json);
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
}
