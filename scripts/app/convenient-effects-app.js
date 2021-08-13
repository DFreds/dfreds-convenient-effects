import ConvenientEffectsController from './convenient-effects-controller.js';

/**
 * Application class for handling the UI of the convenient effects
 */
export default class ConvenientEffectsApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'convenient-effects',
      classes: ['sidebar-popout'],
      title: 'Convenient Effects',
      popOut: true,
      width: 300,
      height: 600,
      minimizable: true,
      resizable: true,
      top: 75,
      left: 125,
      template:
        'modules/dfreds-convenient-effects/templates/convenient-effects-app.html',
      scrollY: ['ol.directory-list'],
    });
  }

  /**
   * Initializes the application and its dependencies
   */
  constructor() {
    super();
    this._controller = new ConvenientEffectsController(this);
  }

  /** @override */
  getData() {
    return this._controller.data;
  }

  /** @override */
  activateListeners(html) {
    this._rootView = html;

    this._initClickListeners();
    this._initContextMenus();
    this._initDragDrop();
    this._initSearchFilters();

    this._controller.expandSavedFolders();
  }

  /**
   * Adds the droptarget CSS class to the favorites directory
   */
  addDropTargetClassToFavorites() {
    if (this._favoritesDirectory.hasClass('droptarget')) return;
    this._favoritesDirectory.addClass('droptarget');
  }

  /**
   * Removes the droptarget CSS class from the favorites directory
   */
  removeDropTargetClassFromFavorites() {
    if (!this._favoritesDirectory.hasClass('droptarget')) return;
    this._favoritesDirectory.removeClass('droptarget');
  }

  /**
   * Checks if the folder is collapsed
   *
   * @param {string} folderName - the folder name to check
   * @returns {boolean} true if the folder is collapsed, false otherwise
   */
  isFolderCollapsed(folderName) {
    return this._getFolderByName(folderName).hasClass('collapsed');
  }

  /**
   * Collapses a folder by adding the 'collapsed' CSS class to it
   *
   * @param {string} folderName - the folder name to collapse
   */
  collapseFolder(folderName) {
    this._getFolderByName(folderName).addClass('collapsed');
  }

  /**
   * Expands a folder by removing the 'collapsed' CSS class from it
   *
   * @param {string} folderName - the folder name to expand
   */
  expandFolder(folderName) {
    this._getFolderByName(folderName).removeClass('collapsed');
  }

  /**
   * Collapse all folders by adding the 'collapsed' CSS class to them
   */
  collapseAllFolders() {
    this._allDirectories.addClass('collapsed');
  }

  /**
   * Indicate to the user that a reload is required to update status effects
   */
  showReloadRequired() {
    ui.notifications.warn(
      'Foundry must be reloaded to update token status effects.'
    );
  }

  _getFolderByName(folderName) {
    return this._rootView.find(`.folder[data-folder-label="${folderName}"]`);
  }

  _initClickListeners() {
    this._createEffectButton.on(
      'click',
      this._controller.onCreateEffectClick.bind(this._controller)
    );
    this._resetStatusEffectsButton.on(
      'click',
      this._controller.onResetStatusEffectsClick.bind(this._controller)
    );
    this._collapseAllButton.on(
      'click',
      this._controller.onCollapseAllClick.bind(this._controller)
    );
    this._folderHeaders.on(
      'click',
      this._controller.onFolderClick.bind(this._controller)
    );
    this._effectListItems.on(
      'click',
      this._controller.onEffectClick.bind(this._controller)
    );
  }

  _initContextMenus() {
    new ContextMenu(this._nonFavoritesDirectories, '.entity', [
      {
        name: 'Add Favorite',
        icon: '<i class="fas fa-star fa-fw"></i>',
        callback: this._controller.onAddFavorite.bind(this._controller),
      },
      {
        name: 'Toggle Status Effect',
        icon: '<i class="fas fa-street-view fa-fw"></i>',
        callback: this._controller.onToggleStatusEffect.bind(this._controller),
      },
    ]);

    new ContextMenu(this._favoritesDirectory, '.entity', [
      {
        name: 'Remove Favorite',
        icon: '<i class="far fa-star fa-fw"></i>',
        callback: this._controller.onRemoveFavorite.bind(this._controller),
      },
      {
        name: 'Toggle Status Effect',
        icon: '<i class="fas fa-street-view fa-fw"></i>',
        callback: this._controller.onToggleStatusEffect.bind(this._controller),
      },
    ]);
  }

  _initDragDrop() {
    const dragDrop = new DragDrop({
      dragSelector: '.entity',
      dropSelector: '.folder',
      callbacks: {
        dragstart: this._controller.onEffectDragStart.bind(this._controller),
        dragover: this._controller.onFolderDragOver.bind(this._controller),
        drop: this._controller.onDropOntoFolder.bind(this._controller),
      },
    });
    dragDrop.bind(this._rootView[0]);

    this._favoritesDirectory.on(
      'dragleave',
      this._controller.onFolderDragLeave.bind(this._controller)
    );
  }

  _initSearchFilters() {
    const searchFilter = new SearchFilter({
      inputSelector: 'input[name="search"]',
      contentSelector: '.directory-list',
      callback: this._controller.onSearchTextChange.bind(this._controller),
    });

    searchFilter.bind(this._rootView[0]);
  }

  get _allDirectories() {
    return this._rootView.find('.folder');
  }

  get _createEffectButton() {
    return this._rootView.find('.create-effect');
  }

  get _resetStatusEffectsButton() {
    return this._rootView.find('.reset-status-effects');
  }

  get _collapseAllButton() {
    return this._rootView.find('.collapse-all');
  }

  get _effectListItems() {
    return this._rootView.find('.entity');
  }

  get _favoritesDirectory() {
    return this._rootView.find('.folder[data-folder-label="Favorites"]');
  }

  get _favoritesItems() {
    return this._favoritesDirectory.find('.entity');
  }

  get _favoritesSubdirectory() {
    return this._favoritesDirectory.find('.subdirectory');
  }

  get _folderHeaders() {
    return this._rootView.find('.directory-list .folder-header');
  }

  get _nonFavoritesDirectories() {
    return this._rootView
      .find('.folder')
      .filter(':not([data-folder-label="Favorites"])');
  }
}
