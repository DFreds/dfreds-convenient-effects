import DynamicEffectsAdder from './dynamic-effects-adder.js';
import Settings from './settings.js';

export default class ConvenientEffectsApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'convenient-effects',
      classes: ['sidebar-popout'],
      title: 'Convenient Effects',
      popOut: true,
      width: 300,
      height: 600,
      resizable: true,
      template:
        'modules/dfreds-convenient-effects/templates/convenient-effects-app.html',
    });
  }

  constructor() {
    super();
    this._settings = new Settings();
    this._dynamicEffectsAdder = new DynamicEffectsAdder();
  }

  getData() {
    const effects = game.dfreds.effects;
    const expandedFolders = this._settings.expandedFolders;

    return {
      folders: [
        {
          label: 'Favorites',
          expanded: expandedFolders.includes('Favorites'),
          effects: this._fetchFavorites(),
        },
        {
          label: 'Conditions',
          expanded: expandedFolders.includes('Conditions'),
          effects: effects.conditions,
        },
        {
          label: 'Spells',
          expanded: expandedFolders.includes('Spells'),
          effects: effects.spells,
        },
        {
          label: 'Other',
          expanded: expandedFolders.includes('Other'),
          effects: effects.other,
        },
      ],
    };
  }

  _fetchFavorites() {
    return this._settings.favoriteEffectNames.map((name) => {
      return game.dfreds.effects.all.find((effect) => effect.name == name);
    }).sort((a, b) => {
      let nameA = a.name.toLowerCase();
      let nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

  /** @override */
  activateListeners(html) {
    const directory = html.find('.directory-list');

    // Drag events
    directory.on(
      'dragstart',
      '.convenient-effect',
      this._onEffectDragStart.bind(this)
    );
    directory.on(
      'dragover',
      '.folder',
      this._onFolderDragOverOrDragEnter.bind(this)
    );
    directory.on(
      'dragenter',
      '.folder',
      this._onFolderDragOverOrDragEnter.bind(this)
    );
    directory.on(
      'dragleave',
      '.folder',
      this._onFolderDragLeave.bind(this)
    );
    directory.on('drop', '.folder', this._onDropOntoFolder.bind(this));

    // Click handlers
    directory.on('click', '.folder-header', this._onFolderClick.bind(this));
    directory.on(
      'click',
      '.convenient-effect',
      this._onEffectClick.bind(this)
    );
  }

  _onEffectDragStart(event) {
    const effectName = event.target.id;
    event.originalEvent.dataTransfer.setData('text/plain', effectName);
  }

  _onFolderDragOverOrDragEnter(event) {
    if (event.currentTarget.dataset.folderLabel != 'Favorites') {
      return;
    }
    event.preventDefault();
    event.currentTarget.classList.add('droptarget');
  }

  _onFolderDragLeave(event) {
    if (event.currentTarget.dataset.folderLabel != 'Favorites') {
      return;
    }
    event.preventDefault();
    event.currentTarget.classList.remove('droptarget');
  }

  _onDropOntoFolder(event) {
    if (event.currentTarget.dataset.folderLabel != 'Favorites') {
      return;
    }
    event.currentTarget.classList.remove('droptarget');

    const effectName = event.originalEvent.dataTransfer.getData('text/plain');

    // Don't add favorites twice
    if (this._settings.favoriteEffectNames.includes(effectName)) return;

    const draggable = document.getElementById(effectName).cloneNode(true);

    // Add the element to the subdirectory list
    let folder = $(event.currentTarget);
    folder.find('.subdirectory').append(draggable);

    this._settings.addFavoriteEffect(effectName);

    // Forces redraw and lose scroll position...
    // this.render();
  }

  _onFolderClick(event) {
    let nameOfFolder = event.currentTarget.parentElement.dataset.folderLabel;
    let folder = $(event.currentTarget.parentElement);
    let collapsed = folder.hasClass('collapsed');

    if (collapsed) {
      this._settings.addExpandedFolder(nameOfFolder);
      folder.removeClass('collapsed');
    } else {
      this._settings.removeExpandedFolder(nameOfFolder);
      folder.addClass('collapsed');
    }
  }

  async _onEffectClick(event) {
    const toggledEffect = game.dfreds.effects.all.find(
      (effect) =>
        effect.name == event.target.innerText ||
        effect.name == event.target.title
    );
    await this._toggleEffect(toggledEffect);
  }

  async _toggleEffect(toggledEffect) {
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
