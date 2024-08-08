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
                    dropSelector: ".convenient-folder",
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

    override getData(_options?: Partial<ApplicationOptions>): object {
        return this.#controller.getData();
    }

    override activateListeners(html: JQuery): void {
        this.#rootView = html;

        this.#initClickListeners();
        this.#initContextMenus();

        const dh = this.#onDragHighlight.bind(this);

        // @ts-expect-error Not recognizing handler for some reason
        html.find(".folder").on("dragenter", dh).on("dragleave", dh);

        this.#controller.expandSavedFolders();
        this.#controller.setPrioritizeTargetsState();
    }

    // NOTE: taken from foundry.js DirectoryApplicationMixin
    #onDragHighlight(event: DragEvent) {
        const li = event.currentTarget as any;
        if (!li.classList.contains("folder")) return;
        event.stopPropagation(); // Don't bubble to parent folders

        // Remove existing drop targets
        if (event.type === "dragenter") {
            for (const t of li
                .closest(".directory-list")
                .querySelectorAll(".droptarget")) {
                t.classList.remove("droptarget");
            }
        }

        // Remove current drop target
        if (event.type === "dragleave") {
            const el = document.elementFromPoint(
                event.clientX,
                event.clientY,
            ) as any;
            const parent = el.closest(".folder");
            if (parent === li) return;
        }

        // Add new drop target
        li.classList.toggle("droptarget", event.type === "dragenter");
    }

    protected override async _onSearchFilter(
        event: KeyboardEvent,
        query: string,
        rgx: RegExp,
        html: HTMLElement | null,
    ): Promise<void> {
        return this.#controller.onSearchTextChange(event, query, rgx, html);
    }

    protected override _onDragStart(event: DragEvent): void {
        this.#controller.onEffectDragStart(event);
    }

    protected override async _onDrop(event: DragEvent): Promise<void> {
        await this.#controller.onEffectDrop(event);
    }

    protected override _canDragStart(_selector: string): boolean {
        return this.#controller.canDrag();
    }

    protected override _canDragDrop(_selector: string): boolean {
        return this.#controller.canDrag();
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

    isPrioritizeTargetsActive(): boolean {
        return this.#prioritizeTargetsButton.hasClass("active");
    }

    removeActivePrioritizeTargets(): void {
        this.#prioritizeTargetsButton.removeClass("active");
    }

    addActivePrioritizeTargets(): void {
        this.#prioritizeTargetsButton.addClass("active");
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
        this.#folderHeaders.on(
            "click",
            this.#controller.onToggleFolder.bind(this.#controller),
        );
        this.#prioritizeTargetsButton.on(
            "click",
            this.#controller.onPrioritizeTargets.bind(this.#controller),
        );
    }

    #initContextMenus(): void {
        ContextMenu.create(
            this,
            this.#rootView,
            ".convenient-folder .folder-header",
            [
                {
                    name: "FOLDER.Edit",
                    icon: '<i class="fas fa-edit fa-fw"></i>',
                    condition: this.#controller.isUserFolderOwner.bind(
                        this.#controller,
                    ),
                    callback: this.#controller.onEditFolder.bind(
                        this.#controller,
                    ),
                },
                {
                    name: "FOLDER.Delete",
                    icon: '<i class="fas fa-dumpster fa-fw"></i>',
                    condition: this.#controller.isUserFolderOwner.bind(
                        this.#controller,
                    ),
                    callback: this.#controller.onDeleteAllFolder.bind(
                        this.#controller,
                    ),
                },
                {
                    name: "OWNERSHIP.Configure",
                    icon: '<i class="fas fa-lock"></i>',
                    condition: () => game.user.isGM,
                    callback: this.#controller.onConfigureFolderOwnership.bind(
                        this.#controller,
                    ),
                },
                {
                    name: "SIDEBAR.Export",
                    icon: '<i class="fas fa-file-export fa-fw"></i>',
                    condition: this.#controller.isUserFolderOwner.bind(
                        this.#controller,
                    ),
                    callback: this.#controller.onExportFolder.bind(
                        this.#controller,
                    ),
                },
                {
                    name: "SIDEBAR.Import",
                    icon: '<i class="fas fa-file-import fa-fw"></i>',
                    condition: this.#controller.isUserFolderOwner.bind(
                        this.#controller,
                    ),
                    callback: this.#controller.onImportFolder.bind(
                        this.#controller,
                    ),
                },
            ],
        );

        ContextMenu.create(this, this.#rootView, ".convenient-effect", [
            {
                name: "ConvenientEffects.EditEffect",
                icon: '<i class="fas fa-edit fa-fw"></i>',
                condition: this.#controller.isUserFolderOwner.bind(
                    this.#controller,
                ),
                callback: (target) => {
                    this.#controller.onEditEffect(target);
                },
            },
            {
                name: "ConvenientEffects.DeleteEffect",
                icon: '<i class="fas fa-trash fa-fw"></i>',
                condition: this.#controller.isUserFolderOwner.bind(
                    this.#controller,
                ),
                callback: this.#controller.onDeleteEffect.bind(
                    this.#controller,
                ),
            },
            {
                name: "ConvenientEffects.ToggleAsOverlay",
                icon: '<i class="far fa-dot-circle fa-fw"></i>',
                callback: this.#controller.onToggleOverlay.bind(
                    this.#controller,
                ),
            },
            {
                name: "SIDEBAR.Duplicate",
                icon: '<i class="far fa-copy fa-fw"></i>',
                condition: this.#controller.isUserFolderOwner.bind(
                    this.#controller,
                ),
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

    get #folderHeaders() {
        return this.#rootView.find(".directory-list .folder-header");
    }

    get #prioritizeTargetsButton(): JQuery<HTMLElement> {
        return this.#rootView.find(".prioritize-targets");
    }
}

export { ConvenientEffectsApp };
