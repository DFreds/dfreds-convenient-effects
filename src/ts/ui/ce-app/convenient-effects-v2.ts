
import { ApplicationConfiguration } from "@client/applications/_types.mjs";
import {
    findAllEffects,
    findAllNestedEffectIds,
    findEffectByCeId,
    findEffectByUuid,
    findEffectsByFolder,
    findFolder,
    findFolders,
    findModuleById,
} from "../../utils/finds.ts";
import { getApi, getItemType } from "../../utils/gets.ts";
import { Settings } from "../../settings.ts";
import { MODULE_ID, MODULE_IDS } from "../../constants.ts";
import { ContextMenuEntry } from "@client/applications/ux/context-menu.mjs";
import { HandlebarsRenderOptions } from "@client/applications/api/_module.mjs";
import { ConvenientFolderConfig } from "../ce-config/convenient-folder-config.ts";
import { createConvenientEffect } from "../../utils/creates.ts";
import { Flags } from "../../utils/flags.ts";
import { error } from "../../logger.ts";
import { BackupConvenientEffectsV2 } from "./backup-convenient-effects-v2.ts";

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { AbstractSidebarTab } = foundry.applications.sidebar;

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

class ConvenientEffectsV2 extends HandlebarsApplicationMixin(
    AbstractSidebarTab<ConvenientEffectsOptions>,
) {
    #settings: Settings;

    constructor(options?: DeepPartial<ConvenientEffectsOptions>) {
        super(options);
        this.#settings = new Settings();
    }

    static override tabName: string = "convenientEffects";

    static override DEFAULT_OPTIONS: DeepPartial<ConvenientEffectsOptions> = {
        classes: ["directory", "flexcol"],
        window: {
            title: "ConvenientEffects.AppName",
            icon: "fa-solid fa-hand-sparkles",
        },
        actions: {
            collapseFolders: ConvenientEffectsV2.#onCollapseFolders,
            toggleFolder: ConvenientEffectsV2.#onToggleFolder,
            activateEntry: ConvenientEffectsV2.#onClickEntry,
            createEntry: ConvenientEffectsV2.#onCreateEntry,
            createFolder: ConvenientEffectsV2.#onCreateFolder,
            toggleHiddenEffects: ConvenientEffectsV2.#onToggleHiddenEffects,
            toggleNestedEffects: ConvenientEffectsV2.#onToggleNestedEffects,
            togglePrioritizeTargets:
                ConvenientEffectsV2.#onTogglePrioritizeTargets,
            viewBackups: ConvenientEffectsV2.#onViewBackups,
        },
        convenientEffects: {
            backup: false,
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
                ConvenientEffectsV2._entryPartial,
                ConvenientEffectsV2._folderPartial,
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
        const canCreateItems = game.user.hasPermission("ITEM_CREATE");
        const settingEnabled =
            game.user.role >= this.#settings.createFoldersPermission;

        return canCreateItems && settingEnabled;
    }

    _getEntryContextOptions(): ContextMenuEntry[] {
        return [
            {
                name: "ConvenientEffects.EditEffect",
                icon: '<i class="fa-regular fa-pen-to-square"></i>',
                condition: (li) => {
                    return this.#isUserFolderOwner(li);
                },
                callback: (li) => {
                    const folderHtml = li.closest(
                        ".directory-item.folder",
                    ) as HTMLElement;
                    const folderId = folderHtml.dataset.folderId;

                    const effectHtml = li.closest(
                        "[data-ce-effect-id]",
                    ) as HTMLElement;
                    const effectId = effectHtml.dataset.ceEffectId;

                    if (!folderId || !effectId) return;

                    const effect = getApi().findEffect({
                        folderId,
                        effectId,
                    });

                    // todo force: true when this is app v2 type
                    effect?.sheet?.render(true);
                },
            },
            {
                name: "ConvenientEffects.DeleteEffect",
                icon: '<i class="fa-regular fa-trash"></i>',
                condition: (li) => {
                    return this.#isUserFolderOwner(li);
                },
                callback: async (li) => {
                    const folderHtml = li.closest(
                        ".directory-item.folder",
                    ) as HTMLElement;
                    const folderId = folderHtml.dataset.folderId;

                    const effectHtml = li.closest(
                        "[data-ce-effect-id]",
                    ) as HTMLElement;
                    const effectId = effectHtml.dataset.ceEffectId;

                    if (!folderId || !effectId) return;

                    const effect = getApi().findEffect({
                        folderId,
                        effectId,
                    });

                    await effect?.deleteDialog();
                },
            },
            {
                name: "ConvenientEffects.ToggleAsOverlay",
                icon: '<i class="fa-regular fa-dot-circle"></i>',
                callback: async (li) => {
                    const effectHtml = li.closest(
                        "[data-ce-effect-id]",
                    ) as HTMLElement;
                    const effectId = effectHtml.dataset.ceEffectId;

                    if (!effectId) return;

                    await getApi().toggleEffect({
                        effectId,
                        overlay: true,
                        prioritizeTargets: this.#settings.prioritizeTargets,
                    });
                },
            },
            {
                name: "ConvenientEffects.ToggleStatusEffect",
                icon: '<i class="fa-regular fa-person-rays"></i>',
                condition: (_li) => {
                    return !!findModuleById(MODULE_IDS.STATUS_EFFECTS)?.active;
                },
                callback: async (li) => {
                    const effectHtml = li.closest(
                        "[data-ce-effect-id]",
                    ) as HTMLElement;
                    const ceEffectId = effectHtml.dataset.ceEffectId;

                    if (!ceEffectId) return;

                    const ceEffect = findEffectByCeId(ceEffectId, {
                        backup: this.options.convenientEffects.backup,
                    });
                    if (!ceEffect) return;

                    const statusEffectsModule = findModuleById(
                        MODULE_IDS.STATUS_EFFECTS,
                    ) as StatusEffectsModule | undefined;
                    if (!statusEffectsModule?.active) return;

                    const statusEffectsApi = statusEffectsModule.api;
                    const statusEffect = statusEffectsApi.findStatusEffect({
                        effectId: ceEffectId,
                        effectName: ceEffect.name,
                    });

                    if (statusEffect) {
                        await statusEffectsApi.deleteStatusEffect({
                            effectId: ceEffectId,
                            effectName: ceEffect.name,
                        });
                    } else {
                        await statusEffectsApi.createNewStatusEffects({
                            effectsData: [ceEffect.toObject()],
                        });
                    }

                    await this.render({ force: true });
                },
            },
            {
                name: "SIDEBAR.Duplicate",
                icon: '<i class="fa-regular fa-copy"></i>',
                condition: (li) => {
                    return this.#isUserFolderOwner(li);
                },
                callback: async (li) => {
                    const folderHtml = li.closest(
                        ".directory-item.folder",
                    ) as HTMLElement;
                    const folderId = folderHtml.dataset.folderId;

                    const effectHtml = li.closest(
                        "[data-ce-effect-id]",
                    ) as HTMLElement;
                    const effectId = effectHtml.dataset.ceEffectId;

                    if (!folderId || !effectId) return;

                    const original = getApi().findEffect({
                        folderId,
                        effectId,
                    });

                    if (!original) return;

                    const clone = await original.clone(
                        {
                            name: game.i18n.format("DOCUMENT.CopyOf", {
                                name: original._source.name,
                            }),
                        },
                        { save: true, addSource: true },
                    );

                    // todo force: true when this is app v2 type
                    clone?.sheet?.render(true);
                },
            },
            {
                name: "ConvenientEffects.ShowEffect",
                icon: '<i class="fa-regular fa-eye"></i>',
                condition: (li) => {
                    return (
                        this.#isUserFolderOwner(li) &&
                        !this.#isEffectViewable(li)
                    );
                },
                callback: (li) => {
                    this.#setEffectViewable(li, true);
                },
            },
            {
                name: "ConvenientEffects.HideEffect",
                icon: '<i class="fa-regular fa-eye-slash"></i>',
                condition: (li) => {
                    return (
                        this.#isUserFolderOwner(li) &&
                        this.#isEffectViewable(li)
                    );
                },
                callback: (li) => {
                    this.#setEffectViewable(li, false);
                },
            },
        ];
    }

    _getFolderContextOptions(): ContextMenuEntry[] {
        return [
            {
                name: "FOLDER.Edit",
                icon: '<i class="fa-solid fa-pen-to-square"></i>',
                condition: (header) => {
                    return this.#isUserFolderOwner(header);
                },
                callback: async (header) => {
                    const folderHtml = header.closest(
                        ".directory-item.folder",
                    ) as HTMLElement;
                    const folder = findFolder(
                        folderHtml.dataset.folderId ?? "",
                        {
                            backup: this.options.convenientEffects.backup,
                        },
                    );

                    if (!folder) return;

                    const folderConfig = new ConvenientFolderConfig({
                        // TODO: this any is because of some circular dependencies with ActiveEffect
                        document: folder as any,
                    });

                    folderConfig.render({ force: true });
                },
            },
            {
                name: "FOLDER.Delete",
                icon: '<i class="fa-solid fa-dumpster"></i>',
                condition: (header) => {
                    return this.#isUserFolderOwner(header);
                },
                callback: async (header) => {
                    const folderHtml = header.closest(
                        ".directory-item.folder",
                    ) as HTMLElement;
                    const folder = findFolder(
                        folderHtml.dataset.folderId ?? "",
                        {
                            backup: this.options.convenientEffects.backup,
                        },
                    );

                    await folder?.deleteDialog();
                },
            },
            {
                name: "OWNERSHIP.Configure",
                icon: '<i class="fa-solid fa-lock"></i>',
                condition: () => game.user.isGM,
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

                    // @ts-expect-error Not type defined
                    new DocumentOwnershipConfig({
                        document: folder,
                        position: {
                            top: Math.min(
                                folderHtml.offsetTop,
                                window.innerHeight - 350,
                            ),
                            left: window.innerWidth - 720,
                        },
                    }).render({ force: true });
                },
            },
            {
                name: "ConvenientEffects.ShowFolder",
                icon: '<i class="fas fa-eye fa-fw"></i>',
                condition: (header) => {
                    return (
                        this.#isUserFolderOwner(header) &&
                        !this.#isFolderViewable(header)
                    );
                },
                callback: (header) => {
                    this.#setFolderViewable(header, true);
                },
            },
            {
                name: "ConvenientEffects.HideFolder",
                icon: '<i class="fas fa-eye-slash fa-fw"></i>',
                condition: (header) => {
                    return (
                        this.#isUserFolderOwner(header) &&
                        this.#isFolderViewable(header)
                    );
                },
                callback: (header) => {
                    this.#setFolderViewable(header, false);
                },
            },
            {
                name: "SIDEBAR.Export",
                icon: '<i class="fa-solid fa-file-export"></i>',
                condition: (header) => {
                    return this.#isUserFolderOwner(header);
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
            {
                name: "SIDEBAR.Import",
                icon: '<i class="fa-solid fa-file-import"></i>',
                condition: (header) => {
                    return this.#isUserFolderOwner(header);
                },
                callback: async (header) => {
                    const folderHtml = header.closest(
                        ".directory-item.folder",
                    ) as HTMLElement;
                    const folder = findFolder(
                        folderHtml.dataset.folderId ?? "",
                        {
                            backup: this.options.convenientEffects.backup,
                        },
                    );

                    await folder?.importFromJSONDialog();
                },
            },
        ];
    }

    protected override async _onFirstRender(
        context: object,
        options: HandlebarsRenderOptions,
    ): Promise<void> {
        await super._onFirstRender(context, options);
        this._createContextMenus();
    }

    protected override async _onRender(
        context: object,
        options: HandlebarsRenderOptions,
    ): Promise<void> {
        await super._onRender(context, options);

        // Search
        if (options.parts?.includes("header")) {
            new foundry.applications.ux.SearchFilter({
                inputSelector: "search input",
                contentSelector: ".directory-list",
                callback: this._onSearchFilter.bind(this),
                initial: (
                    this.element.querySelector(
                        "search input",
                    ) as HTMLInputElement
                ).value,
            }).bind(this.element);
        }

        // Drag-drop
        if (options.parts?.includes("directory")) {
            new foundry.applications.ux.DragDrop.implementation({
                dragSelector: ".directory-item",
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

            this.element
                .querySelectorAll(".directory-item.folder")
                .forEach((folder) => {
                    folder.addEventListener(
                        "dragenter",
                        this._onDragHighlight.bind(this) as EventListener,
                    );
                    folder.addEventListener(
                        "dragleave",
                        this._onDragHighlight.bind(this) as EventListener,
                    );
                });
        }

        // Toggle buttons
        if (options.parts?.includes("header")) {
            const showHiddenEffectsButton = this.element.querySelector(
                "[data-action='toggleHiddenEffects']",
            ) as HTMLButtonElement;
            const showNestedEffectsButton = this.element.querySelector(
                "[data-action='toggleNestedEffects']",
            ) as HTMLButtonElement;
            const prioritizeTargetsButton = this.element.querySelector(
                "[data-action='togglePrioritizeTargets']",
            ) as HTMLButtonElement;

            if (showHiddenEffectsButton) {
                const showHiddenEffects = this.#settings.showHiddenEffects;
                showHiddenEffectsButton.setAttribute(
                    "aria-pressed",
                    showHiddenEffects.toString(),
                );
            }

            if (showNestedEffectsButton) {
                const showNestedEffects = this.#settings.showNestedEffects;
                showNestedEffectsButton.setAttribute(
                    "aria-pressed",
                    showNestedEffects.toString(),
                );
            }

            if (prioritizeTargetsButton) {
                const prioritizeTargets = this.#settings.prioritizeTargets;
                prioritizeTargetsButton.setAttribute(
                    "aria-pressed",
                    prioritizeTargets.toString(),
                );
            }
        }

        // Expand folders
        if (options.parts?.includes("directory")) {
            this.#settings.expandedFolders.forEach((folderId) => {
                const folderHtml = this.element.querySelector(
                    `[data-folder-id="${folderId}"]`,
                ) as HTMLElement;
                if (folderHtml) {
                    folderHtml.classList.add("expanded");
                }
            });
        }
    }

    protected override async _prepareContext(
        options: HandlebarsRenderOptions,
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
            entryPartial: ConvenientEffectsV2._entryPartial,
            folderPartial: ConvenientEffectsV2._folderPartial,
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
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass.collapseAll();
    }

    static async #onToggleFolder(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
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

        const folderId = folderHtml.dataset.folderId;
        if (!folderId) return;

        if (!this.options.convenientEffects.backup) {
            if (this.#settings.isFolderExpanded(folderId)) {
                await this.#settings.removeExpandedFolder(folderId);
            } else {
                await this.#settings.addExpandedFolder(folderId);
            }
        }

        if (this.isPopout) this.setPosition();
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
            this._matchSearchEntries(
                rgx,
                entryIds,
                folderIds,
                autoExpandIds,
                options,
            );
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
        query: RegExp | undefined,
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
                query?.test(
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
        query: RegExp | undefined,
        folderIds: Set<string>,
        autoExpandIds: Set<string>,
        _options: object = {},
    ): void {
        const folders = findFolders({
            backup: this.options.convenientEffects.backup,
        });

        for (const folder of folders) {
            if (
                query?.test(
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

    static async #onClickEntry(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onClickEntry(event, target);
    }

    async _onClickEntry(
        _event: PointerEvent,
        target: HTMLElement,
    ): Promise<void> {
        const effectId = (target.closest("[data-ce-effect-id]") as HTMLElement)
            ?.dataset.ceEffectId;

        if (!effectId) return;

        await getApi().toggleEffect({
            effectId,
            prioritizeTargets: this.#settings.prioritizeTargets,
        });
    }

    static async #onCreateEntry(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onCreateEntry(event, target);
    }

    async _onCreateEntry(
        event: PointerEvent,
        target: HTMLElement,
    ): Promise<void> {
        event.stopPropagation();

        const folderHtml = target.closest(
            ".directory-item.folder",
        ) as HTMLElement;
        const folderId = folderHtml.dataset.folderId;

        if (!folderId) return;

        const folder = findFolder(folderId, {
            backup: this.options.convenientEffects.backup,
        });

        if (!folder) return;

        const newEffect = createConvenientEffect({
            effect: {
                name: game.i18n.localize("ConvenientEffects.NewEffect"),
                img: "icons/svg/aura.svg",
            },
        });

        const effects = await folder.createEmbeddedDocuments("ActiveEffect", [
            newEffect,
        ]);

        if (effects[0]) {
            // todo force: true when this is app v2 type
            (effects[0] as ActiveEffect<Item<null>>)?.sheet?.render(true);
        } else {
            error("Failed to create effect");
        }
    }

    static async #onCreateFolder(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onCreateFolder(event, target);
    }

    async _onCreateFolder(
        event: PointerEvent,
        _target: HTMLElement,
    ): Promise<void> {
        event.stopPropagation();

        const folderConfig = new ConvenientFolderConfig({
            // TODO this is because of circular dependencies in ActiveEffect
            document: new Item.implementation({
                name: game.i18n.localize("SIDEBAR.ACTIONS.CREATE.Folder"),
                type: getItemType(),
            }) as any,
        });

        folderConfig.render({ force: true });
    }

    static async #onToggleHiddenEffects(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onToggleHiddenEffects(event, target);
    }

    async _onToggleHiddenEffects(
        _event: PointerEvent,
        target: HTMLElement,
    ): Promise<void> {
        await this.#settings.setShowHiddenEffects(
            !this.#settings.showHiddenEffects,
        );

        const buttonHtml = target.closest("button") as HTMLButtonElement;
        const isHiddenEffects = this.#settings.showHiddenEffects;
        buttonHtml.setAttribute("aria-pressed", isHiddenEffects.toString());

        // @ts-expect-error Parts are available here
        this.render({ parts: ["header", "directory"] });
    }

    static async #onToggleNestedEffects(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onToggleNestedEffects(event, target);
    }

    async _onToggleNestedEffects(
        _event: PointerEvent,
        target: HTMLElement,
    ): Promise<void> {
        await this.#settings.setShowNestedEffects(
            !this.#settings.showNestedEffects,
        );

        const buttonHtml = target.closest("button") as HTMLButtonElement;
        const isNestedEffects = this.#settings.showNestedEffects;
        buttonHtml.setAttribute("aria-pressed", isNestedEffects.toString());

        // @ts-expect-error Parts are available here
        this.render({ parts: ["header", "directory"] });
    }

    static async #onTogglePrioritizeTargets(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onTogglePrioritizeTargets(event, target);
    }

    async _onTogglePrioritizeTargets(
        _event: PointerEvent,
        target: HTMLElement,
    ): Promise<void> {
        await this.#settings.setPrioritizeTargets(
            !this.#settings.prioritizeTargets,
        );

        const buttonHtml = target.closest("button") as HTMLButtonElement;
        const isPrioritizeTargets = this.#settings.prioritizeTargets;
        buttonHtml.setAttribute("aria-pressed", isPrioritizeTargets.toString());

        // @ts-expect-error Parts are available here
        this.render({ parts: ["header", "directory"] });
    }

    static async #onViewBackups(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onViewBackups(event, target);
    }

    async _onViewBackups(
        _event: PointerEvent,
        _target: HTMLElement,
    ): Promise<void> {
        new BackupConvenientEffectsV2().render({ force: true });
    }

    _canDragDrop(_selector: string): boolean {
        return game.user.role >= this.#settings.appControlsPermission;
    }

    _canDragStart(_selector: string): boolean {
        return game.user.role >= this.#settings.appControlsPermission;
    }

    async _createDroppedEntry(
        entry: ActiveEffect<Item<null>>,
        newFolder?: Item<null>,
        originalFolder?: Item<null>,
    ): Promise<void> {
        const isFromBackup = Flags.isBackup(entry);

        if (isFromBackup) {
            const effectObject = entry.toObject();
            Flags.setIsBackup(effectObject, false);
            await newFolder?.createEmbeddedDocuments("ActiveEffect", [
                effectObject,
            ]);
        } else {
            if (newFolder?.isOwner) {
                await newFolder.createEmbeddedDocuments("ActiveEffect", [
                    entry,
                ]);

                if (!originalFolder) return;

                if (originalFolder.isOwner) {
                    await entry.delete();
                } else {
                    ui.notifications.warn(
                        game.i18n.format(
                            "ConvenientEffects.NoPermissionToRemoveEffect",
                            {
                                effectName: entry.name,
                                originalFolderName: originalFolder?.name ?? "",
                                newFolderName: newFolder?.name ?? "",
                            },
                        ),
                    );
                }
            } else {
                ui.notifications.warn(
                    game.i18n.format(
                        "ConvenientEffects.NoPermissionToAddEffect",
                        {
                            effectName: entry.name,
                            newFolderName: newFolder?.name ?? "",
                        },
                    ),
                );
            }
        }
    }

    _entryBelongsToFolder(
        entry: ActiveEffect<Item<null>>,
        folder?: Item<null>,
    ): boolean {
        if (!folder) return false;
        return entry.parent.id === folder.id;
    }

    async _getDroppedEntryFromData(data: {
        uuid?: string;
        effectId?: string;
    }): Promise<ActiveEffect<any> | undefined> {
        return data.uuid
            ? await findEffectByUuid(data.uuid)
            : data.effectId
              ? findEffectByCeId(data.effectId, {
                    backup: false,
                })
              : undefined;
    }

    _getEntryDragData(entryId: string): object {
        const effect = findEffectByCeId(entryId, {
            backup: this.options.convenientEffects.backup,
        });

        if (!effect) return {};

        const dragData = Flags.getNestedEffectIds(effect)
            ? {
                  effectId: entryId,
              }
            : effect.toDragData();

        return dragData;
    }

    async _handleDroppedEntry(
        target: HTMLElement,
        data: {
            uuid?: string;
            effectId?: string;
        },
    ): Promise<void> {
        const closestFolder = target.closest(
            ".directory-item.folder",
        ) as HTMLElement;
        closestFolder.classList.remove("droptarget");
        const folderId = closestFolder.dataset.folderId;
        if (!data || !folderId) return;

        const newFolder = findFolder(folderId, {
            backup: false, // only care about non-backup folders
        });

        const entry = await this._getDroppedEntryFromData(data);
        if (!entry) return;

        if (this._entryBelongsToFolder(entry, newFolder)) return;

        const originalFolder = findFolder(entry.parent.id, {
            backup: false, // only care about non-backup folders
        });

        await this._createDroppedEntry(entry, newFolder, originalFolder);
    }

    _onDragHighlight(event: DragEvent): void {
        event.stopPropagation();
        if (event.type === "dragenter") {
            for (const el of this.element.querySelectorAll(".droptarget")) {
                el.classList.remove("droptarget");
            }
        }
        if (
            event.type === "dragleave" &&
            (event.currentTarget as HTMLElement)?.contains(event.target as Node)
        ) {
            return;
        }

        (event.currentTarget as HTMLElement).classList.toggle(
            "droptarget",
            event.type === "dragenter",
        );
    }

    _onDragOver(_event: DragEvent): void {}

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

    async _onDrop(event: DragEvent): Promise<void> {
        const data = foundry.applications.ux.TextEditor.getDragEventData(event);

        const target =
            (event.target as HTMLElement).closest(".directory-item.folder") ??
            null;
        if (!target) return;

        return this._handleDroppedEntry(target as HTMLElement, data);
    }

    #isUserFolderOwner(header: HTMLElement): boolean {
        const folderHtml = header.closest(
            ".directory-item.folder",
        ) as HTMLElement;
        const folder = findFolder(folderHtml.dataset.folderId ?? "", {
            backup: this.options.convenientEffects.backup,
        });

        return folder?.isOwner ?? false;
    }

    #isFolderViewable(header: HTMLElement): boolean {
        const folderHtml = header.closest(
            ".directory-item.folder",
        ) as HTMLElement;
        const folder = findFolder(folderHtml.dataset.folderId ?? "", {
            backup: this.options.convenientEffects.backup,
        });

        if (!folder) return false;

        return Flags.isViewable(folder);
    }

    #isEffectViewable(li: HTMLElement): boolean {
        const folderHtml = li.closest(".directory-item.folder") as HTMLElement;
        const folderId = folderHtml.dataset.folderId;

        const effectHtml = li.closest("[data-ce-effect-id]") as HTMLElement;
        const effectId = effectHtml.dataset.ceEffectId;

        if (!folderId || !effectId) return false;

        const effect = getApi().findEffect({
            folderId,
            effectId,
        });

        if (!effect) return false;

        return Flags.isViewable(effect);
    }

    async #setFolderViewable(
        header: HTMLElement,
        value: boolean,
    ): Promise<void> {
        const folderHtml = header.closest(
            ".directory-item.folder",
        ) as HTMLElement;
        const folder = findFolder(folderHtml.dataset.folderId ?? "", {
            backup: this.options.convenientEffects.backup,
        });

        if (!folder) return;

        await Flags.setIsViewable(folder, value);
    }

    async #setEffectViewable(li: HTMLElement, value: boolean): Promise<void> {
        const folderHtml = li.closest(".directory-item.folder") as HTMLElement;
        const folderId = folderHtml.dataset.folderId;

        const effectHtml = li.closest("[data-ce-effect-id]") as HTMLElement;
        const effectId = effectHtml.dataset.ceEffectId;

        if (!folderId || !effectId) return;

        const effect = getApi().findEffect({
            folderId,
            effectId,
        });

        if (!effect) return;

        await Flags.setIsViewable(effect, value);
    }
}

export { ConvenientEffectsV2 };
