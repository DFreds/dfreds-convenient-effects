import { ApplicationRenderOptions } from "types/foundry/client-esm/applications/_types.js";
import { Settings } from "../../settings.ts";
import { MODULE_IDS } from "../../constants.ts";
import {
    findEffectByCeId,
    findFolder,
    findModuleById,
    findEffectByUuid,
} from "../../utils/finds.ts";
import { getInputFromDialog } from "../create-edit-folder-dialog.ts";
import { Flags } from "../../utils/flags.ts";
import { StatusEffectsModule } from "../../integrations/status-effect-types.ts";
import {
    createConvenientEffect,
    createConvenientItem,
} from "../../utils/creates.ts";
import { getBaseType } from "../../utils/gets.ts";
import { log } from "../../logger.ts";
import {
    BaseConvenientEffectsV2,
    ConvenientEffectsOptions,
} from "./base-convenient-effects-v2.ts";
import { BackupConvenientEffectsV2 } from "./backup-convenient-effects-v2.ts";

class ConvenientEffectsV2 extends BaseConvenientEffectsV2 {
    #settings: Settings;

    constructor() {
        super();
        this.#settings = new Settings();
    }

    static override DEFAULT_OPTIONS: DeepPartial<ConvenientEffectsOptions> = {
        id: "convenient-effects-v2",
        window: {
            title: "ConvenientEffects.AppName",
        },
        // renderUpdateKeys: ["name", "img"],
        actions: {
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

    override _canCreateEntry(): boolean {
        // TODO
        return true;
        // return game.user.hasPermission("ITEM_CREATE");
    }

    override _canCreateFolder(): boolean {
        const canCreateItems = game.user.hasPermission("ITEM_CREATE");
        const settingEnabled =
            game.user.role >= this.#settings.createFoldersPermission;

        return canCreateItems && settingEnabled;
    }

    override _getEntryContextOptions(): ContextMenuEntry[] {
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

                    // todo force: true when this is app v2 type
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

                    const original = game.dfreds.effectInterface.findEffect({
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
                    clone.sheet.render(true);
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

    override _getFolderContextOptions(): ContextMenuEntry[] {
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

    protected override _onRender(
        context: object,
        options: ApplicationRenderOptions,
    ): void {
        super._onRender(context, options);

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

        if (options.parts?.includes("directory")) {
            this.#settings.expandedFolders.forEach((folderId) => {
                const folderHtml = this.element.querySelector(
                    `[data-folder-id="${folderId}"]`,
                ) as HTMLElement;
                if (folderHtml) {
                    folderHtml.classList.add("expanded");
                }
            });

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

        this.render({ parts: ["directory"] });
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

        this.render({ parts: ["directory"] });
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

        this.render({ parts: ["directory"] });
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

    override _canDragDrop(_selector: string): boolean {
        return game.user.role >= this.#settings.appControlsPermission;
    }

    override _canDragStart(_selector: string): boolean {
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

                if (originalFolder?.isOwner) {
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

    override _getEntryDragData(entryId: string): object {
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

    override _onDragOver(_event: DragEvent): void {}

    override async _onDrop(event: DragEvent): Promise<void> {
        // @ts-expect-error not typed
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
