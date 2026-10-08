import { ApplicationConfiguration } from "@client/applications/_types.mjs";
import { findEffectByCeId, findEffectByUuid, findFolder, findModuleById } from "../../utils/finds.ts";
import { getActorUuids, getApi, getItemType, isEffectIncrementable } from "../../utils/gets.ts";
import { MODULE_IDS } from "../../constants.ts";
import { ContextMenuEntry } from "@client/applications/ux/context-menu.mjs";
import { HandlebarsRenderOptions } from "@client/applications/api/_module.mjs";
import { ConvenientFolderConfig } from "../ce-config/convenient-folder-config.ts";
import { createConvenientEffect } from "../../utils/creates.ts";
import { Flags } from "../../utils/flags.ts";
import { error } from "../../logger.ts";
import { BackupConvenientEffectsV2 } from "./backup-convenient-effects-v2.ts";
import { ConvenientDirectoryMixin } from "./convenient-directory-mixin.ts";

const { AbstractSidebarTab } = foundry.applications.sidebar;

class ConvenientEffectsV2 extends ConvenientDirectoryMixin(AbstractSidebarTab) {
    readonly isBackup = false;

    refresh: () => void;

    constructor(options?: DeepPartial<ApplicationConfiguration>) {
        super(options);

        this.refresh = foundry.utils.debounce(this.render.bind(this), 30);
    }

    static override tabName: string = "convenientEffects";

    static override DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration> = {
        classes: ["directory", "flexcol", "convenient-effects-app"],
        window: {
            title: "ConvenientEffects.AppName",
            icon: "fa-solid fa-hand-sparkles",
        },
        actions: {
            activateEntry: ConvenientEffectsV2.#onClickEntry,
            createEntry: ConvenientEffectsV2.#onCreateEntry,
            createFolder: ConvenientEffectsV2.#onCreateFolder,
            toggleHiddenEffects: ConvenientEffectsV2.#onToggleHiddenEffects,
            toggleChildEffects: ConvenientEffectsV2.#onToggleChildEffects,
            togglePrioritizeTargets: ConvenientEffectsV2.#onTogglePrioritizeTargets,
            viewBackups: ConvenientEffectsV2.#onViewBackups,
        },
    };

    override _canCreateFolder(): boolean {
        const canCreateItems = game.user.hasPermission("ITEM_CREATE");
        const settingEnabled = game.user.role >= this.settings.createFoldersPermission;

        return canCreateItems && settingEnabled;
    }

