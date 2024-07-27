import { ConvenientEffectsController } from "./convenient-effects-controller.ts";

class ConvenientEffectsApp extends Application {
    // TODO drag and drop between folders should transfer active effect from one item to another

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

    protected override async _onSearchFilter(
        event: KeyboardEvent,
        query: string,
        rgx: RegExp,
        html: HTMLElement | null,
    ): Promise<void> {
        return this.#controller.onSearchTextChange(event, query, rgx, html);
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
            this.#controller.onCollapseAll.bind(this.#controller),
        );
        this.#createFolderButton.on(
            "click",
            this.#controller.onCreateFolder.bind(this.#controller),
        );
        this.#createEffectButton.on(
            "click",
            this.#controller.onCreateEffect.bind(this.#controller),
        );
        this.#effectListItems.on(
            "click",
            this.#controller.onToggleEffect.bind(this.#controller),
        );
        // this._exportCustomEffectsButton.on(
        //     "click",
        //     this._controller.onExportCustomEffectsClick.bind(this._controller),
        // );
        this.#folderHeaders.on(
            "click",
            this.#controller.onToggleFolder.bind(this.#controller),
        );
        // this._importCustomEffectsButton.on(
        //     "click",
        //     this._controller.onImportCustomEffectsClick.bind(this._controller),
        // );
    }

    #initContextMenus(): void {
        ContextMenu.create(
            this,
            this.#rootView,
            ".convenient-folder .folder-header",
            [
                {
                    name: "Edit Folder",
                    icon: '<i class="fas fa-edit fa-fw"></i>',
                    condition: (_target) =>
                        game.user.isGM || this.#controller.canUserModifyEffects,
                    callback: this.#controller.onEditFolder.bind(
                        this.#controller,
                    ),
                },
                {
                    name: "Delete All",
                    icon: '<i class="fas fa-dumpster fa-fw"></i>',
                    condition: (_target) =>
                        game.user.isGM || this.#controller.canUserModifyEffects,
                    callback: this.#controller.onDeleteAllFolder.bind(
                        this.#controller,
                    ),
                },
            ],
        );

        ContextMenu.create(this, this.#rootView, ".convenient-effect", [
            {
                name: "Edit Effect", // TODO localize
                icon: '<i class="fas fa-edit fa-fw"></i>',
                condition: (_target) =>
                    game.user.isGM || this.#controller.canUserModifyEffects,
                callback: (target) => {
                    this.#controller.onEditEffect(target);
                },
            },
            {
                name: "Delete Effect",
                icon: '<i class="fas fa-trash fa-fw"></i>',
                condition: (_target) => {
                    return (
                        game.user.isGM || this.#controller.canUserModifyEffects
                    );
                },
                callback: this.#controller.onDeleteEffect.bind(
                    this.#controller,
                ),
            },
            // TODO a restore or undo button?
            {
                name: "Toggle as Overlay",
                icon: '<i class="far fa-dot-circle fa-fw"></i>',
                callback: this.#controller.onToggleOverlay.bind(
                    this.#controller,
                ),
            },
            {
                name: "Duplicate",
                icon: '<i class="far fa-copy fa-fw"></i>',
                condition: () => {
                    return (
                        game.user.isGM || this.#controller.canUserModifyEffects
                    );
                },
                callback: this.#controller.onDuplicateEffect.bind(
                    this.#controller,
                ),
            },
        ]);
    }

    #findFolderById(folderId: string): JQuery<HTMLElement> {
        return this.#rootView.find(
            `.convenient-folder[data-folder-id="${folderId}"]`,
        );
    }

    get #allDirectories(): JQuery<HTMLElement> {
        return this.#rootView.find(".convenient-folder");
    }

    get #collapseAllButton(): JQuery<HTMLElement> {
        return this.#rootView.find(".collapse-all");
    }

    get #createFolderButton() {
        return this.#rootView.find(".create-folder");
    }

    get #createEffectButton() {
        return this.#rootView.find(".create-button");
    }

    get #effectListItems(): JQuery<HTMLElement> {
        return this.#rootView.find(".convenient-effect");
    }

    // get _exportCustomEffectsButton() {
    //     return this._rootView.find(".export-custom-effects");
    // }

    get #folderHeaders() {
        return this.#rootView.find(".directory-list .folder-header");
    }

    // get _importCustomEffectsButton() {
    //     return this._rootView.find(".import-custom-effects");
    // }
}

export { ConvenientEffectsApp };
