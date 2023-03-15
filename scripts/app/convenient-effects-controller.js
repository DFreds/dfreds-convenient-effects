import Constants from '../constants.js';
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
   * @returns {Object} the data to pass to the template
   */
  get data() {
    return {
      folders: [
        {
          id: 'favorites',
          label: game.i18n.localize('ConvenientEffectsControllerFavorites'),
          effects: this._fetchFavorites(),
        },
        {
          id: 'custom',
          label: game.i18n.localize('ConvenientEffectsControllerCustom'),
          effects: this._fetchUnfavoritedCustomEffects(),
        },
        {
          id: 'conditions',
          label: game.i18n.localize('ConvenientEffectsControllerConditions'),
          effects: this._fetchUnfavoritedConditions(),
        },
        {
          id: 'spells',
          label: game.i18n.localize('ConvenientEffectsControllerSpells'),
          effects: this._fetchUnfavoritedSpells(),
        },
        {
          id: 'class-features',
          label: game.i18n.localize('ConvenientEffectsControllerClassFeatures'),
          effects: this._fetchUnfavoritedClassFeatures(),
        },
        {
          id: 'equipment',
          label: game.i18n.localize('ConvenientEffectsControllerEquipment'),
          effects: this._fetchUnfavoritedEquipment(),
        },
        {
          id: 'other',
          label: game.i18n.localize('ConvenientEffectsControllerOther'),
          effects: this._fetchUnfavoritedOther(),
        },
      ],
    };
  }

  _fetchFavorites() {
    return this._settings.favoriteEffectNames
      .map((name) => {
        return game.dfreds.effects.all.find((effect) => effect.label == name);
      })
      .filter((effect) => effect)
      .sort((a, b) => {
        let nameA = a.label.toLowerCase();
        let nameB = b.label.toLowerCase();

        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
  }

  _fetchUnfavoritedCustomEffects() {
    return this._customEffectsHandler
      .getCustomEffects()
      .filter((effect) => !this._settings.isFavoritedEffect(effect.label));
  }

  _fetchUnfavoritedConditions() {
    const effects = game.dfreds.effects;
    return effects.conditions.filter(
      (effect) =>
        !this._settings.isFavoritedEffect(effect.label) &&
        effect.getFlag(Constants.MODULE_ID, Constants.FLAGS.IS_VIEWABLE)
    );
  }

  _fetchUnfavoritedSpells() {
    const effects = game.dfreds.effects;
    return effects.spells.filter(
      (effect) =>
        !this._settings.isFavoritedEffect(effect.label) &&
        effect.getFlag(Constants.MODULE_ID, Constants.FLAGS.IS_VIEWABLE)
    );
  }

  _fetchUnfavoritedClassFeatures() {
    const effects = game.dfreds.effects;
    return effects.classFeatures.filter(
      (effect) =>
        !this._settings.isFavoritedEffect(effect.label) &&
        effect.getFlag(Constants.MODULE_ID, Constants.FLAGS.IS_VIEWABLE)
    );
  }

  _fetchUnfavoritedEquipment() {
    const effects = game.dfreds.effects;
    return effects.equipment.filter(
      (effect) =>
        !this._settings.isFavoritedEffect(effect.label) &&
        effect.getFlag(Constants.MODULE_ID, Constants.FLAGS.IS_VIEWABLE)
    );
  }

  _fetchUnfavoritedOther() {
    const effects = game.dfreds.effects;
    return effects.other.filter(
      (effect) =>
        !this._settings.isFavoritedEffect(effect.label) &&
        effect.getFlag(Constants.MODULE_ID, Constants.FLAGS.IS_VIEWABLE)
    );
  }

  /**
   * Remove the collapsed class from all saved, expanded folders
   */
  expandSavedFolders() {
    this._settings.expandedFolders.forEach((folderId) => {
      this._viewMvc.expandFolder(folderId);
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
    const customEffect = this._customEffectsHandler
      .getCustomEffects()
      .find((effect) => effect.label == effectName);

    await this._customEffectsHandler.editCustomEffect(customEffect);
  }

  /**
   * Handle deleting the custom effect
   *
   * @param {jQuery} effectItem - jQuery element representing the effect list item
   */
  async onDeleteEffectClick(effectItem) {
    const effectName = effectItem.data().effectName;
    const customEffect = this._customEffectsHandler
      .getCustomEffects()
      .find((effect) => effect.label == effectName);

    await this._customEffectsHandler.deleteCustomEffect(customEffect);
    this._viewMvc.render();
  }

  /**
   * Checks if the provided effect is custom
   *
   * @param {jQuery} effectItem - jQuery element representing the effect list item
   * @returns true if the effect is custom
   */
  isCustomEffect(effectItem) {
    const effectName = effectItem.data().effectName;
    return this._customEffectsHandler.isCustomEffect(effectName);
  }

  /**
   * Checks if the player is allowed to change custom effects
   *
   * @returns true if the player is allowed to change custom effects
   */
  get isPlayerAllowedCustomEffects() {
    return this._settings.allowPlayerCustomEffects;
  }

  /**
   * Handles clicks on the reset status effects button
   *
   * @param {MouseEvent} event
   */
  async onResetStatusEffectsClick(event) {
    return Dialog.confirm({
      title: game.i18n.localize(
        'ConvenientEffectsControllerResetStatusEffects'
      ),
      content: game.i18n.localize(
        'ConvenientEffectsControllerResetStatusEffectsDialog'
      ),
      yes: async () => {
        await this._settings.resetStatusEffects();
        window.location.reload();
      },
    });
  }

  /**
   * Handles clicks on the collapse all button
   *
   * @param {MouseEvent} event - event that corresponds to clicking the collapse all
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
    let folderId = event.currentTarget.parentElement.dataset.folderId;

    if (this._viewMvc.isFolderCollapsed(folderId)) {
      this._viewMvc.expandFolder(folderId);
    } else {
      this._viewMvc.collapseFolder(folderId);
    }

    if (this._settings.isFolderExpanded(folderId)) {
      await this._settings.removeExpandedFolder(folderId);
    } else {
      await this._settings.addExpandedFolder(folderId);
    }
  }

  /**
   * Handles clicks on effect items by toggling them on or off on selected tokens
   *
   * @param {MouseEvent} event - event that corresponds to clicking an effect item
   */
  async onEffectClick(event) {
    const effectName = this._findNearestEffectName(event);
    await game.dfreds.effectInterface.toggleEffect(effectName);
  }

  _findNearestEffectName(event) {
    return $(event.target)
      .closest('[data-effect-name], .convenient-effect')
      .data()?.effectName;
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
   * Checks if the provided effect is favorited
   *
   * @param {jQuery} effectItem - jQuery element representing the effect list item
   * @returns true if the effect is favorited
   */
  isFavoritedEffect(effectItem) {
    const effectName = effectItem.data().effectName;
    return this._settings.isFavoritedEffect(effectName);
  }

  /**
   * Handle toggling effects as overlays
   *
   * @param {jQuery} effectItem - jQuery element representing the effect list item
   */
  async onToggleOverlay(effectItem) {
    const effectName = effectItem.data().effectName;
    await game.dfreds.effectInterface.toggleEffect(effectName, {
      overlay: true,
    });
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
   * Handle duplicating an effect and adding as a custom effect
   *
   * @param {jQuery} effectItem - jQuery element representing the effect list item
   */
  async onDuplicateAsCustom(effectItem) {
    const effectName = effectItem.data().effectName;

    const effect = game.dfreds.effects.all.find(
      (effect) => effect.label === effectName
    );

    await this._customEffectsHandler.duplicateExistingEffect(effect);

    this._viewMvc.render();
  }

  /**
   * Handle clicks on the export custom effects button
   *
   * @param {MouseEvent} event - event that corresponds to clicking the export
   */
  async onExportCustomEffectsClick(event) {
    event.stopPropagation();
    await this._customEffectsHandler.exportCustomEffectsToJson();
  }

  /**
   * Handle clicks on the import custom effects button
   *
   * @param {MouseEvent} event - event that corresponds to clicking the export
   */
  async onImportCustomEffectsClick(event) {
    event.stopPropagation();
    await this._customEffectsHandler.importCustomEffectsFromJson();
  }

  /**
   * Handles starting the drag for effect items
   * For non-nested effects, populates the dataTransfer with Foundry's expected
   * ActiveEffect type and data to make non-nested effects behave as core does
   *
   * @param {DragEvent} event - event that corresponds to the drag start
   */
  onEffectDragStart(event) {
    const effectName = event.target.dataset.effectName;

    const effect = game.dfreds.effectInterface.findEffectByName(effectName);

    // special handling for nested effects
    if (game.dfreds.effectInterface.hasNestedEffects(effect)) {
      event.dataTransfer.setData(
        'text/plain',
        JSON.stringify({
          effectName,
        })
      );
      return;
    }

    event.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        effectName,
        type: 'ActiveEffect',
        data: effect,
      })
    );
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
          isSearch && matchingItems.folderIds.has(el.dataset.folderId);
        el.style.display = !isSearch || match ? 'flex' : 'none';

        // Expand folders with matches
        if (match) el.classList.remove('collapsed');
        else
          el.classList.toggle(
            'collapsed',
            !this._settings.isFolderExpanded(el.dataset.folderId)
          );
      }
    }
  }

  _getMatchingItems(regex) {
    let effectNames = new Set();
    let folderIds = new Set();

    for (let folder of this.data.folders) {
      for (let effect of folder.effects) {
        if (regex.test(SearchFilter.cleanQuery(effect.label))) {
          effectNames.add(effect.label);
          folderIds.add(folder.id);
        }
      }
    }

    return {
      effectNames,
      folderIds,
    };
  }

  // Fixes bug when dragging over any item onto the convenient effects
  _isValidEffect(event) {
    try {
      const data = JSON.parse(event.dataTransfer.getData('text/plain'));
      return game.dfreds.effects.all.some(
        (effect) => effect.label === data.effectName
      );
    } catch (err) {
      return false;
    }
  }

  // TODO delete
  _isEventTargetFavorites(event) {
    return event.currentTarget.dataset.folderId === 'favorites';
  }
}
