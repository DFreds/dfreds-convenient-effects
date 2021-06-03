import DynamicEffectsAdder from './dynamic-effects-adder.js';

export default class ConvenientEffectsApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'convenient-effects',
      classes: ['fxmaster', 'sidebar-popout'],
      title: 'Convenient Effects',
      popOut: true,
      width: 300,
      height: 900,
      resizable: true,
      template:
        'modules/dfreds-convenient-effects/templates/convenient-effects.html',
    });
  }

  constructor() {
    super();
    this._dynamicEffectsAdder = new DynamicEffectsAdder();
  }

  getData() {
    const effects = game.dfreds.effects;

    return {
      folders: [
        {
          label: 'Conditions',
          effects: effects.conditions,
        },
        {
          label: 'Spells',
          effects: effects.spells,
        },
        {
          label: 'Other',
          effects: effects.other,
        },
      ],
    };
  }

  /** @override */
  activateListeners(html) {
    const directory = html.find('.directory-list');
    directory.on('click', '.folder-header', this._toggleFolder.bind(this));

    const effectListItem = html.find('.convenient-effect');
    Array.from(effectListItem).forEach((listItem) => {
      listItem.addEventListener(
        'click',
        this._handleClickingListItem.bind(this)
      );
    });
  }

  _toggleFolder(event) {
    let folder = $(event.currentTarget.parentElement);
    let collapsed = folder.hasClass('collapsed');

    if (collapsed) {
      folder.removeClass('collapsed');
    } else {
      folder.addClass('collapsed');
    }
  }

  async _handleClickingListItem(event) {
    const toggledEffect = game.dfreds.effects.all.find(
      (effect) =>
        effect.name == event.target.innerText ||
        effect.name == event.target.title
    );
    await this._handleTogglingEffect(toggledEffect);
  }

  async _handleTogglingEffect(toggledEffect) {
    const controlledTokens = canvas.tokens.controlled;

    if (controlledTokens.length === 0) {
      ui.notifications.error('Please select a token');
      return;
    }

    for (const actor of controlledTokens.map((token) => token.actor)) {
      if (toggledEffect.isDynamic) {
        this._dynamicEffectsAdder.addDynamicEffects(toggledEffect, actor);
      }

      const activeEffecData = toggledEffect.convertToActiveEffectData();

      const effectToRemove = actor.data.effects.find(
        (effect) =>
          effect.data.label == 'Convenient Effect: ' + activeEffecData.name
      );

      if (effectToRemove) {
        await actor.deleteEmbeddedDocuments('ActiveEffect', [
          effectToRemove.id,
        ]);
      } else {
        await actor.createEmbeddedDocuments('ActiveEffect', [activeEffecData]);
      }
    }
  }
}
