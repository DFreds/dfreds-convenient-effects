import { id as MODULE_ID } from "@static/module.json";
import { ConvenientEffectsApp } from "./convenient-effects-app.ts";
import { Settings } from "../settings.ts";
import {
    createConvenientEffect,
    createConvenientItem,
    findEffectFolderItems,
} from "../helpers.ts";
import { log } from "../logger.ts";
import { FLAGS } from "../constants.ts";
import { ItemFlags } from "types/foundry/common/documents/item.js";
import { getInputFromDialog } from "../ui/create-edit-folder-dialog.ts";

interface ViewData {
    /**
     * The items that contain the effects
     */
    folders: Item<null>[];
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

    async getData(): Promise<ViewData> {
        // TODO don't show nested effects
        return {
            folders: findEffectFolderItems(),
        };
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
        const effectName = this.#findClosestEffectNameByEvent(event);

        if (!effectName) return;

        await game.dfreds.effectInterface.toggleEffect({ effectName });
    }

    async onToggleOverlay(target: JQuery<HTMLElement>): Promise<void> {
        const effectName = this.#findClosestEffectNameByElement(target);

        if (!effectName) return;

        await game.dfreds.effectInterface.toggleEffect({
            effectName,
            overlay: true,
        });
    }

    async onCreateFolder(_event: Event): Promise<void> {
        const result = await getInputFromDialog({});

        if (result.operation === "create") {
            const flags: DeepPartial<ItemFlags> = {};
            flags[MODULE_ID] = {};
            flags[MODULE_ID]![FLAGS.FOLDER_COLOR] = result.data.color;

            const item = await Item.create(
                createConvenientItem({
                    item: {
                        name: result.data.name,
                        type: CONFIG.Item.typeLabels[0] ?? "consumable", // TODO when undefined... do what?
                        flags,
                    },
                }),
            );

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
                name: "New Effect", // TODO localize
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
            await folder.setFlag(
                MODULE_ID,
                FLAGS.FOLDER_COLOR,
                result.data.color,
            );
            await folder.update({
                name: result.data.name,
            });

            log(`Updated item ${folder.id}`);
        }
    }

    // TODO import/export items and folder

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

    // TODO separate this into various permissions
    get canUserModifyEffects(): boolean {
        return true;
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
        const effectId = this.#findClosestEffectIdByEvent(event);
        const effect = game.dfreds.effectInterface.findEffect({ effectId });

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

    canDragStart(): boolean {
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

    #findClosestEffectIdByElement(
        element: JQuery<HTMLElement>,
    ): string | undefined {
        return element
            .closest("[data-document-id], .convenient-effect")
            .data("document-id");
    }

    #findClosestEffectNameByElement(
        element: JQuery<HTMLElement>,
    ): string | undefined {
        return element
            .closest("[data-document-name], .convenient-effect")
            .data("document-name");
    }

    #findClosestEffectIdByEvent(event: Event): string | undefined {
        if (!event.target) return;

        return $(event.target)
            .closest("[data-document-id], .convenient-effect")
            .data("document-id");
    }

    #findClosestEffectNameByEvent(event: Event): string | undefined {
        if (!event.target) return;

        return $(event.target)
            .closest("[data-document-name], .convenient-effect")
            .data("document-name");
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

        const data = await this.getData();
        for (const folder of data.folders) {
            for (const effect of folder.effects) {
                if (rgx.test(SearchFilter.cleanQuery(effect.name))) {
                    effectIds.add(effect.id);
                    folderIds.add(folder.id);
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
