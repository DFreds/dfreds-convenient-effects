import Effect from './effect.js';
import Settings from '../settings.js';

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

  _isValid(effect) {
    const hasNonDefaultName =
      effect.data.label !== game.i18n.localize('DND5E.EffectNew');
    const hasChanges = effect.data.changes.length > 0;
    const isCustomConvenient = effect.data.flags.isCustomConvenient;

    return (hasNonDefaultName || hasChanges) && isCustomConvenient;
  }

  _convertToEffectClass(effect) {
    return new Effect({
      customId: effect.id,
      name: effect.data.label,
      description: 'Custom', // TODO allow setting this somewhere?
      icon: effect.data.icon,
      seconds: effect.data.duration.seconds,
      turns: effect.data.duration.turns,
      flags: effect.data.flags,
      changes: this.changes, // TODO separate ATL and token magic ones
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

  //TODO test this
  async editCustomEffect(customId) {
    const item = await this._findCustomEffectsItem();
    const effect = item.effects.find((effect) => effect.id === customId);
    effect.sheet.render(true);
  }

  //TODO test this
  async deleteCustomEffect(customId) {
    const item = await this._findCustomEffectsItem();
    item.effects.delete(customId);
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
