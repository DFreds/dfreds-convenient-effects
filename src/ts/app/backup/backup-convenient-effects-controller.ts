import { BackupConvenientEffectsApp } from "./backup-convenient-effects-app.ts";
import {
    findEffectsByFolder,
    findFolder,
    findFolders,
} from "../../utils/finds.ts";

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
    #viewMvc: BackupConvenientEffectsApp;

    /**
     * Initializes the controller and its dependencies
     *
     * @param viewMvc - the app that the controller can interact with
     */
    constructor({ viewMvc }: { viewMvc: BackupConvenientEffectsApp }) {
        this.#viewMvc = viewMvc;
    }

    getData(): ViewData {
        const folders = findFolders({ backup: true });

        const folderData = folders.map((folder) => {
            const viewableEffects = findEffectsByFolder(folder.id, {
                backup: true,
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

    onExportFolder(target: JQuery<HTMLElement>): void {
        const folderId = this.#findClosestFolderIdByElement(target);
        if (!folderId) return;

        const folder = findFolder(folderId, {
            backup: true,
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
                    dirItem.classList.toggle("collapsed", !match);
                }
            }
        }
    }

    onEffectDragStart(event: DragEvent): void {
        const folderId = this.#findClosestFolderIdByEvent(event);
        const effectId = this.#findClosestCeEffectIdByEvent(event);

        if (!folderId || !effectId) return;

        const effect = game.dfreds.effectInterface.findEffect({
            folderId,
            effectId,
            backup: true,
        });

        if (!effect) return;

        const dragData = effect.toDragData();
        event.dataTransfer?.setData("text/plain", JSON.stringify(dragData));
    }

    /**
     * Handles collapsing all folders
     *
     * @param _event - event that corresponds to clicking collapse all
     */
    async onCollapseAll(_event: Event): Promise<void> {
        this.#viewMvc.collapseAllFolders();
    }

    async onResetSystemEffects(_event: Event): Promise<void> {
        return Dialog.confirm({
            title: EN_JSON.ConvenientEffects.ResetSystemEffects,
            content: `<h4>${game.i18n.localize("AreYouSure")}</h4><p>${game.i18n.localize(EN_JSON.ConvenientEffects.ResetSystemEffectsWarning)}</p>`,
            yes: () => {
                game.dfreds.effectInterface.resetSystemInitialization();
            },
            defaultYes: false,
        });
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
