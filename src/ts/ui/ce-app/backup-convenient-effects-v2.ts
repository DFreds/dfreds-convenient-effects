import {
    ApplicationConfiguration,
    ApplicationRenderOptions,
} from "types/foundry/client-esm/applications/_types.js";
import {
    findAllEffects,
    findAllNestedEffectIds,
    findEffectByCeId,
    findEffectsByFolder,
    findFolder,
    findFolders,
} from "../../utils/finds.ts";
import { getApi } from "../../utils/gets.ts";
import { MODULE_ID } from "src/ts/constants.ts";
import { HandlebarsRenderOptions } from "types/foundry/client-esm/applications/api/handlebars-application.ts";
import { Flags } from "src/ts/utils/flags.ts";
import { Settings } from "src/ts/settings.ts";

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } =
    foundry.applications.api;

interface ConvenientEffectsOptions extends ApplicationConfiguration {
    convenientEffects: {
        backup: boolean;
    };
}

interface FolderData {
    /**
     * The item that contain the effects
     */
    folder: Item<null>;

    /**
     * The effects for the item
     */
    effects: ActiveEffect<Item<null>>[];
}

class BackupConvenientEffectsV2 extends HandlebarsApplicationMixin(
    ApplicationV2<ConvenientEffectsOptions>,
) {
    #settings: Settings;

    constructor() {
        super();
        this.#settings = new Settings();
    }

    static override DEFAULT_OPTIONS: DeepPartial<ConvenientEffectsOptions> = {
        id: "backup-convenient-effects-v2",
        tag: "section",
        classes: [
            "tab",
            "sidebar-tab",
            "directory",
            "flexcol",
            "sidebar-popout",
        ],
        window: {
            title: "ConvenientEffects.BackupAppName",
            icon: "fa-solid fa-hand-sparkles",
            resizable: true,
            minimizable: true,
        },
        position: {
            width: 300,
            height: 600,
            top: 75,
            left: 125 + 300 + 18,
        },
        actions: {
            collapseFolders: BackupConvenientEffectsV2.#onCollapseFolders,
            toggleFolder: BackupConvenientEffectsV2.#onToggleFolder,
            resetSystemEffects: BackupConvenientEffectsV2.#onResetSystemEffects,
        },
        convenientEffects: {
            backup: true,
        },
    };

    static _entryPartial = `modules/${MODULE_ID}/templates/ce-app/partials/document-partial.hbs`;

    static _folderPartial = `modules/${MODULE_ID}/templates/ce-app/partials/folder-partial.hbs`;

    static override PARTS = {
        header: {
            template: `modules/${MODULE_ID}/templates/ce-app/header.hbs`,
        },
        directory: {
            template: `modules/${MODULE_ID}/templates/ce-app/directory.hbs`,
            templates: [
                BackupConvenientEffectsV2._entryPartial,
                BackupConvenientEffectsV2._folderPartial,
            ],
            scrollable: [""],
        },
    };

    _createContextMenus(): void {
        this._createContextMenu(
            this._getFolderContextOptions,
            ".folder .folder-header",
            {
                fixed: true,
            },
        );
        this._createContextMenu(
            this._getEntryContextOptions,
            ".directory-item[data-entry-id]",
            {
                fixed: true,
            },
        );
    }

    _canCreateFolder(): boolean {
        return false;
    }

    _getEntryContextOptions(): ContextMenuEntry[] {
        return [];
    }

    _getFolderContextOptions(): ContextMenuEntry[] {
        return [
            {
                name: "SIDEBAR.Export",
                icon: '<i class="fa-solid fa-file-export"></i>',
                condition: (_header) => {
                    return game.user.isGM;
                },
                callback: (header) => {
                    const folderHtml = header.closest(
                        ".directory-item.folder",
                    ) as HTMLElement;
                    const folder = findFolder(
                        folderHtml.dataset.folderId ?? "",
                        {
                            backup: this.options.convenientEffects.backup,
                        },
                    );

                    folder?.exportToJSON();
                },
            },
        ];
    }

    protected override async _onFirstRender(
        context: object,
        options: ApplicationRenderOptions,
    ): Promise<void> {
        await super._onFirstRender(context, options);
        this._createContextMenus();
    }

    protected override _onRender(
        context: object,
        options: ApplicationRenderOptions,
    ): void {
        super._onRender(context, options);
        if (options.parts?.includes("header")) {
            // @ts-expect-error not typed
            new foundry.applications.ux.SearchFilter({
                inputSelector: "search input",
                contentSelector: ".directory-list",
                callback: this._onSearchFilter.bind(this),
                initial:
                    (
                        this.element.querySelector(
                            "search input",
                        ) as HTMLInputElement
                    )?.value ?? "",
            }).bind(this.element);
        }

        if (options.parts?.includes("directory")) {
            // @ts-expect-error not typed
            new foundry.applications.ux.DragDrop.implementation({
                dragSelector: ".directory-item.entry",
                dropSelector: ".directory-list",
                permissions: {
                    dragstart: this._canDragStart.bind(this),
                    drop: this._canDragDrop.bind(this),
                },
                callbacks: {
                    dragover: this._onDragOver.bind(this),
                    dragstart: this._onDragStart.bind(this),
                    drop: this._onDrop.bind(this),
                },
            }).bind(this.element);
        }
    }

    protected override async _prepareContext(
        options: ApplicationRenderOptions,
    ): Promise<object> {
        const context = await super._prepareContext(options);
        Object.assign(context, {
            folderIcon: CONFIG.Folder.sidebarIcon,
            label: game.i18n.localize("DOCUMENT.ActiveEffect"),
            labelPlural: game.i18n.localize("DOCUMENT.ActiveEffects"),
            sidebarIcon: "fa-solid fa-hand-sparkles",
        });

        return context;
    }

    protected override async _preparePartContext(
        partId: string,
        context: object,
        options: HandlebarsRenderOptions,
    ): Promise<object> {
        await super._preparePartContext(partId, context, options);

        switch (partId) {
            case "directory":
                await this._prepareDirectoryContext(context, options);
                break;
            case "header":
                await this._prepareHeaderContext(context, options);
                break;
        }

        return context;
    }

    async _prepareDirectoryContext(
        context: object,
        _options: HandlebarsRenderOptions,
    ): Promise<void> {
        const folders = findFolders({
            backup: this.options.convenientEffects.backup,
        });
        const nestedEffectIds = findAllNestedEffectIds({
            backup: this.options.convenientEffects.backup,
        });

        const folderData: FolderData[] = folders
            .filter((folder) => {
                const isViewable = Flags.isViewable(folder) ?? true;
                const showHiddenEffects = this.#settings.showHiddenEffects;

                return showHiddenEffects || isViewable;
            })
            .map((folder) => {
                const viewableEffects = findEffectsByFolder(folder.id, {
                    backup: this.options.convenientEffects.backup,
                }).filter((effect) => {
                    if (this.options.convenientEffects.backup) {
                        return true;
                    }

                    // Filter only if not backup

                    /*
                    if show hidden and show nested
                        - isViewable can be true or false
                        - Can be included in nested or not
                        - Show all effects

                    if show hidden and not show nested
                        - isViewable can be true or false
                        - Cannot be included in nested
                        - Show all effects minus nested effects

                    if not show hidden and show nested
                        - isViewable must be true
                        - Can be included in nested or not
                        - Show all effects minus hidden effects

                    if not show hidden and not show nested
                        - isViewable must be true
                        - Cannot be included in nested
                        - Show all effects minus hidden and minus nested
                    */
                    const ceEffectId = Flags.getCeEffectId(effect);
                    if (!ceEffectId) return false;

                    const isViewable = Flags.isViewable(effect) ?? true;
                    const isNestedEffect = nestedEffectIds.includes(ceEffectId);
                    const showHiddenEffects = this.#settings.showHiddenEffects;
                    const showNestedEffects = this.#settings.showNestedEffects;

                    if (showHiddenEffects && showNestedEffects) {
                        return true; // all
                    } else if (showHiddenEffects && !showNestedEffects) {
                        return !isNestedEffect;
                    } else if (!showHiddenEffects && showNestedEffects) {
                        return isViewable;
                    } else if (!showHiddenEffects && !showNestedEffects) {
                        return isViewable && !isNestedEffect;
                    }

                    return false;
                });

                return {
                    folder,
                    effects: viewableEffects,
                };
            });

        Object.assign(context, {
            folderData,
            isBackup: this.options.convenientEffects.backup,
            entryPartial: BackupConvenientEffectsV2._entryPartial,
            folderPartial: BackupConvenientEffectsV2._folderPartial,
        });
    }

    async _prepareHeaderContext(
        context: object,
        _options: HandlebarsRenderOptions,
    ): Promise<void> {
        Object.assign(context, {
            canViewBackups:
                game.user.isGM && !this.options.convenientEffects.backup,
            canCreateFolder: this._canCreateFolder(),
            isBackup: this.options.convenientEffects.backup,
            // searchMode:
            //     this.collection.searchMode === CONST.DIRECTORY_SEARCH_MODES.NAME
            //         ? {
            //               icon: "fa-solid fa-magnifying-glass",
            //               label: "SIDEBAR.SearchModeName",
            //           }
            //         : {
            //               icon: "fa-solid fa-file-magnifying-glass",
            //               label: "SIDEBAR.SearchModeFull",
            //           },
            // sortMode:
            //     this.collection.sortingMode === "a"
            //         ? {
            //               icon: "fa-solid fa-arrow-down-a-z",
            //               label: "SIDEBAR.SortModeAlpha",
            //           }
            //         : {
            //               icon: "fa-solid fa-arrow-down-short-wide",
            //               label: "SIDEBAR.SortModeManual",
            //           },
        });
        // context.searchMode.placeholder = game.i18n.format("SIDEBAR.Search", { types: context.labelPlural });
    }

    protected override _preSyncPartState(
        partId: string,
        newElement: HTMLElement,
        priorElement: HTMLElement,
        state: object,
    ): void {
        super._preSyncPartState(partId, newElement, priorElement, state);

        const stateTyped = state as { query?: string };

        if (partId === "header") {
            const searchInput = priorElement.querySelector(
                "search input",
            ) as HTMLInputElement;

            if (searchInput) {
                stateTyped.query = searchInput.value;
            }
        }
    }

    /* -------------------------------------------- */

    protected override _syncPartState(
        partId: string,
        newElement: HTMLElement,
        priorElement: HTMLElement,
        state: object,
    ): void {
        super._syncPartState(partId, newElement, priorElement, state);
        const stateTyped = state as { query?: string };

        if (partId === "header" && stateTyped.query) {
            const searchInput = newElement.querySelector(
                "search input",
            ) as HTMLInputElement;

            if (searchInput) {
                searchInput.value = stateTyped.query;
            }
        }
    }

    async collapseAll(): Promise<void> {
        for (const el of this.element.querySelectorAll(
            ".directory-item.folder",
        )) {
            el.classList.remove("expanded");
        }

        if (!this.options.convenientEffects.backup) {
            await this.#settings.clearExpandedFolders();
        }
    }

    static async #onCollapseFolders(): Promise<void> {
        const thisClass = this as unknown as BackupConvenientEffectsV2;
        return thisClass.collapseAll();
    }

    static async #onToggleFolder(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as BackupConvenientEffectsV2;
        return thisClass._onToggleFolder(event, target);
    }

    async _onToggleFolder(
        _event: PointerEvent,
        target: HTMLElement,
    ): Promise<void> {
        const folderHtml = target.closest(
            ".directory-item.folder",
        ) as HTMLElement;
        folderHtml.classList.toggle("expanded");

        // const expanded = folder.classList.contains("expanded");
        // const { uuid } = folder.dataset;

        // if ( expanded ) game.folders._expanded[uuid] = true;
        // else delete game.folders._expanded[uuid];

        // if ( !expanded ) {
        //   for ( const subfolder of folder.querySelectorAll(".directory-item.folder") ) {
        //     subfolder.classList.remove("expanded");
        //     delete game.folders._expanded[subfolder.dataset.uuid];
        //   }
        // }

        const folderId = folderHtml.dataset.folderId;
        if (!folderId) return;

        if (!this.options.convenientEffects.backup) {
            if (this.#settings.isFolderExpanded(folderId)) {
                await this.#settings.removeExpandedFolder(folderId);
            } else {
                await this.#settings.addExpandedFolder(folderId);
            }
        }
    }

    // static #onToggleSearch() {
    //     this.collection.toggleSearchMode();
    //     this.render({ parts: ["header"] });
    // }

    // static #onToggleSort() {
    //     this.collection.toggleSortingMode();
    //     this.render();
    // }

    _onMatchSearchEntry(
        query: string,
        entryIds: Set<string>,
        element: HTMLElement,
        _options: object,
    ): void {
        const entryId = element.dataset.entryId;
        if (!entryId) return;

        element.style.display =
            !query || entryIds.has(entryId) ? "flex" : "none";
    }

    _onSearchFilter(
        _event: KeyboardEvent,
        query: string,
        rgx: RegExp,
        html: HTMLElement,
    ): void {
        const entryIds = new Set<string>();
        const folderIds = new Set<string>();
        const autoExpandIds = new Set<string>();
        const options = {};

        // Match entries and folders.
        if (query) {
            // First match folders.
            this._matchSearchFolders(rgx, folderIds, autoExpandIds, options);

            // Next match entries.
            this._matchSearchEntries(
                rgx,
                entryIds,
                folderIds,
                autoExpandIds,
                options,
            );
        }

        // Toggle each directory entry.
        for (const el of html.querySelectorAll(".directory-item")) {
            const elHtml = el as HTMLElement;
            if (elHtml.hidden) continue;
            if (elHtml.classList.contains("folder")) {
                const { folderId } = elHtml.dataset;

                if (!folderId) continue;
                const match = folderIds.has(folderId);

                elHtml.style.display = !query || match ? "flex" : "none";
                if (autoExpandIds.has(folderId ?? "")) {
                    if (query && match) elHtml.classList.add("expanded");
                } else {
                    elHtml.classList.toggle(
                        "expanded",
                        this.#settings.isFolderExpanded(folderId),
                    );
                }
            } else {
                this._onMatchSearchEntry(query, entryIds, elHtml, options);
            }
        }
    }

    #onMatchFolder(
        folder: Item<null> | string,
        folderIds: Set<string>,
        autoExpandIds: Set<string>,
        {
            autoExpand = true,
        }: {
            autoExpand?: boolean;
        } = {},
    ): void {
        let folderItem: Item<null> | undefined;

        if (typeof folder === "string") {
            folderItem = findFolder(folder, {
                backup: this.options.convenientEffects.backup,
            });
        } else {
            folderItem = folder;
        }

        if (!folderItem) return;

        const folderId = folderItem._id;
        if (!folderId) return;

        folderIds.add(folderId);

        if (autoExpand) {
            autoExpandIds.add(folderId);
        }
    }

    _matchSearchEntries(
        query: RegExp,
        entryIds: Set<string>,
        folderIds: Set<string>,
        autoExpandIds: Set<string>,
        _options: object = {},
    ): void {
        // Note: This is from FoundryVTT: we could do a different search
        const nameOnlySearch = true;
        const entries = findAllEffects({
            backup: this.options.convenientEffects.backup,
        });

        const matchedFolderIds = new Set(folderIds);

        for (const entry of entries) {
            const entryId = entry._id;

            if (!entryId || !entry.parent._id) continue;

            // If we matched a folder, add its child entries
            if (matchedFolderIds.has(entry.parent._id)) {
                entryIds.add(entryId);
            }
            // Otherwise, if we are searching by name, match the entry name
            else if (
                nameOnlySearch &&
                query.test(
                    // @ts-expect-error no types for this yet
                    foundry.applications.ux.SearchFilter.cleanQuery(entry.name),
                )
            ) {
                entryIds.add(entryId);
                this.#onMatchFolder(entry.parent, folderIds, autoExpandIds);
            }
        }

        if (nameOnlySearch) return;

        // Full text search.
        // const matches = this.collection.search({
        //     query: query.source,
        //     exclude: Array.from(entryIds),
        // });
        // for (const match of matches) {
        //     if (entryIds.has(match._id)) continue;
        //     entryIds.add(match._id);
        //     this.#onMatchFolder(match.folder, folderIds, autoExpandIds);
        // }
    }

    _matchSearchFolders(
        query: RegExp,
        folderIds: Set<string>,
        autoExpandIds: Set<string>,
        _options: object = {},
    ): void {
        const folders = findFolders({
            backup: this.options.convenientEffects.backup,
        });

        for (const folder of folders) {
            if (
                query.test(
                    // @ts-expect-error no types for this yet
                    foundry.applications.ux.SearchFilter.cleanQuery(
                        folder.name,
                    ),
                )
            ) {
                this.#onMatchFolder(folder, folderIds, autoExpandIds, {
                    autoExpand: false,
                });
            }
        }
    }

    _canDragDrop(_selector: string): boolean {
        return game.user.isGM;
    }

    _canDragStart(_selector: string): boolean {
        return game.user.isGM;
    }

    _getEntryDragData(entryId: string): object {
        const effect = findEffectByCeId(entryId, {
            backup: this.options.convenientEffects.backup,
        });

        if (!effect) return {};

        return effect.toDragData();
    }

    _onDragOver(_event: DragEvent): void {
        return;
    }

    _onDragStart(event: DragEvent): void {
        if (!event.currentTarget) return;

        const entryHtml = (event.currentTarget as HTMLElement).closest(
            ".directory-item.entry",
        ) as HTMLElement;
        const effectId = entryHtml.dataset.ceEffectId;

        if (!effectId) return;

        const dragData = this._getEntryDragData(effectId);
        event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));
    }

    _onDrop(_event: DragEvent): void {
        return;
    }

    static async #onResetSystemEffects(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as BackupConvenientEffectsV2;
        return thisClass._onResetSystemEffects(event, target);
    }

    async _onResetSystemEffects(
        _event: PointerEvent,
        _target: HTMLElement,
    ): Promise<void> {
        const proceed = await DialogV2.confirm({
            window: {
                title: game.i18n.localize(
                    "ConvenientEffects.ResetSystemEffects",
                ),
            },
            content: `<strong>${game.i18n.localize("AreYouSure")}</strong><p>${game.i18n.localize("ConvenientEffects.ResetSystemEffectsWarning")}</p>`,
        });

        if (!proceed) return;

        await getApi().resetSystemInitialization();
    }
}

export { BackupConvenientEffectsV2 };
