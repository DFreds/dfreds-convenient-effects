import {
    ApplicationConfiguration,
    ApplicationRenderOptions,
} from "types/foundry/client-esm/applications/_types.js";
import {
    HandlebarsRenderOptions,
    HandlebarsTemplatePart,
} from "types/foundry/client-esm/applications/api/handlebars-application.ts";
import { Settings } from "../settings.ts";
import { MODULE_ID, MODULE_IDS } from "../constants.ts";
import {
    findAllEffects,
    findAllNestedEffectIds,
    findEffectsByFolder,
    findEffectByCeId,
    findFolder,
    findFolders,
    findModuleById,
    findEffectByUuid,
} from "../utils/finds.ts";
import { getInputFromDialog } from "../ui/create-edit-folder-dialog.ts";
import { Flags } from "../utils/flags.ts";
import { StatusEffectsModule } from "../integrations/status-effect-types.ts";
import {
    createConvenientEffect,
    createConvenientItem,
} from "../utils/creates.ts";
import { getBaseType } from "../utils/gets.ts";
import { log } from "../logger.ts";
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

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
    ApplicationV2<ConvenientEffectsOptions>,
) {
    #settings: Settings;

    constructor() {
        super();
        this.#settings = new Settings();
    }

    static override DEFAULT_OPTIONS: DeepPartial<ConvenientEffectsOptions> = {
        id: "convenient-effects-v2",
        classes: [
            "tab",
            "sidebar-tab",
            "directory",
            "flexcol",
            "sidebar-popout",
        ],
        tag: "section",
        window: {
            contentClasses: ["standard-form"],
            icon: "fa-solid fa-hand-sparkles",
            title: "ConvenientEffects.AppName",
            resizable: true,
            minimizable: true,
        },
        position: {
            width: 300,
            height: 600,
            top: 75,
            left: 125,
        },
        // renderUpdateKeys: ["name", "img"],
        actions: {
            activateEntry: ConvenientEffectsV2.#onClickEntry,
            collapseFolders: ConvenientEffectsV2.#onCollapseFolders,
            createEntry: ConvenientEffectsV2.#onCreateEntry,
            createFolder: ConvenientEffectsV2.#onCreateFolder,
            toggleFolder: ConvenientEffectsV2.#onToggleFolder,
            toggleHiddenEffects: ConvenientEffectsV2.#onToggleHiddenEffects,
            toggleNestedEffects: ConvenientEffectsV2.#onToggleNestedEffects,
            togglePrioritizeTargets:
                ConvenientEffectsV2.#onTogglePrioritizeTargets,
            viewBackups: ConvenientEffectsV2.#onViewBackups,
            // toggleSearch: DocumentDirectory.#onToggleSearch,
            // toggleSort: DocumentDirectory.#onToggleSort,
        },
        convenientEffects: {
            backup: false,
        },
    };

    static override PARTS = {
        header: {
            template: `modules/${MODULE_ID}/templates/header.hbs`,
        },
        directory: {
            template: `modules/${MODULE_ID}/templates/directory.hbs`,
            scrollable: [""],
        },
    };

    static _entryPartial = `modules/${MODULE_ID}/templates/partials/document-partial.hbs`;

    static _folderPartial = `modules/${MODULE_ID}/templates/partials/folder-partial.hbs`;

    protected override _configureRenderParts(
        options: HandlebarsRenderOptions,
    ): Record<string, HandlebarsTemplatePart> {
        const parts = super._configureRenderParts(options);

        parts.directory.templates ??= [];
        parts.directory.templates.push(
            ConvenientEffectsV2._entryPartial,
            ConvenientEffectsV2._folderPartial,
        );

        return parts;
    }

    _canCreateEntry(): boolean {
        return true;
        // return game.user.hasPermission("ITEM_CREATE");
    }

    _canCreateFolder(): boolean {
        const canCreateItems = game.user.hasPermission("ITEM_CREATE");
        const settingEnabled =
            game.user.role >= this.#settings.createFoldersPermission;

        return canCreateItems && settingEnabled;
    }

    _createContextMenus(): void {
        this._createContextMenu(
            this._getFolderContextOptions,
            ".folder .folder-header",
        );
        this._createContextMenu(
            this._getEntryContextOptions,
            ".directory-item[data-entry-id]",
        );
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

                    const effect = game.dfreds.effectInterface.findEffect({
                        folderId,
                        effectId,
                    });

                    effect?.sheet.render(true);
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

                    const effect = game.dfreds.effectInterface.findEffect({
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

                    await game.dfreds.effectInterface.toggleEffect({
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

                    const ceEffect = findEffectByCeId(ceEffectId);
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

                    const folder = findFolder(folderId, {
                        backup: false,
                    });
                    const effect = game.dfreds.effectInterface.findEffect({
                        folderId,
                        effectId,
                    });

                    if (!effect) return;

                    const effects = await folder?.createEmbeddedDocuments(
                        "ActiveEffect",
                        [effect],
                    );

                    if (!effects) return;

                    (effects[0] as ActiveEffect<Item<null>>).sheet.render(true);
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

                    const result = await getInputFromDialog({ folder });

                    if (result.operation === "update") {
                        await Flags.setFolderColor(folder, result.data.color);
                        await folder.update({
                            name: result.data.name,
                        });
                    }
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

            const showHiddenEffectsButton = this.element.querySelector(
                ".show-hidden-effects",
            ) as HTMLButtonElement;
            const showNestedEffectsButton = this.element.querySelector(
                ".show-nested-effects",
            ) as HTMLButtonElement;
            const prioritizeTargetsButton = this.element.querySelector(
                ".prioritize-targets",
            ) as HTMLButtonElement;

            if (showHiddenEffectsButton) {
                const showHiddenEffects = this.#settings.showHiddenEffects;
                if (showHiddenEffects) {
                    showHiddenEffectsButton.classList.add("active");
                } else {
                    showHiddenEffectsButton.classList.remove("active");
                }
            }

            if (showNestedEffectsButton) {
                const showNestedEffects = this.#settings.showNestedEffects;
                if (showNestedEffects) {
                    showNestedEffectsButton.classList.add("active");
                } else {
                    showNestedEffectsButton.classList.remove("active");
                }
            }

            if (prioritizeTargetsButton) {
                const prioritizeTargets = this.#settings.prioritizeTargets;
                if (prioritizeTargets) {
                    prioritizeTargetsButton.classList.add("active");
                } else {
                    prioritizeTargetsButton.classList.remove("active");
                }
            }
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
        options: ApplicationRenderOptions,
    ): Promise<object> {
        const context = await super._prepareContext(options);
        Object.assign(context, {
            folderIcon: CONFIG.Folder.sidebarIcon,
            label: "DOCUMENT.ActiveEffect",
            labelPlural: "DOCUMENT.ActiveEffects",
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
        const folders = findFolders({ backup: false });
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
            // documentCls: "",
            entryPartial: ConvenientEffectsV2._entryPartial,
            folderPartial: ConvenientEffectsV2._folderPartial,
            // maxFolderDepth: 1,
            // TODO tree is essentially the folderData
            // tree: folderData
        });
    }

    async _prepareHeaderContext(
        context: object,
        _options: HandlebarsRenderOptions,
    ): Promise<void> {
        Object.assign(context, {
            canViewBackups: game.user.isGM,
            canCreateEntry: this._canCreateEntry(),
            canCreateFolder: this._canCreateFolder(),
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
        await this.#settings.clearExpandedFolders();
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

        await game.dfreds.effectInterface.toggleEffect({
            effectId,
            prioritizeTargets: this.#settings.prioritizeTargets,
        });
    }

    static async #onCollapseFolders(): Promise<void> {
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass.collapseAll();
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

        (effects[0] as ActiveEffect<Item<null>>).sheet.render(true);
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
        const result = await getInputFromDialog({});

        if (result.operation === "create") {
            const itemData = createConvenientItem({
                item: {
                    name: result.data.name,
                    type: getBaseType(),
                },
            });

            Flags.setFolderColor(itemData, result.data.color);

            const item = await Item.create(itemData);

            log(`Created item ${item?.id}`);
        }
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

        if (this.#settings.isFolderExpanded(folderId)) {
            await this.#settings.removeExpandedFolder(folderId);
        } else {
            await this.#settings.addExpandedFolder(folderId);
        }
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

        if (isHiddenEffects) {
            buttonHtml.classList.add("active");
        } else {
            buttonHtml.classList.remove("active");
        }

        this.render({ force: true });
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

        if (isNestedEffects) {
            buttonHtml.classList.add("active");
        } else {
            buttonHtml.classList.remove("active");
        }

        this.render({ force: true });
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

        if (isPrioritizeTargets) {
            buttonHtml.classList.add("active");
        } else {
            buttonHtml.classList.remove("active");
        }

        this.render({ force: true });
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
        // TODO
        console.log("onViewBackups");
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
                // uuid in elHtml.dataset
                const match = folderIds.has(folderId ?? "");
                elHtml.style.display = !query || match ? "flex" : "none";
                if (autoExpandIds.has(folderId ?? "")) {
                    if (query && match) elHtml.classList.add("expanded");
                } else {
                    // TODO
                    // elHtml.classList.toggle(
                    //     "expanded",
                    //     uuid in game.folders._expanded,
                    // );
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

        // @ts-expect-error ignore for now
        const visited = folderIds.has(folderId);
        folderIds.add(folderId);

        if (autoExpand) {
            autoExpandIds.add(folderId);
        }

        // if ( !visited && folder.folder ) this.#onMatchFolder(folder.folder, folderIds, autoExpandIds);
    }

    _matchSearchEntries(
        query: RegExp,
        entryIds: Set<string>,
        folderIds: Set<string>,
        autoExpandIds: Set<string>,
        options: object = {},
    ): void {
        console.log(
            "matchSearchEntries",
            query,
            entryIds,
            folderIds,
            autoExpandIds,
            options,
        );

        const nameOnlySearch = true; // TODO
        const entries = findAllEffects({
            backup: this.options.convenientEffects.backup,
        });

        const matchedFolderIds = new Set(folderIds);

        for (const entry of entries) {
            const entryId = entry._id;

            if (!entryId || !entry.parent._id) continue;

            if (matchedFolderIds.has(entry.parent._id)) {
                entryIds.add(entryId);
            } else if (
                nameOnlySearch &&
                query.test(
                    // @ts-expect-error no types for this yet
                    foundry.applications.ux.SearchFilter.cleanQuery(entry.name),
                )
            ) {
                entryIds.add(entryId);
                this.#onMatchFolder(
                    entry.parent,
                    matchedFolderIds,
                    autoExpandIds,
                );
            }
        }
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
        return game.user.role >= this.#settings.appControlsPermission;
    }

    _canDragStart(_selector: string): boolean {
        return game.user.role >= this.#settings.appControlsPermission;
    }

    async _createDroppedEntry(
        entry: object, // TODO i think it's the active effect
        updates?: object,
    ): Promise<ActiveEffect<Item<null>> | null> {
        console.log("createDroppedEntry", entry, updates);
        // TODO
        return Promise.resolve(null);
    }

    async _createDroppedFolderContent(
        folder: Folder,
        targetFolder?: Folder,
    ): Promise<Folder[]> {
        console.log("createDroppedFolderContent", folder, targetFolder);
        // TODO
        return [];
    }

    async _createDroppedFolderDocuments(
        folder: Folder,
        documents: object[],
    ): Promise<ActiveEffect<Item<null>>[]> {
        console.log("createDroppedFolderDocuments", folder, documents);
        // TODO
        return [];
    }

    _entryAlreadyExists(entry: ClientDocument): boolean {
        console.log("entryAlreadyExists", entry);
        // TODO
        return false;
    }

    _entryBelongsToFolder(
        entry: object, // TODO i think it's the active effect
        folder: string,
    ): boolean {
        console.log("entryBelongsToFolder", entry, folder);
        // TODO
        return false;
    }

    async _getDroppedEntryFromData(
        data: object,
    ): Promise<ActiveEffect<any> | undefined> {
        return ActiveEffect.fromDropData(data);
    }

    _getEntryDragData(entryId: string): object {
        console.log("getEntryDragData", entryId);
        // return findEffect(entryId, { backup: false })?.toDragData() ?? {};
        // TODO
        return {};
    }

    _getFolderDragData(folderId: string): object {
        return findFolder(folderId, { backup: false })?.toDragData() ?? {};
    }

    async _handleDroppedEntry(
        target: HTMLElement,
        data: object,
    ): Promise<void> {
        console.log("handleDroppedEntry", target, data);
        // TODO
    }

    async _handleDroppedFolder(
        target: HTMLElement,
        data: object,
    ): Promise<void> {
        console.log("handleDroppedFolder", target, data);
        // TODO
    }

    async _handleDroppedForeignFolder(
        folder: Folder,
        closestFolderId: string,
        sortData: object,
    ): Promise<{ folder: Folder; sortNeeded: boolean } | null> {
        console.log(
            "handleDroppedForeignFolder",
            folder,
            closestFolderId,
            sortData,
        );
        // TODO
        return null;
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

    _onDragOver(event: DragEvent): void {
        console.log("onDragOver", event);
    }

    _onDragStart(event: DragEvent): void {
        // ui.context?.close({ animate: false });
        // const { entryId, folderId } = event.currentTarget.dataset;
        // const dragData = folderId ? this._getFolderDragData(folderId) : this._getEntryDragData(entryId);
        // event.dataTransfer.setData("text/plain", JSON.stringify(dragData));

        if (!event.currentTarget) return;

        const folderHtml = (event.currentTarget as HTMLElement).closest(
            ".directory-item.folder",
        ) as HTMLElement;
        const folderId = folderHtml.dataset.folderId;

        const entryHtml = (event.currentTarget as HTMLElement).closest(
            ".directory-item.entry",
        ) as HTMLElement;
        const effectId = entryHtml.dataset.ceEffectId;

        if (!folderId || !effectId) return;

        const effect = game.dfreds.effectInterface.findEffect({
            folderId,
            effectId,
        });

        if (!effect) return;

        if (Flags.getNestedEffectIds(effect)) {
            // Specially handle nested effect drops to trigger the dialog
            // See dropActorSheetData hook for details
            event.dataTransfer?.setData(
                "text/plain",
                JSON.stringify({
                    effectId: Flags.getCeEffectId(effect),
                }),
            );
        } else {
            // Let regular core handle drop
            const dragData = effect.toDragData();
            event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));
        }
    }

    async _onDrop(event: DragEvent): Promise<void> {
        // const data = foundry.applications.ux.TextEditor.getDragEventData(event);
        // if (!data.type) return;
        // const target = event.target.closest('.directory-item') ?? null;
        // if (data.type === 'Folder') return this._handleDroppedFolder(target, data);
        // else if (data.type === this.documentName)
        //   return this._handleDroppedEntry(target, data);
        // todo handle dropped item or actor?

        const effectData =
            // @ts-expect-error not typed
            foundry.applications.ux.TextEditor.getDragEventData(event);

        if (!event.target) return;

        const folderHtml = (event.target as HTMLElement).closest(
            ".directory-item.folder",
        ) as HTMLElement;
        const folderId = folderHtml.dataset.folderId;

        if (!effectData || !folderId) return;

        const effect =
            (await findEffectByUuid(effectData.uuid)) ??
            findEffectByCeId(effectData.effectId);

        if (!effect) return;

        const originalFolder = findFolder(effect.parent.id, {
            backup: false,
        });
        const newFolder = findFolder(folderId, {
            backup: false,
        });

        const isFromBackup = Flags.isBackup(effect);

        if (isFromBackup) {
            const effectObject = effect.toObject();
            Flags.setIsBackup(effectObject, false);
            await newFolder?.createEmbeddedDocuments("ActiveEffect", [
                effectObject,
            ]);
        } else {
            if (newFolder?.isOwner) {
                await newFolder.createEmbeddedDocuments("ActiveEffect", [
                    effect,
                ]);

                if (originalFolder?.isOwner) {
                    await effect.delete();
                } else {
                    ui.notifications.warn(
                        game.i18n.format(
                            "ConvenientEffects.NoPermissionToRemoveEffect",
                            {
                                effectName: effect.name,
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
                            effectName: effect.name,
                            newFolderName: newFolder?.name ?? "",
                        },
                    ),
                );
            }
        }
    }

    async _organizeDroppedFoldersAndDocuments(
        folder: Folder,
        targetFolder?: Folder,
    ): Promise<{ foldersToCreate: Folder[]; documentsToCreate: Document[] }> {
        console.log("organizeDroppedFoldersAndDocuments", folder, targetFolder);
        // TODO
        return { foldersToCreate: [], documentsToCreate: [] };
    }

    static async _handleDroppedFolder(
        target: HTMLElement,
        data: object,
        config: {
            folders: Folder[];
            label: string;
            maxFolderDepth: number;
            type: string;
        },
    ): Promise<{
        closestFolderId?: string;
        folder: Folder;
        sortData: object;
        foreign?: boolean;
    } | void> {
        console.log("handleDroppedFolder", target, data, config);
        // TODO
        return;
    }

    // TODO probably put in a controller

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

        const effect = game.dfreds.effectInterface.findEffect({
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

        const effect = game.dfreds.effectInterface.findEffect({
            folderId,
            effectId,
        });

        if (!effect) return;

        await Flags.setIsViewable(effect, value);
    }
}

export { ConvenientEffectsV2 };
