import CustomEffectsHandler from '../effects/custom-effects-handler.js';
import DynamicEffectsAdder from '../effects/dynamic-effects-adder.js';
import FoundryHelpers from '../foundry-helpers.js';
import Settings from '../settings.js';

/**
 * Controller class that handles events from the app and manipulating the underlying Foundry data
 */
export default class ConvenientEffectsController {
  /**
   * Initializes the controller and its dependencies
   *
   * @param {ConvenientEffectsApp} viewMvc - the app that the controller can interact with
   */
  constructor(viewMvc) {
    this._viewMvc = viewMvc;

    this._customEffectsHandler = new CustomEffectsHandler();
    this._dynamicEffectsAdder = new DynamicEffectsAdder();
    this._foundryHelpers = new FoundryHelpers();
    this._settings = new Settings();
  }

  /**
   * Configures and returns the data that the app will send to the template
   *
   * @returns the data to pass to the template
   */
  get data() {
    this._customEffectsHandler.initialize();

    return {
      folders: [
        {
          label: 'Favorites',
          effects: this._fetchFavorites(),
        },
        {
          label: 'Custom',
          effects: this._fetchUnfavoritedCustomEffects(),
        },
        {
          label: 'Conditions',
          effects: this._fetchUnfavoritedConditions(),
        },
        {
          label: 'Spells',
          effects: this._fetchUnfavoritedSpells(),
        },
        {
          label: 'Class Features',
          effects: this._fetchUnfavoritedClassFeatures(),
        },
        {
          label: 'Equipment',
          effects: this._fetchUnfavoritedEquipment(),
        },
        {
          label: 'Other',
          effects: this._fetchUnfavoritedOther(),
        },
      ],
    };
  }

