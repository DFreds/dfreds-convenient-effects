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
      height: "auto",
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
    return this._controller.dataForView;
  }

  /** @override */
  activateListeners(html) {
    this._rootView = html;

    this._initClickListeners();
    this._initContextMenu();
    this._initDragDrop();

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
   * Adds a given effect to the favorites folder UI
   *
   * @param {string} effectName - name of effect to add to the directory
   */
  addEffectToFavoritesDirectory(effectName) {
    const draggable = this._rootView
      .find(`.entity[data-effect-name="${effectName}"]`)
      .clone(true);
    this._favoritesSubdirectory.append(draggable);
  }

  /**
   * Removes a given effect from the favorites folder UI
   *
   * @param {string} effectName - name of effect to remove from the directory
   */
  removeEffectFromFavoritesDirectory(effectName) {
    const item = this._rootView.find(
      `.entity[data-effect-name="${effectName}"]`
    );
    this._favoritesSubdirectory.find(item).remove();
  }

  /**
   * Sort the favorites directory by the effect name of the data
   */
  sortFavoritesDirectory() {
    let newHtml = this._favoritesItems.sort((a, b) => {
      const effectA = $(a).data().effectName.toLowerCase();
      const effectB = $(b).data().effectName.toLowerCase();

      if (effectA < effectB) return -1;
      if (effectA > effectB) return 1;
      return 0;
    });

    newHtml.appendTo(this._favoritesSubdirectory);
  }

  /**
   * Either adds or removes the class 'collapsed' to the folder
   *
   * @param {string} folderName - the name of the folder to add or remove the collapsed class to or from
   */
  toggleCollapsedClassOnFolder(folderName) {
    const folder = this._rootView.find(
      `.folder[data-folder-label="${folderName}"]`
    );

    if (folder.hasClass('collapsed')) {
      folder.removeClass('collapsed');
    } else {
      folder.addClass('collapsed');
    }
  }

  /**
   * Notify the user that they do not have any tokens selected
   */
  notifyNoTokensSelected() {
    ui.notifications.error('Please select a token');
  }

  _initClickListeners() {
    this._folderHeaders.on(
      'click',
      this._controller.onFolderClick.bind(this._controller)
    );
    this._effectListItems.on(
      'click',
      this._controller.onEffectClick.bind(this._controller)
    );
  }

  _initContextMenu() {
    new ContextMenu(this._favoritesDirectory, '.entity', [
      {
        name: 'Remove Favorite',
        icon: '<i class="far fa-star fa-fw"></i>',
        callback: this._controller.onRemoveFavorite.bind(this._controller),
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

  get _favoritesDirectory() {
    return this._rootView.find('.folder[data-folder-label="Favorites"]');
  }

  get _favoritesSubdirectory() {
    return this._favoritesDirectory.find('.subdirectory');
  }

  get _favoritesItems() {
    return this._favoritesDirectory.find('.entity');
  }

  get _folderHeaders() {
    return this._rootView.find('.directory-list .folder-header');
  }

  get _effectListItems() {
    return this._rootView.find('.entity');
  }
}
