import ConvenientEffectsController from './convenient-effects-controller.js';

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
      top: 75,
      left: 125,
      template:
        'modules/dfreds-convenient-effects/templates/convenient-effects-app.html',
    });
  }

  constructor() {
    super();
    this._controller = new ConvenientEffectsController();
    this._controller.viewMvc = this;
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
    this._initFolders();
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

  addEffectToFavoritesDirectory(effectName) {
    const draggable = this._rootView.find(`.entity[data-effect-name="${effectName}"]`)[0].cloneNode(true);
    this._favoritesSubdirectory.append(draggable);
  }

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
    const contextMenu = new ContextMenu(this._rootView, '.entity', [
      {
        name: 'Something',
        icon: '<i class="far fa-star fa-fw"></i>',
        condition: (li) => {
          return game.user.isGM;
        },
        callback: (li) => {
          console.log('test');
          return 'test';
        },
      },
    ]);

    contextMenu.bind();
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

  _initFolders() {
    // const folders = this._rootView.find('.folder').toArray();
    // folders.forEach((folder) => {
    //   const jQueryFolder = $(folder);
    // })
  }

  get _favoritesDirectory() {
    return this._rootView.find(
      '.folder[data-folder-label="Favorites"]'
    );
  }

  get _favoritesSubdirectory() {
    return this._favoritesDirectory.find('.subdirectory');
  }

  get _folderHeaders() {
    return this._rootView.find('.directory-list .folder-header');
  }

  get _effectListItems() {
    return this._rootView.find('.entity');
  }
}
