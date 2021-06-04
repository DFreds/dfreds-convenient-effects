import DynamicEffectsAdder from '../dynamic-effects-adder.js';
import Settings from '../settings.js';

export default class ConvenientEffectsController {
  constructor() {
    this._settings = new Settings();
    this._dynamicEffectsAdder = new DynamicEffectsAdder();
  }

  /**
   * @param {ConvenientEffectsApp} value - the view
   */
  set viewMvc(value) {
    this._viewMvc = value;
  }

  get dataForView() {
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
  
  /**
   * 
   * @param {DragEvent} event 
   */
  onEffectDragStart(event) {
    const effectName = event.target.dataset.effectName;
    event.dataTransfer.setData('text/plain', effectName);
  }

  onFolderDragOver(event) {
    if (!this._isEventTargetFavorites(event)) {
      return;
    }
    event.preventDefault();
    this._viewMvc.addDropTargetClassToFavorites();
  }

  onFolderDragLeave(event) {
    if (!this._isEventTargetFavorites(event)) {
      return;
    }
    event.preventDefault();
    this._viewMvc.removeDropTargetClassFromFavorites();
  }

  onDropOntoFolder(event) {
    if (!this._isEventTargetFavorites(event)) {
      return;
    }
    this._viewMvc.removeDropTargetClassFromFavorites();

    const effectName = event.dataTransfer.getData('text/plain');

    // Don't add favorites twice
    if (this._settings.favoriteEffectNames.includes(effectName)) return;

    this._viewMvc.addEffectToFavoritesDirectory(effectName);
    this._settings.addFavoriteEffect(effectName);

    // Forces redraw and lose scroll position...
    // this.render();
  }

  onFolderClick(event) {
    let folderName = event.currentTarget.parentElement.dataset.folderLabel;
    this._viewMvc.toggleCollapsedClassOnFolder(folderName);

    if (this._settings.expandedFolders.includes(folderName)) {
      this._settings.removeExpandedFolder(folderName);
    } else {
      this._settings.addExpandedFolder(folderName);
    }
  }

  async onEffectClick(event) {
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
      this._viewMvc.notifyNoTokensSelected();
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

  _isEventTargetFavorites(event) {
    return event.currentTarget.dataset.folderLabel === 'Favorites';
  }
}