    _getEntryContextOptions(): ContextMenuEntry[] {
        return [
            {
                label: "ConvenientEffects.EditEffect",
                icon: '<i class="fa-regular fa-pen-to-square"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html);
                },
                onClick: (_event: PointerEvent, target: HTMLElement) => {
                    const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
                    const folderId = folderHtml.dataset.folderId;

                    const effectHtml = target.closest("[data-ce-effect-id]") as HTMLElement;
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
                label: "ConvenientEffects.DeleteEffect",
                icon: '<i class="fa-regular fa-trash"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html);
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
                    const folderId = folderHtml.dataset.folderId;

                    const effectHtml = target.closest("[data-ce-effect-id]") as HTMLElement;
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
                label: "ConvenientEffects.AddEffect",
                icon: '<i class="fa-regular fa-plus"></i>',
                visible: (html: HTMLElement) => {
                    return !this.#isEffectIncrementable(html);
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const effectHtml = target.closest("[data-ce-effect-id]") as HTMLElement;
                    const effectId = effectHtml.dataset.ceEffectId;

                    if (!effectId) return;

                    const documentUuids = getActorUuids(this.settings.prioritizeTargets);
                    if (documentUuids.length === 0) {
                        ui.notifications.warn(`Please select or target a token to add this effect`);
                        return;
                    }

                    const promises = documentUuids.map(async (uuid) => {
                        return getApi().addEffect({
                            effectId,
                            uuid,
                        });
                    });

                    await Promise.all(promises);
                },
            },
            {
                label: "ConvenientEffects.RemoveEffect",
                icon: '<i class="fa-regular fa-minus"></i>',
                visible: (html: HTMLElement) => {
                    return !this.#isEffectIncrementable(html);
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const effectHtml = target.closest("[data-ce-effect-id]") as HTMLElement;
                    const effectId = effectHtml.dataset.ceEffectId;

                    if (!effectId) return;

                    const documentUuids = getActorUuids(this.settings.prioritizeTargets);
                    if (documentUuids.length === 0) {
                        ui.notifications.warn(`Please select or target a token to remove this effect`);
                        return;
                    }

                    const promises = documentUuids.map(async (uuid) => {
                        return getApi().removeEffect({
                            effectId,
                            uuid,
                        });
                    });

                    await Promise.all(promises);
                },
            },
            {
                label: "ConvenientEffects.Increment",
                icon: '<i class="fa-regular fa-circle-plus"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isEffectIncrementable(html);
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const effectHtml = target.closest("[data-ce-effect-id]") as HTMLElement;
                    const effectId = effectHtml.dataset.ceEffectId;

                    if (!effectId) return;

                    await getApi().toggleEffect({
                        effectId,
                        prioritizeTargets: this.settings.prioritizeTargets,
                        direction: 1,
                    });
                },
            },
            {
                label: "ConvenientEffects.Decrement",
                icon: '<i class="fa-regular fa-circle-minus"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isEffectIncrementable(html);
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const effectHtml = target.closest("[data-ce-effect-id]") as HTMLElement;
                    const effectId = effectHtml.dataset.ceEffectId;

                    if (!effectId) return;

                    await getApi().toggleEffect({
                        effectId,
                        prioritizeTargets: this.settings.prioritizeTargets,
                        direction: -1,
                    });
                },
            },
            {
                label: "ConvenientEffects.ToggleAsOverlay",
                icon: '<i class="fa-regular fa-dot-circle"></i>',
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const effectHtml = target.closest("[data-ce-effect-id]") as HTMLElement;
                    const effectId = effectHtml.dataset.ceEffectId;

                    if (!effectId) return;

                    await getApi().toggleEffect({
                        effectId,
                        overlay: true,
                        prioritizeTargets: this.settings.prioritizeTargets,
                    });
                },
            },
            {
                label: "ConvenientEffects.ToggleStatusEffect",
                icon: '<i class="fa-regular fa-person-rays"></i>',
                visible: (_html: HTMLElement) => {
                    return !!findModuleById(MODULE_IDS.STATUS_EFFECTS)?.active;
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const effectHtml = target.closest("[data-ce-effect-id]") as HTMLElement;
                    const ceEffectId = effectHtml.dataset.ceEffectId;

                    if (!ceEffectId) return;

                    const ceEffect = findEffectByCeId(ceEffectId, {
                        backup: this.isBackup,
                    });
                    if (!ceEffect) return;

                    const statusEffectsModule = findModuleById(MODULE_IDS.STATUS_EFFECTS) as
                        StatusEffectsModule | undefined;
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
                label: "SIDEBAR.Duplicate",
                icon: '<i class="fa-regular fa-copy"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html);
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
                    const folderId = folderHtml.dataset.folderId;

                    const effectHtml = target.closest("[data-ce-effect-id]") as HTMLElement;
                    const effectId = effectHtml.dataset.ceEffectId;

                    if (!folderId || !effectId) return;

                    const original = getApi().findEffect({
                        folderId,
                        effectId,
                    });

                    if (!original) return;

                    const clone = original.clone(
                        {
                            name: game.i18n.localize("DOCUMENT.CopyOf", {
                                name: original._source.name,
                            }),
                        },
                        { save: true, addSource: true },
                    );

                    clone?.sheet?.render(true);
                },
            },
            {
                label: "ConvenientEffects.ShowEffect",
                icon: '<i class="fa-regular fa-eye"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html) && !this.#isEffectViewable(html);
                },
                onClick: (_event: PointerEvent, target: HTMLElement) => {
                    this.#setEffectViewable(target, true);
                },
            },
            {
                label: "ConvenientEffects.HideEffect",
                icon: '<i class="fa-regular fa-eye-slash"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html) && this.#isEffectViewable(html);
                },
                onClick: (_event: PointerEvent, target: HTMLElement) => {
                    this.#setEffectViewable(target, false);
                },
            },
        ];
    }

    _getFolderContextOptions(): ContextMenuEntry[] {
        return [
            {
                label: "FOLDER.Edit",
                icon: '<i class="fa-solid fa-pen-to-square"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html);
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
                    const folder = findFolder(folderHtml.dataset.folderId ?? "", {
                        backup: this.isBackup,
                    });

                    if (!folder) return;

                    const folderConfig = new ConvenientFolderConfig({
                        // TODO: this any is because of some circular dependencies with ActiveEffect
                        document: folder as any,
                    });

                    folderConfig.render({ force: true });
                },
            },
            {
                label: "FOLDER.Delete",
                icon: '<i class="fa-solid fa-dumpster"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html);
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
                    const folder = findFolder(folderHtml.dataset.folderId ?? "", {
                        backup: this.isBackup,
                    });

                    await folder?.deleteDialog();
                },
            },
            {
                label: "OWNERSHIP.Configure",
                icon: '<i class="fa-solid fa-lock"></i>',
                visible: () => game.user.isGM,
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
                    const folder = findFolder(folderHtml.dataset.folderId ?? "", {
                        backup: this.isBackup,
                    });

                    // @ts-expect-error Not type defined
                    new DocumentOwnershipConfig({
                        document: folder,
                        position: {
                            top: Math.min(folderHtml.offsetTop, window.innerHeight - 350),
                            left: window.innerWidth - 720,
                        },
                    }).render({ force: true });
                },
            },
            {
                label: "ConvenientEffects.ShowFolder",
                icon: '<i class="fas fa-eye fa-fw"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html) && !this.#isFolderViewable(html);
                },
                onClick: (_event: PointerEvent, target: HTMLElement) => {
                    this.#setFolderViewable(target, true);
                },
            },
            {
                label: "ConvenientEffects.HideFolder",
                icon: '<i class="fas fa-eye-slash fa-fw"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html) && this.#isFolderViewable(html);
                },
                onClick: (_event: PointerEvent, target: HTMLElement) => {
                    this.#setFolderViewable(target, false);
                },
            },
            {
                label: "SIDEBAR.Export",
                icon: '<i class="fa-solid fa-file-export"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html);
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
                    const folder = findFolder(folderHtml.dataset.folderId ?? "", {
                        backup: this.isBackup,
                    });

                    folder?.exportToJSON();
                },
            },
            {
                label: "SIDEBAR.Import",
                icon: '<i class="fa-solid fa-file-import"></i>',
                visible: (html: HTMLElement) => {
                    return this.#isUserFolderOwner(html);
                },
                onClick: async (_event: PointerEvent, target: HTMLElement) => {
                    const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
                    const folder = findFolder(folderHtml.dataset.folderId ?? "", {
                        backup: this.isBackup,
                    });

                    await folder?.importFromJSONDialog();
                },
            },
        ];
    }

    protected override async _onRender(context: object, options: HandlebarsRenderOptions): Promise<void> {
        await super._onRender(context, options);

        // Drag-drop
        if (options.parts?.includes("directory")) {
            this.element.querySelectorAll(".directory-item.folder").forEach((folder) => {
                folder.addEventListener("dragenter", this._onDragHighlight.bind(this) as EventListener);
                folder.addEventListener("dragleave", this._onDragHighlight.bind(this) as EventListener);
            });
        }

        // Toggle buttons
        if (options.parts?.includes("header")) {
            const showHiddenEffectsButton = this.element.querySelector(
                "[data-action='toggleHiddenEffects']",
            ) as HTMLButtonElement;
            const showChildEffectsButton = this.element.querySelector(
                "[data-action='toggleChildEffects']",
            ) as HTMLButtonElement;
            const prioritizeTargetsButton = this.element.querySelector(
                "[data-action='togglePrioritizeTargets']",
            ) as HTMLButtonElement;

            if (showHiddenEffectsButton) {
                const showHiddenEffects = this.settings.showHiddenEffects;
                showHiddenEffectsButton.setAttribute("aria-pressed", showHiddenEffects.toString());
            }

            if (showChildEffectsButton) {
                const showChildEffects = this.settings.showChildEffects;
                showChildEffectsButton.setAttribute("aria-pressed", showChildEffects.toString());
            }

            if (prioritizeTargetsButton) {
                const prioritizeTargets = this.settings.prioritizeTargets;
                prioritizeTargetsButton.setAttribute("aria-pressed", prioritizeTargets.toString());
            }
        }

        // Expand folders
        if (options.parts?.includes("directory")) {
            this.settings.expandedFolders.forEach((folderId) => {
                const folderHtml = this.element.querySelector(`[data-folder-id="${folderId}"]`) as HTMLElement;
                if (folderHtml) {
                    folderHtml.classList.add("expanded");
                }
            });
        }
    }

    override async _onToggleFolder(event: PointerEvent, target: HTMLElement): Promise<void> {
        await super._onToggleFolder(event, target);

        if (this.isPopout) this.setPosition();
    }

    static async #onClickEntry(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onClickEntry(event, target);
    }

    async _onClickEntry(event: PointerEvent, target: HTMLElement): Promise<void> {
        const effectId = (target.closest("[data-ce-effect-id]") as HTMLElement)?.dataset.ceEffectId;

        if (!effectId) return;

        // Shift-click decrements incrementable effects; the direction is ignored by all other effects
        const direction: 1 | -1 = event.shiftKey ? -1 : 1;

        await getApi().toggleEffect({
            effectId,
            prioritizeTargets: this.settings.prioritizeTargets,
            direction,
        });
    }

    static async #onCreateEntry(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onCreateEntry(event, target);
    }

    async _onCreateEntry(event: PointerEvent, target: HTMLElement): Promise<void> {
        event.stopPropagation();

        const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
        const folderId = folderHtml.dataset.folderId;

        if (!folderId) return;

        const folder = findFolder(folderId, {
            backup: this.isBackup,
        });

        if (!folder) return;

        const newEffect = createConvenientEffect({
            effect: {
                name: game.i18n.localize("ConvenientEffects.NewEffect"),
                img: "icons/svg/aura.svg",
            },
        });

        const effects = await folder.createEmbeddedDocuments("ActiveEffect", [newEffect]);

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

    async _onCreateFolder(event: PointerEvent, _target: HTMLElement): Promise<void> {
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

    async _onToggleHiddenEffects(_event: PointerEvent, target: HTMLElement): Promise<void> {
        await this.settings.setShowHiddenEffects(!this.settings.showHiddenEffects);

        const buttonHtml = target.closest("button") as HTMLButtonElement;
        const isHiddenEffects = this.settings.showHiddenEffects;
        buttonHtml.setAttribute("aria-pressed", isHiddenEffects.toString());

        // @ts-expect-error Parts are available here
        this.render({ parts: ["header", "directory"] });
    }

    static async #onToggleChildEffects(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onToggleChildEffects(event, target);
    }

    async _onToggleChildEffects(_event: PointerEvent, target: HTMLElement): Promise<void> {
        await this.settings.setShowChildEffects(!this.settings.showChildEffects);

        const buttonHtml = target.closest("button") as HTMLButtonElement;
        const isChildEffects = this.settings.showChildEffects;
        buttonHtml.setAttribute("aria-pressed", isChildEffects.toString());

        // @ts-expect-error Parts are available here
        this.render({ parts: ["header", "directory"] });
    }

    static async #onTogglePrioritizeTargets(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onTogglePrioritizeTargets(event, target);
    }

    async _onTogglePrioritizeTargets(_event: PointerEvent, target: HTMLElement): Promise<void> {
        await this.settings.setPrioritizeTargets(!this.settings.prioritizeTargets);

        const buttonHtml = target.closest("button") as HTMLButtonElement;
        const isPrioritizeTargets = this.settings.prioritizeTargets;
        buttonHtml.setAttribute("aria-pressed", isPrioritizeTargets.toString());

        // @ts-expect-error Parts are available here
        this.render({ parts: ["header", "directory"] });
    }

    static async #onViewBackups(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectsV2;
        return thisClass._onViewBackups(event, target);
    }

    async _onViewBackups(_event: PointerEvent, _target: HTMLElement): Promise<void> {
        new BackupConvenientEffectsV2().render({ force: true });
    }

    _canDragDrop(_selector: string): boolean {
        return game.user.role >= this.settings.appControlsPermission;
    }

    _canDragStart(_selector: string): boolean {
        return game.user.role >= this.settings.appControlsPermission;
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
            await newFolder?.createEmbeddedDocuments("ActiveEffect", [effectObject]);
        } else {
            if (newFolder?.isOwner) {
                const convenientEffect = createConvenientEffect({
                    effect: entry.toObject(),
                });
                await newFolder.createEmbeddedDocuments("ActiveEffect", [convenientEffect]);

                if (!originalFolder) return;

                if (originalFolder.isOwner) {
                    await entry.delete();
                } else {
                    ui.notifications.warn(
                        game.i18n.localize("ConvenientEffects.NoPermissionToRemoveEffect", {
                            effectName: entry.name,
                            originalFolderName: originalFolder?.name ?? "",
                            newFolderName: newFolder?.name ?? "",
                        }),
                    );
                }
            } else {
                ui.notifications.warn(
                    game.i18n.localize("ConvenientEffects.NoPermissionToAddEffect", {
                        effectName: entry.name,
                        newFolderName: newFolder?.name ?? "",
                    }),
                );
            }
        }
    }

    _entryBelongsToFolder(entry: ActiveEffect<Item<null>>, folder?: Item<null>): boolean {
        if (!folder) return false;
        return entry.parent.id === folder.id;
    }

    async _getDroppedEntryFromData(data: { uuid?: string; effectId?: string }): Promise<ActiveEffect<any> | undefined> {
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
            backup: this.isBackup,
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
        const closestFolder = target.closest(".directory-item.folder") as HTMLElement;
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
        if (event.type === "dragleave" && (event.currentTarget as HTMLElement)?.contains(event.target as Node)) {
            return;
        }

        (event.currentTarget as HTMLElement).classList.toggle("droptarget", event.type === "dragenter");
    }

    override async _onDrop(event: DragEvent): Promise<void> {
        const data = foundry.applications.ux.TextEditor.getDragEventData(event);

        const target = (event.target as HTMLElement).closest(".directory-item.folder") ?? null;
        if (!target) return;

        return this._handleDroppedEntry(target as HTMLElement, data);
    }

    #isUserFolderOwner(header: HTMLElement): boolean {
        const folderHtml = header.closest(".directory-item.folder") as HTMLElement;
        const folder = findFolder(folderHtml.dataset.folderId ?? "", {
            backup: this.isBackup,
        });

        return folder?.isOwner ?? false;
    }

    #isFolderViewable(header: HTMLElement): boolean {
        const folderHtml = header.closest(".directory-item.folder") as HTMLElement;
        const folder = findFolder(folderHtml.dataset.folderId ?? "", {
            backup: this.isBackup,
        });

        if (!folder) return false;

        return Flags.isViewable(folder) ?? false;
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

        return Flags.isViewable(effect) ?? false;
    }

    #isEffectIncrementable(li: HTMLElement): boolean {
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

        return isEffectIncrementable(effect);
    }

    async #setFolderViewable(header: HTMLElement, value: boolean): Promise<void> {
        const folderHtml = header.closest(".directory-item.folder") as HTMLElement;
        const folder = findFolder(folderHtml.dataset.folderId ?? "", {
            backup: this.isBackup,
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
