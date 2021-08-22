import Effect from './effect.js';
import Settings from '../settings.js';
import log from '../logger.js';

/**
 * Handles initializing, creating, editing, and deleting custom effects.
 */
export default class CustomEffectsHandler {
  constructor() {
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

    const hasSameNameAsDefinedEffect = game.dfreds.effects.nonCustom.some(
      (definedEffect) => definedEffect.name === effect.data.label
    );
    if (hasSameNameAsDefinedEffect) {
      log(
        `Custom effect ${effect.data.label} is invalid because it has the same name as a predefined effect.`
      );
      return false;
    }

    return (hasNonDefaultName || hasChanges) && isCustomConvenient;
  }

  _convertToEffectClass(effect) {
    const atlChanges = effect.data.changes.filter((changes) =>
      changes.key.startsWith('ATL')
    );
    const tokenMagicChanges = effect.data.changes.filter(
      (changes) => changes.key === 'macro.tokenMagic'
    );
    return new Effect({
      customId: effect.id,
      name: effect.data.label,
      description: effect.data.flags.customEffectDescription,
      icon: effect.data.icon,
      seconds: effect.data.duration.seconds,
      turns: effect.data.duration.turns,
      flags: effect.data.flags,
      changes: effect.data.changes,
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
    // if (this._settings.isStatusEffect(effect.name)) {
    //   this._settings.removeStatusEffect(effect.name);
    // }
    const item = await this._findCustomEffectsItem();
    const activeEffect = item.effects.find(
      (activeEffect) => activeEffect.id === effect.customId
    );
    activeEffect.sheet.render(true);
  }

  /**
   * Deletes the custom effect corresponding with the custom ID
   *
   * @param {effect} effect - the effect to delete
   * @returns {Promise} resolves when the active effect is deleted
   */
  async deleteCustomEffect(effect) {
    if (this._settings.isStatusEffect(effect.name)) {
      this._settings.removeStatusEffect(effect.name);
    }

    const item = await this._findCustomEffectsItem();
    return item.deleteEmbeddedDocuments('ActiveEffect', [effect.customId]);
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

    await this._settings.setCustomEffectsItemId(item.id);

    return item;
  }
}
