import { ApplicationConfiguration } from "@client/applications/_types.mjs";
import { ApplicationV2, HandlebarsRenderOptions } from "@client/applications/api/_module.mjs";
import { ContextMenuEntry } from "@client/applications/ux/context-menu.mjs";
import {
    findAllEffects,
    findAllIncrementEffectIds,
    findAllNestedEffectIds,
    findEffectsByFolder,
    findFolder,
    findFolders,
} from "../../utils/finds.ts";
import { Settings } from "../../settings.ts";
import { MODULE_ID } from "../../constants.ts";
import { Flags } from "../../utils/flags.ts";

const { HandlebarsApplicationMixin } = foundry.applications.api;

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

const ENTRY_PARTIAL = `modules/${MODULE_ID}/templates/ce-app/partials/document-partial.hbs`;
const FOLDER_PARTIAL = `modules/${MODULE_ID}/templates/ce-app/partials/folder-partial.hbs`;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types -- the return type is the class built here
function ConvenientDirectoryMixin<
    TBase extends AbstractConstructorOf<ApplicationV2<any>> & {
        DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration>;
    },
>(Base: TBase) {
    abstract class ConvenientDirectory extends HandlebarsApplicationMixin(Base) {
        abstract readonly isBackup: boolean;

        protected settings = new Settings();

        static override DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration> = {
            actions: {
                collapseFolders: ConvenientDirectory.#onCollapseFolders,
                toggleFolder: ConvenientDirectory.#onToggleFolder,
            },
        };

        static override PARTS = {
            header: {
                template: `modules/${MODULE_ID}/templates/ce-app/header.hbs`,
            },
            directory: {
                template: `modules/${MODULE_ID}/templates/ce-app/directory.hbs`,
                templates: [ENTRY_PARTIAL, FOLDER_PARTIAL],
                scrollable: [""],
            },
        };

        abstract _getEntryContextOptions(): ContextMenuEntry[];

        abstract _getFolderContextOptions(): ContextMenuEntry[];

        abstract _getEntryDragData(entryId: string): object;

        abstract _canDragDrop(selector: string): boolean;

        abstract _canDragStart(selector: string): boolean;

        _createContextMenus(): void {
            this._createContextMenu(this._getFolderContextOptions, ".folder .folder-header", {
                fixed: true,
            });
            this._createContextMenu(this._getEntryContextOptions, ".directory-item[data-entry-id]", {
                fixed: true,
            });
        }

        _canCreateFolder(): boolean {
            return false;
        }

        protected override async _onFirstRender(context: object, options: HandlebarsRenderOptions): Promise<void> {
            await super._onFirstRender(context, options);
            this._createContextMenus();
        }

        protected override async _onRender(context: object, options: HandlebarsRenderOptions): Promise<void> {
            await super._onRender(context, options);

            if (options.parts?.includes("header")) {
                new foundry.applications.ux.SearchFilter({
                    inputSelector: "search input",
                    contentSelector: ".directory-list",
                    callback: this._onSearchFilter.bind(this),
                    initial: (this.element.querySelector("search input") as HTMLInputElement)?.value ?? "",
                }).bind(this.element);
            }

            if (options.parts?.includes("directory")) {
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

        protected override async _prepareContext(options: HandlebarsRenderOptions): Promise<object> {
            const context = await super._prepareContext(options);
            Object.assign(context, {
                folderIcon: CONFIG.Folder.sidebarIcon ?? "fa-solid fa-folder",
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

        async _prepareDirectoryContext(context: object, _options: HandlebarsRenderOptions): Promise<void> {
            const folders = findFolders({
                backup: this.isBackup,
            });
            const nestedEffectIds = findAllNestedEffectIds({
                backup: this.isBackup,
            });
            const incrementEffectIds = findAllIncrementEffectIds({
                backup: this.isBackup,
            });

            const folderData: FolderData[] = folders
                .filter((folder) => {
                    const isViewable = Flags.isViewable(folder) ?? true;
                    const showHiddenEffects = this.settings.showHiddenEffects;
                    const hasPermission = folder.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED);

                    return hasPermission && (showHiddenEffects || isViewable);
                })
                .map((folder) => {
                    const viewableEffects = findEffectsByFolder(folder.id, {
                        backup: this.isBackup,
                    }).filter((effect) => {
                        if (this.isBackup) {
                            return true;
                        }

                        // Filter only if not backup

                        /*
                        if show hidden and show child
                            - isViewable can be true or false
                            - Can be included in child or not
                            - Show all effects

                        if show hidden and not show child
                            - isViewable can be true or false
                            - Cannot be included in child
                            - Show all effects minus child effects

                        if not show hidden and show child
                            - isViewable must be true
                            - Can be included in child or not
                            - Show all effects minus hidden effects

                        if not show hidden and not show child
                            - isViewable must be true
                            - Cannot be included in child
                            - Show all effects minus hidden and minus child
                        */
                        const ceEffectId = Flags.getCeEffectId(effect);
                        if (!ceEffectId) return false;

                        const isViewable = Flags.isViewable(effect) ?? true;
                        const isChildEffect =
                            nestedEffectIds.includes(ceEffectId) || incrementEffectIds.includes(ceEffectId);
                        const showHiddenEffects = this.settings.showHiddenEffects;
                        const showChildEffects = this.settings.showChildEffects;

                        if (showHiddenEffects && showChildEffects) {
                            return true; // all
                        } else if (showHiddenEffects && !showChildEffects) {
                            return !isChildEffect;
                        } else if (!showHiddenEffects && showChildEffects) {
                            return isViewable;
                        } else if (!showHiddenEffects && !showChildEffects) {
                            return isViewable && !isChildEffect;
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
                isBackup: this.isBackup,
                entryPartial: ENTRY_PARTIAL,
                folderPartial: FOLDER_PARTIAL,
            });
        }

        async _prepareHeaderContext(context: object, _options: HandlebarsRenderOptions): Promise<void> {
            Object.assign(context, {
                canViewBackups: game.user.isGM && !this.isBackup,
                canCreateFolder: this._canCreateFolder(),
                isBackup: this.isBackup,
                effectsVersion: this.isBackup ? this.settings.backupEffectsVersion : this.settings.effectsVersion,
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
                const searchInput = priorElement.querySelector("search input") as HTMLInputElement;

                if (searchInput) {
                    stateTyped.query = searchInput.value;
                }
            }
        }

        protected override _syncPartState(
            partId: string,
            newElement: HTMLElement,
            priorElement: HTMLElement,
            state: object,
        ): void {
            super._syncPartState(partId, newElement, priorElement, state);
            const stateTyped = state as { query?: string };

            if (partId === "header" && stateTyped.query) {
                const searchInput = newElement.querySelector("search input") as HTMLInputElement;

                if (searchInput) {
                    searchInput.value = stateTyped.query;
                }
            }
        }

        async collapseAll(): Promise<void> {
            for (const el of this.element.querySelectorAll(".directory-item.folder")) {
                el.classList.remove("expanded");
            }

            if (!this.isBackup) {
                await this.settings.clearExpandedFolders();
            }
        }

        static async #onCollapseFolders(): Promise<void> {
            const thisClass = this as unknown as ConvenientDirectory;
            return thisClass.collapseAll();
        }

        static async #onToggleFolder(...args: any[]): Promise<void> {
            const [event, target] = args as [PointerEvent, HTMLElement];
            const thisClass = this as unknown as ConvenientDirectory;
            return thisClass._onToggleFolder(event, target);
        }

        async _onToggleFolder(_event: PointerEvent, target: HTMLElement): Promise<void> {
            const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
            folderHtml.classList.toggle("expanded");

            const folderId = folderHtml.dataset.folderId;
            if (!folderId) return;

            if (!this.isBackup) {
                if (this.settings.isFolderExpanded(folderId)) {
                    await this.settings.removeExpandedFolder(folderId);
                } else {
                    await this.settings.addExpandedFolder(folderId);
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

        _onMatchSearchEntry(query: string, entryIds: Set<string>, element: HTMLElement, _options: object): void {
            const entryId = element.dataset.entryId;
            if (!entryId) return;

            element.style.display = !query || entryIds.has(entryId) ? "flex" : "none";
        }

        _onSearchFilter(
            _event: KeyboardEvent,
            query: string,
            rgx: RegExp | undefined,
            html: HTMLElement | null | undefined,
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
                this._matchSearchEntries(rgx, entryIds, folderIds, autoExpandIds, options);
            }

            // Toggle each directory entry.
            for (const el of html?.querySelectorAll(".directory-item") ?? []) {
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
                        elHtml.classList.toggle("expanded", this.settings.isFolderExpanded(folderId));
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
                    backup: this.isBackup,
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
            query: RegExp | undefined,
            entryIds: Set<string>,
            folderIds: Set<string>,
            autoExpandIds: Set<string>,
            _options: object = {},
        ): void {
            // Note: This is from FoundryVTT: we could do a different search
            const nameOnlySearch = true;
            const entries = findAllEffects({
                backup: this.isBackup,
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
                else if (nameOnlySearch && query?.test(foundry.applications.ux.SearchFilter.cleanQuery(entry.name))) {
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
            query: RegExp | undefined,
            folderIds: Set<string>,
            autoExpandIds: Set<string>,
            _options: object = {},
        ): void {
            const folders = findFolders({
                backup: this.isBackup,
            });

            for (const folder of folders) {
                if (query?.test(foundry.applications.ux.SearchFilter.cleanQuery(folder.name))) {
                    this.#onMatchFolder(folder, folderIds, autoExpandIds, {
                        autoExpand: false,
                    });
                }
            }
        }

        _onDragOver(_event: DragEvent): void {}

        _onDragStart(event: DragEvent): void {
            if (!event.currentTarget) return;

            const entryHtml = (event.currentTarget as HTMLElement).closest(".directory-item.entry") as HTMLElement;
            const effectId = entryHtml.dataset.ceEffectId;

            if (!effectId) return;

            const dragData = this._getEntryDragData(effectId);
            event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));
        }

        _onDrop(_event: DragEvent): void | Promise<void> {}
    }

    return ConvenientDirectory;
}

export { ConvenientDirectoryMixin };
