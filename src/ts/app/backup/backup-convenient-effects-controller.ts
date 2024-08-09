import { BackupConvenientEffectsApp } from "./backup-convenient-effects-app.ts";
import {
    findEffectByUuid,
    findEffectsByFolder,
    findFolder,
    findFolders,
} from "../../utils/finds.ts";
import { Flags } from "../../utils/flags.ts";

// TODO shouldn't be able to do a lot of things if backupApp is true

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
class BackupConvenientEffectsController {
    #backupApp: boolean;
    #viewMvc: BackupConvenientEffectsApp;

    /**
     * Initializes the controller and its dependencies
     *
     * @param viewMvc - the app that the controller can interact with
     */
    constructor({ viewMvc }: { viewMvc: BackupConvenientEffectsApp }) {
        this.#backupApp = true;
        this.#viewMvc = viewMvc;
    }

    getData(): ViewData {
        const folders = findFolders({ backup: this.#backupApp });

        const folderData = folders.map((folder) => {
            const viewableEffects = findEffectsByFolder(folder.id, {
                backup: this.#backupApp,
            });

            return {
                folder,
                effects: viewableEffects,
            };
        });

        return {
            folderData,
        };
    }

    isUserGm(_target: JQuery<HTMLElement>): boolean {
        return game.user.isGM;
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
    }

    /**
     * Handles clicks on effect items by toggling them on or off on selected tokens
     *
     * @param event - event that corresponds to clicking an effect item
     */
    async onToggleEffect(event: Event): Promise<void> {
        const effectId = this.#findClosestCeEffectIdByEvent(event);

        if (!effectId) return;

        // TODO
        // await game.dfreds.effectInterface.toggleEffect({
        //     effectId,
        //     prioritizeTargets: this.#settings.prioritizeTargets,
        // });
    }

    async onToggleOverlay(target: JQuery<HTMLElement>): Promise<void> {
        const effectId = this.#findClosestCeEffectIdByElement(target);

        if (!effectId) return;

        // TODO
        // await game.dfreds.effectInterface.toggleEffect({
        //     effectId,
        //     overlay: true,
        //     prioritizeTargets: this.#settings.prioritizeTargets,
        // });
    }

    onExportFolder(target: JQuery<HTMLElement>): void {
        const folderId = this.#findClosestFolderIdByElement(target);
        if (!folderId) return;

        const folder = findFolder(folderId, {
            backup: this.#backupApp,
        });
        folder?.exportToJSON();
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
                    dirItem.classList.toggle("collapsed"); // TODO
                }
            }
        }
    }

    // TODO
    onEffectDragStart(event: DragEvent): void {
        const folderId = this.#findClosestFolderIdByEvent(event);
        const effectId = this.#findClosestCeEffectIdByEvent(event);

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

    // TODO
    async onEffectDrop(event: DragEvent): Promise<void> {
        const effectString = event.dataTransfer?.getData("text/plain");
        const folderId = this.#findClosestFolderIdByEvent(event);

        if (!effectString || !folderId) return;

        const effectData = JSON.parse(effectString);
        const effect = await findEffectByUuid(effectData.uuid);

        if (!effect) return;

        const originalFolder = findFolder(effect.parent.id, {
            backup: this.#backupApp,
        });
        const newFolder = findFolder(folderId, {
            backup: this.#backupApp,
        });

        if (newFolder?.isOwner) {
            await newFolder.createEmbeddedDocuments("ActiveEffect", [effect]);

            if (originalFolder?.isOwner) {
                await effect.delete();
            } else {
                ui.notifications.warn(
                    `You do not have permission to remove the effect
                    ${effect.name} from ${originalFolder?.name}. Duplicated effect
                    onto ${newFolder.name}`,
                );
            }
        } else {
            ui.notifications.warn(
                `You do not have permission to add effect ${effect.name} to
                folder ${newFolder?.name}`,
            );
        }
    }

    /**
     * Handles collapsing all folders
     *
     * @param _event - event that corresponds to clicking collapse all
     */
    async onCollapseAll(_event: Event): Promise<void> {
        this.#viewMvc.collapseAllFolders();
    }

    #findClosestCeEffectIdByElement(
        element: JQuery<HTMLElement>,
    ): string | undefined {
        return element
            .closest("[data-ce-effect-id], .convenient-effect")
            .data("ce-effect-id");
    }

    #findClosestCeEffectIdByEvent(event: Event): string | undefined {
        if (!event.target) return;

        return $(event.target)
            .closest("[data-ce-effect-id], .convenient-effect")
            .data("ce-effect-id");
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

export { BackupConvenientEffectsController };
