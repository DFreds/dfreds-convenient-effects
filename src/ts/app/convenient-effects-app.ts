import { ConvenientEffectsController } from "./convenient-effects-controller.ts";

class ConvenientEffectsApp extends Application {
    #controller: ConvenientEffectsController;
    #rootView: JQuery<HTMLElement>;

    constructor() {
        super();
        this.#controller = new ConvenientEffectsController(this);
        this.#rootView = $("<div>"); // Init it to something for now
    }

    static override get defaultOptions(): ApplicationOptions {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 300,
            height: 600,
            top: 75,
            left: 125,
            popOut: true,
            minimizable: true,
            resizable: true,
            id: "convenient-effects",
            classes: ["sidebar-popout"],
            scrollY: ["ol.directory-list"],
            dragDrop: [
                {
                    dragSelector: ".convenient-effect",
                },
            ],
            filters: [
                {
                    inputSelector: 'input[name="search"]',
                    contentSelector: ".directory-list",
                },
            ],
            title: "ConvenientEffects.AppName",
            template:
                "modules/dfreds-convenient-effects/templates/convenient-effects-app.hbs",
        });
    }

    override async getData(
        _options?: Partial<ApplicationOptions>,
    ): Promise<object> {
        return this.#controller.getData();
    }

    override activateListeners(html: JQuery): void {
        this.#rootView = html;

        this.#initClickListeners();
        this.#initContextMenus();

        this.#controller.expandSavedFolders();
    }

    protected override _onSearchFilter(
        event: KeyboardEvent,
        query: string,
        rgx: RegExp,
        html: HTMLElement | null,
    ): void {
        this.#controller.onSearchTextChange(event, query, rgx, html);
    }

    protected override _canDragStart(_selector: string): boolean {
        return this.#controller.canDragStart();
    }

    /**
     * Checks if the folder is collapse
     * @param folderId - the folder ID to check
     * @returns true if the folder is collapsed, false otherwise
     */
    isFolderCollapsed(folderId: string): boolean {
        return this.#findFolderById(folderId).hasClass("collapsed");
    }

    /**
     * Collapses a folder by adding the 'collapsed' CSS class to it
     *
     * @param folderId - the folder ID to collapse
     */
    collapseFolder(folderId: string): void {
        this.#findFolderById(folderId).addClass("collapsed");
    }

    /**
     * Expands a folder by removing the 'collapsed' CSS class from it
     *
     * @param folderId - the folder ID to expand
     */
    expandFolder(folderId: string): void {
        this.#findFolderById(folderId).removeClass("collapsed");
    }

    /**
     * Collapse all folders by adding the 'collapsed' CSS class to them
     */
    collapseAllFolders(): void {
        this.#allDirectories.addClass("collapsed");
    }

    #initClickListeners(): void {
        this.#collapseAllButton.on(
            "click",
            this.#controller.onCollapseAllClick.bind(this.#controller),
        );
        // this._createEffectButton.on(
        //     "click",
        //     this._controller.onCreateEffectClick.bind(this._controller),
        // );
        // this._effectListItems.on(
        //     "click",
        //     this._controller.onEffectClick.bind(this._controller),
        // );
        // this._exportCustomEffectsButton.on(
        //     "click",
        //     this._controller.onExportCustomEffectsClick.bind(this._controller),
        // );
        this.#folderHeaders.on(
            "click",
            this.#controller.onFolderClick.bind(this.#controller),
        );
        // this._importCustomEffectsButton.on(
        //     "click",
        //     this._controller.onImportCustomEffectsClick.bind(this._controller),
        // );
        // this._resetStatusEffectsButton.on(
        //     "click",
        //     this._controller.onResetStatusEffectsClick.bind(this._controller),
        // );
    }

    #initContextMenus(): void {
        // new ContextMenu(this.#rootView, ".convenient-effect", [
        //     {
        //         name: "Edit Effect",
        //         icon: '<i class="fas fa-edit fa-fw"></i>',
        //         condition: (effectItem) => {
        //             return (
        //                 this._controller.isCustomEffect(effectItem) &&
        //                 (game.user.isGM ||
        //                     this._controller.isPlayerAllowedCustomEffects)
        //             );
        //         },
        //         callback: this._controller.onEditEffectClick.bind(
        //             this._controller,
        //         ),
        //     },
        //     {
        //         name: "Delete Effect",
        //         icon: '<i class="fas fa-trash fa-fw"></i>',
        //         condition: (effectItem) => {
        //             return (
        //                 this._controller.isCustomEffect(effectItem) &&
        //                 (game.user.isGM ||
        //                     this._controller.isPlayerAllowedCustomEffects)
        //             );
        //         },
        //         callback: this._controller.onDeleteEffectClick.bind(
        //             this._controller,
        //         ),
        //     },
        //     {
        //         name: "Add Favorite",
        //         icon: '<i class="fas fa-star fa-fw"></i>',
        //         condition: (effectItem) => {
        //             return !this._controller.isFavoritedEffect(effectItem);
        //         },
        //         callback: this._controller.onAddFavorite.bind(this._controller),
        //     },
        //     {
        //         name: "Remove Favorite",
        //         icon: '<i class="far fa-star fa-fw"></i>',
        //         condition: (effectItem) => {
        //             return this._controller.isFavoritedEffect(effectItem);
        //         },
        //         callback: this._controller.onRemoveFavorite.bind(
        //             this._controller,
        //         ),
        //     },
        //     {
        //         name: "Toggle as Overlay",
        //         icon: '<i class="far fa-dot-circle fa-fw"></i>',
        //         callback: this._controller.onToggleOverlay.bind(
        //             this._controller,
        //         ),
        //     },
        //     {
        //         name: "Toggle Status Effect",
        //         icon: '<i class="fas fa-street-view fa-fw"></i>',
        //         condition: () => {
        //             return game.user.isGM;
        //         },
        //         callback: this._controller.onToggleStatusEffect.bind(
        //             this._controller,
        //         ),
        //     },
        //     {
        //         name: "Duplicate as Custom",
        //         icon: '<i class="far fa-copy fa-fw"></i>',
        //         condition: () => {
        //             return (
        //                 game.user.isGM ||
        //                 this._controller.isPlayerAllowedCustomEffects
        //             );
        //         },
        //         callback: this._controller.onDuplicateAsCustom.bind(
        //             this._controller,
        //         ),
        //     },
        // ]);
    }

    #findFolderById(folderId: string): JQuery<HTMLElement> {
        return this.#rootView.find(`.folder[data-folder-id="${folderId}"]`);
    }

    get #allDirectories(): JQuery<HTMLElement> {
        return this.#rootView.find(".folder");
    }

    get #collapseAllButton(): JQuery<HTMLElement> {
        return this.#rootView.find(".collapse-all");
    }

    // get _createEffectButton() {
    //     return this._rootView.find(".create-effect");
    // }

    // get _effectListItems() {
    //     return this._rootView.find(".convenient-effect");
    // }

    // get _exportCustomEffectsButton() {
    //     return this._rootView.find(".export-custom-effects");
    // }

    get #folderHeaders() {
        return this.#rootView.find(".directory-list .folder-header");
    }

    // get _importCustomEffectsButton() {
    //     return this._rootView.find(".import-custom-effects");
    // }

    // get _resetStatusEffectsButton() {
    //     return this._rootView.find(".reset-status-effects");
    // }
}

export { ConvenientEffectsApp };