  _fetchFavorites() {
    return this._settings.favoriteEffectNames
      .map((name) => {
        return game.dfreds.effects.all.find((effect) => effect.name == name);
      })
      .filter((effect) => effect)
      .sort((a, b) => {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
  }

  _fetchUnfavoritedCustomEffects() {
    const effects = game.dfreds.effects;
    return effects.customEffects.filter(
      (effect) => !this._settings.isFavoritedEffect(effect.name)
    );
  }

  _fetchUnfavoritedConditions() {
    const effects = game.dfreds.effects;
    return effects.conditions.filter(
      (effect) =>
        !this._settings.isFavoritedEffect(effect.name) && effect.isViewable
    );
  }

  _fetchUnfavoritedSpells() {
    const effects = game.dfreds.effects;
    return effects.spells.filter(
      (effect) =>
        !this._settings.isFavoritedEffect(effect.name) && effect.isViewable
    );
  }

  _fetchUnfavoritedClassFeatures() {
    const effects = game.dfreds.effects;
    return effects.classFeatures.filter(
      (effect) =>
        !this._settings.isFavoritedEffect(effect.name) && effect.isViewable
    );
  }

  _fetchUnfavoritedEquipment() {
    const effects = game.dfreds.effects;
    return effects.equipment.filter(
      (effect) =>
        !this._settings.isFavoritedEffect(effect.name) && effect.isViewable
    );
  }

  _fetchUnfavoritedOther() {
    const effects = game.dfreds.effects;
    return effects.other.filter(
      (effect) =>
        !this._settings.isFavoritedEffect(effect.name) && effect.isViewable
    );
  }

  /**
   * Remove the collapsed class from all saved, expanded folders
   */
  expandSavedFolders() {
    this._settings.expandedFolders.forEach((folderName) => {
      this._viewMvc.expandFolder(folderName);
    });
  }

  /**
   * Handles clicks on the create effect button
   *
   * @param {MouseEvent} event
   */
  async onCreateEffectClick(event) {
    await this._customEffectsHandler.createNewCustomEffect();
  }

  /**
   * Handle editing the custom effect
   *
   * @param {jQuery} effectItem - jQuery element representing the effect list item
   */
  async onEditEffectClick(effectItem) {
    const effectName = effectItem.data().effectName;
    const customEffect = game.dfreds.effects.customEffects.find(
      (effect) => effect.name === effectName
    );

    await this._customEffectsHandler.editCustomEffect(customEffect.customId);
  }

  /**
   * Handle deleting the custom effect
   *
   * @param {jQuery} effectItem - jQuery element representing the effect list item
   */
  async onDeleteEffectClick(effectItem) {
    const effectName = effectItem.data().effectName;
    const customEffect = game.dfreds.effects.customEffects.find(
      (effect) => effect.name === effectName
    );

    await this._customEffectsHandler.deleteCustomEffect(customEffect.customId);
    this._viewMvc.render();
  }

  /**
   * Handles clicks on the reset status effects button
   *
   * @param {MouseEvent} event
   */
  async onResetStatusEffectsClick(event) {
    return Dialog.confirm({
      title: 'Reset Status Effects',
      content:
        '<h4>Are You Sure?</h4><p>This will reset all configured status effects to the module defaults and reload Foundry.',
      yes: async () => {
        await this._settings.resetStatusEffects();
        window.location.reload();
      },
    });
  }

  /**
   * Handles clicks on the collapse all button
   *
   * @param {MouseEvent} event
   */
  async onCollapseAllClick(event) {
    this._viewMvc.collapseAllFolders();
    await this._settings.clearExpandedFolders();
  }

  /**
   * Handles clicks on folders by collapsing or expanding them
   *
   * @param {MouseEvent} event - event that corresponds to clicking on the folder
   */
  async onFolderClick(event) {
    let folderLabel = event.currentTarget.parentElement.dataset.folderLabel;

    if (this._viewMvc.isFolderCollapsed(folderLabel)) {
      this._viewMvc.expandFolder(folderLabel);
    } else {
      this._viewMvc.collapseFolder(folderLabel);
    }

    if (this._settings.isFolderExpanded(folderLabel)) {
      await this._settings.removeExpandedFolder(folderLabel);
    } else {
      await this._settings.addExpandedFolder(folderLabel);
    }
  }

  /**
   * Handles clicks on effect items by toggling them on or off on selected tokens
   *
   * @param {MouseEvent} event - event that corresponds to clicking an effect item
   */
  async onEffectClick(event) {
    const effectName = event.target.innerText
      ? event.target.innerText
      : event.target.title;

    await game.dfreds.effectInterface.toggleEffect(effectName);
  }

  /**
   * Handle adding the effect to the favorites settings and to the favorites folder
   *
   * @param {jQuery} effectItem - jQuery element representing the effect list item
   */
  async onAddFavorite(effectItem) {
    const effectName = effectItem.data().effectName;

    // Don't add favorites twice
    if (this._settings.isFavoritedEffect(effectName)) return;

    await this._settings.addFavoriteEffect(effectName);
    this._viewMvc.render();
  }

  /**
   * Handle removing the effect from the favorites settings and from the favorites folder
   *
   * @param {jQuery} effectItem - jQuery element representing the effect list item
   */
  async onRemoveFavorite(effectItem) {
    const effectName = effectItem.data().effectName;

    await this._settings.removeFavoriteEffect(effectName);
    this._viewMvc.render();
  }

  /**
   * Handle adding/removing the effect from the to/from the status effect settings
   *
   * @param {jQuery} effectItem - jQuery element representing the effect list item
   */
  async onToggleStatusEffect(effectItem) {
    const effectName = effectItem.data().effectName;

    if (this._settings.isStatusEffect(effectName)) {
      await this._settings.removeStatusEffect(effectName);
    } else {
      await this._settings.addStatusEffect(effectName);
    }

    this._viewMvc.showReloadRequired();
    this._viewMvc.render();
  }

  /**
   * Handles starting the drag for effect items
   *
   * @param {DragEvent} event - event that corresponds to the drag start
   */
  onEffectDragStart(event) {
    const effectName = event.target.dataset.effectName;
    event.dataTransfer.setData('text/plain', effectName);
  }

  /**
   * Handles dragging an effect over a folder
   *
   * @param {DragEvent} event - event that corresponds to the drag over
   */
  onFolderDragOver(event) {
    if (!this._isEventTargetFavorites(event)) return;

    event.preventDefault();
    this._viewMvc.addDropTargetClassToFavorites();
  }

  /**
   * Handles dragging an effect off of a folder
   *
   * @param {DragEvent} event - event that corresponds to the drag leave
   */
  onFolderDragLeave(event) {
    if (!this._isEventTargetFavorites(event)) return;

    event.preventDefault();
    this._viewMvc.removeDropTargetClassFromFavorites();
  }

  /**
   * Handles dropping an effect onto a folder
   *
   * @param {DragEvent} event - event that corresponds to the drop
   */
  async onDropOntoFolder(event) {
    if (!this._isValidEffect(event) || !this._isEventTargetFavorites(event)) {
      return;
    }

    const effectName = event.dataTransfer.getData('text/plain');

    // Don't add favorites twice
    if (!this._settings.isFavoritedEffect(effectName)) {
      await this._settings.addFavoriteEffect(effectName);
    }

    this._viewMvc.render();
  }

  /**
   * Handles search text changes
   *
   * @param {KeyboardEvent} event - event that corresponds to the key press
   * @param {string} query - string representation of the entered search text
   * @param {RegExp} regex - the regex representation of the entered search text
   * @param {HTML} html - the html the SearchFilter is being applied to
   */
  onSearchTextChange(event, query, regex, html) {
    const isSearch = !!query;

    let matchingItems = {};

    if (isSearch) {
      matchingItems = this._getMatchingItems(regex);
    }

    for (let el of html.querySelectorAll('.directory-item')) {
      let isEntity = el.classList.contains('entity');
      let isFolder = el.classList.contains('folder');

      if (isEntity) {
        let match =
          isSearch && matchingItems.effectNames.has(el.dataset.effectName);
        el.style.display = !isSearch || match ? 'flex' : 'none';
      } else if (isFolder) {
        let match =
          isSearch && matchingItems.folderLabels.has(el.dataset.folderLabel);
        el.style.display = !isSearch || match ? 'flex' : 'none';

        // Expand folders with matches
        if (match) el.classList.remove('collapsed');
        else
          el.classList.toggle(
            'collapsed',
            !this._settings.isFolderExpanded(el.dataset.folderLabel)
          );
      }
    }
  }

  _getMatchingItems(regex) {
    let effectNames = new Set();
    let folderLabels = new Set();

    for (let folder of this.data.folders) {
      for (let effect of folder.effects) {
        if (regex.test(SearchFilter.cleanQuery(effect.name))) {
          effectNames.add(effect.name);
          folderLabels.add(folder.label);
        }
      }
    }

    return {
      effectNames,
      folderLabels,
    };
  }

  // Fixes bug when dragging over any item onto the convenient effects
  _isValidEffect(event) {
    const effectName = event.dataTransfer.getData('text/plain');
    return game.dfreds.effects.all.some((effect) => effect.name === effectName);
  }

  _isEventTargetFavorites(event) {
    return event.currentTarget.dataset.folderLabel === 'Favorites';
  }
}
