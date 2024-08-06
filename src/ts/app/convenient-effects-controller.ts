import { ConvenientEffectsApp } from "./convenient-effects-app.ts";
import { Settings } from "../settings.ts";
import {
    createConvenientEffect,
    createConvenientItem,
    findEffectFolderItems,
    findEffectsForItem,
    getBaseType,
} from "../helpers.ts";
import { log } from "../logger.ts";
import { getInputFromDialog } from "../ui/create-edit-folder-dialog.ts";
import { Flags } from "../utils/flags.ts";

interface ViewData {
    folderData: FolderData[];
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

interface SearchResults {
    effectIds?: Set<string>;
    folderIds?: Set<string>;
}

/**
 * Controller class that handles events from the app and manipulating the underlying Foundry data
 */
class ConvenientEffectsController {
    #viewMvc: ConvenientEffectsApp;
    #settings: Settings;

    /**
     * Initializes the controller and its dependencies
     *
     * @param viewMvc - the app that the controller can interact with
     */
    constructor(viewMvc: ConvenientEffectsApp) {
        this.#viewMvc = viewMvc;
        this.#settings = new Settings();
    }

    getData(): ViewData {
        // TODO don't show nested effects
        const folders = findEffectFolderItems();
        const folderData = folders.map((folder) => ({
            folder,
            effects: findEffectsForItem(folder.id),
        }));

        return {
            folderData,
        };
    }

    isUserFolderOwner(target: JQuery<HTMLElement>): boolean {
        const folderId = this.#findClosestFolderIdByElement(target);
        if (!folderId) return false;

        const item = game.items.get(folderId);

        return item?.isOwner ?? false;
    }

    /**
     * Handles clicks on folders by collapsing or expanding them
     *
     * @param event - event that corresponds to clicking on the folder
     */
    async onToggleFolder(event: Event): Promise<void> {
        const folderId = this.#findClosestFolderIdByEvent(event);

        if (!folderId) return;

        if (this.#viewMvc.isFolderCollapsed(folderId)) {
            this.#viewMvc.expandFolder(folderId);
        } else {
            this.#viewMvc.collapseFolder(folderId);
        }

        if (this.#settings.isFolderExpanded(folderId)) {
            await this.#settings.removeExpandedFolder(folderId);
        } else {
            await this.#settings.addExpandedFolder(folderId);
        }
    }

    /**
     * Handles clicks on effect items by toggling them on or off on selected tokens
     *
     * @param event - event that corresponds to clicking an effect item
     */
    async onToggleEffect(event: Event): Promise<void> {
        const effectId = this.#findClosestEffectIdByEvent(event);

        if (!effectId) return;

        await game.dfreds.effectInterface.toggleEffect({
            effectId,
            prioritizeTargets: this.#settings.prioritizeTargets,
        });
    }

    async onToggleOverlay(target: JQuery<HTMLElement>): Promise<void> {
        const effectId = this.#findClosestEffectIdByElement(target);

        if (!effectId) return;

        await game.dfreds.effectInterface.toggleEffect({
            effectId,
            overlay: true,
            prioritizeTargets: this.#settings.prioritizeTargets,
        });
    }

    async onCreateFolder(_event: Event): Promise<void> {
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

    async onCreateEffect(event: Event): Promise<void> {
        event.stopPropagation();

        const folderId = this.#findClosestFolderIdByEvent(event);
        if (!folderId) return;

        const folder = game.items.get(folderId);
        if (!folder) return;

        // TODO checkbox for if passive?

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

    async onDuplicateEffect(target: JQuery<HTMLElement>): Promise<void> {
        const folderId = this.#findClosestFolderIdByElement(target);
        const effectId = this.#findClosestEffectIdByElement(target);

        if (!folderId || !effectId) return;

        const item = game.items.get(folderId);
        const effect = game.dfreds.effectInterface.findEffect({
            folderId,
            effectId,
        });

        if (!effect) return;

        const effects = await item?.createEmbeddedDocuments("ActiveEffect", [
            effect,
        ]);

        if (!effects) return;

        (effects[0] as ActiveEffect<Item<null>>).sheet.render(true);
    }

    async onEditFolder(target: JQuery<HTMLElement>): Promise<void> {
        const folderId = this.#findClosestFolderIdByElement(target);
        if (!folderId) return;

        const folder = game.items.get(folderId);
        if (!folder) return;

        const result = await getInputFromDialog({ folder });

        if (result.operation === "update") {
            await Flags.setFolderColor(folder, result.data.color);
            await folder.update({
                name: result.data.name,
            });

            log(`Updated item ${folder.id}`);
        }
    }

    async onEditEffect(target: JQuery<HTMLElement>): Promise<void> {
        const folderId = this.#findClosestFolderIdByElement(target);
        const effectId = this.#findClosestEffectIdByElement(target);

        if (!folderId || !effectId) return;

        const effect = game.dfreds.effectInterface.findEffect({
            folderId,
            effectId,
        });

        effect?.sheet.render(true);
    }

    async onDeleteAllFolder(target: JQuery<HTMLElement>): Promise<void> {
        const folderId = this.#findClosestFolderIdByElement(target);

        if (!folderId) return;

        const item = game.items.get(folderId);
        await item?.deleteDialog();
    }

    async onDeleteEffect(target: JQuery<HTMLElement>): Promise<void> {
        const folderId = this.#findClosestFolderIdByElement(target);
        const effectId = this.#findClosestEffectIdByElement(target);

        if (!folderId || !effectId) return;

        const effect = game.dfreds.effectInterface.findEffect({
            folderId,
            effectId,
        });

        await effect?.deleteDialog();
    }

    onConfigureFolderOwnership(target: JQuery<HTMLElement>): void {
        const folderId = this.#findClosestFolderIdByElement(target);
        if (!folderId) return;

        const item = game.items.get(folderId);
        if (!item) return;

        const offsetTop = target.offset()?.top;

        // @ts-expect-error Not type defined in pf2e
        new DocumentOwnershipConfig(item, {
            top: Math.min(offsetTop ?? 0, window.innerHeight - 350),
            left: window.innerWidth - 720,
        }).render(true);
    }

    onExportFolder(target: JQuery<HTMLElement>): void {
        const folderId = this.#findClosestFolderIdByElement(target);
        if (!folderId) return;

        const item = game.items.get(folderId);
        item?.exportToJSON();
    }

    // TODO combine existing and new or keep total replace? example in old custom-effects-handler
    async onImportFolder(target: JQuery<HTMLElement>): Promise<void> {
        const folderId = this.#findClosestFolderIdByElement(target);
        if (!folderId) return;

        const item = game.items.get(folderId);
        await item?.importFromJSONDialog();
    }

    /**
     * Handles search text changes
     *
     * @param _event - event that corresponds to the key press
     * @param query - string representation of the entered search text
     * @param rgx - the regex representation of the entered search text
     * @param html - the html the SearchFilter is being applied to
     */
    async onSearchTextChange(
        _event: KeyboardEvent,
        query: string,
        rgx: RegExp,
        html: HTMLElement | null,
    ): Promise<void> {
        const isSearch = !!query;
        let matchingItems: SearchResults = {};
        if (isSearch) {
            matchingItems = await this.#findMatchingItems(rgx);
        }

        if (!html) return;

        const directoryItems = html.querySelectorAll(".directory-item");

        for (const dirItem of directoryItems) {
            const $directoryItem = $(dirItem);
            const isDocument = $directoryItem.hasClass("document");
            const isFolder = $directoryItem.hasClass("folder");

            if (isDocument) {
                const match =
                    isSearch &&
                    matchingItems.effectIds?.has(
                        $directoryItem.data("document-id"),
                    );
                $directoryItem.css(
                    "display",
                    !isSearch || match ? "flex" : "none",
                );
            } else if (isFolder) {
                const match =
                    isSearch &&
                    matchingItems.folderIds?.has(
                        $directoryItem.data("folder-id"),
                    );
                $directoryItem.css(
                    "display",
                    !isSearch || match ? "flex" : "none",
                );

                // Expand folders with matches
                if (match) {
                    $directoryItem.removeClass("collapsed");
                } else {
                    dirItem.classList.toggle(
                        "collapsed",
                        !this.#settings.isFolderExpanded(
                            $directoryItem.data("folder-id"),
                        ),
                    );
                }
            }
        }
    }

    onEffectDragStart(event: DragEvent): void {
        const folderId = this.#findClosestFolderIdByEvent(event);
        const effectId = this.#findClosestEffectIdByEvent(event);

        if (!folderId || !effectId) return;

        const effect = game.dfreds.effectInterface.findEffect({
            folderId,
            effectId,
        });

        if (!effect) return;

        // // special handling for nested effects
        // if (game.dfreds.effectInterface.hasNestedEffects(effect)) {
        //     event.dataTransfer.setData(
        //         "text/plain",
        //         JSON.stringify({
        //             effectName,
        //         }),
        //     );
        //     return;
        // }

        const dragData = effect.toDragData();
        event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));
    }

    async onEffectDrop(event: DragEvent): Promise<void> {
        const effectString = event.dataTransfer?.getData("text/plain");
        const folderId = this.#findClosestFolderIdByEvent(event);

        if (!effectString || !folderId) return;

        const effectData = JSON.parse(effectString);
        const effect = fromUuidSync(effectData.uuid) as ActiveEffect<
            Item<null>
        >;

        const originalItem = game.items.get(effect.parent.id);
        const newItem = game.items.get(folderId);

        if (newItem?.isOwner) {
            await newItem.createEmbeddedDocuments("ActiveEffect", [effect]);

            if (originalItem?.isOwner) {
                await effect.delete();
            } else {
                ui.notifications.warn(
                    `You do not have permission to remove the effect
                    ${effect.name} from ${originalItem?.name}. Duplicated effect
                    onto ${newItem.name}`,
                );
            }
        } else {
            ui.notifications.warn(
                `You do not have permission to add effect ${effect.name} to
                folder ${newItem?.name}`,
            );
        }
    }

    canDragStart(): boolean {
        // TODO remove this?
        return game.user.role >= this.#settings.appControlsPermission;
    }

    /**
     * Remove the collapsed class from all saved, expanded folders
     */
    expandSavedFolders(): void {
        this.#settings.expandedFolders.forEach((folderId) => {
            this.#viewMvc.expandFolder(folderId);
        });
    }

    /**
     * Handles collapsing all folders
     *
     * @param _event - event that corresponds to clicking collapse all
     */
    async onCollapseAll(_event: Event): Promise<void> {
        this.#viewMvc.collapseAllFolders();
        await this.#settings.clearExpandedFolders();
    }

    setPrioritizeTargetsState(): void {
        const prioritizeTargets = this.#settings.prioritizeTargets;
        if (prioritizeTargets) {
            this.#viewMvc.addActivePrioritizeTargets();
        } else {
            this.#viewMvc.removeActivePrioritizeTargets();
        }
    }

    async onPrioritizeTargets(_event: Event): Promise<void> {
        if (this.#viewMvc.isPrioritizeTargetsActive()) {
            this.#viewMvc.removeActivePrioritizeTargets();
            await this.#settings.setPrioritizeTargets(false);
        } else {
            this.#viewMvc.addActivePrioritizeTargets();
            await this.#settings.setPrioritizeTargets(true);
        }
    }

    #findClosestEffectIdByElement(
        element: JQuery<HTMLElement>,
    ): string | undefined {
        return element
            .closest("[data-document-id], .convenient-effect")
            .data("document-id");
    }

    #findClosestEffectIdByEvent(event: Event): string | undefined {
        if (!event.target) return;

        return $(event.target)
            .closest("[data-document-id], .convenient-effect")
            .data("document-id");
    }

    #findClosestFolderIdByElement(
        element: JQuery<HTMLElement>,
    ): string | undefined {
        return element
            .closest("[data-folder-id], .convenient-folder")
            .data("folder-id");
    }

    #findClosestFolderIdByEvent(event: Event): string | undefined {
        if (!event.target) return;

        return $(event.target)
            .closest("[data-folder-id], .convenient-folder")
            .data("folder-id");
    }

    async #findMatchingItems(rgx: RegExp): Promise<SearchResults> {
        const effectIds = new Set<string>();
        const folderIds = new Set<string>();

        const viewData = this.getData();
        for (const data of viewData.folderData) {
            for (const effect of data.effects) {
                if (rgx.test(SearchFilter.cleanQuery(effect.name))) {
                    effectIds.add(effect.id);
                    folderIds.add(data.folder.id);
                }
            }
        }

        return {
            effectIds,
            folderIds,
        };
    }
}

export { ConvenientEffectsController };
