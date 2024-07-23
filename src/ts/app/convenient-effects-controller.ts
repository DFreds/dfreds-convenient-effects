import { ConvenientEffectsApp } from "./convenient-effects-app.ts";
import { Settings } from "../settings.ts";
import { findEffectFolderItems } from "../helpers.ts";

interface ViewData {
    folders: Item<any>[];
}

interface SearchResults {
    effectIds?: Set<string>;
    folderIds?: Set<string>;
}

class ConvenientEffectsController {
    #viewMvc: ConvenientEffectsApp;
    #settings: Settings;

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
    async onCollapseAllClick(_event: Event): Promise<void> {
        this.#viewMvc.collapseAllFolders();
        await this.#settings.clearExpandedFolders();
    }

    /**
     * Handles clicks on folders by collapsing or expanding them
     *
     * @param event - event that corresponds to clicking on the folder
     */
    async onFolderClick(event: Event): Promise<void> {
        if (event.currentTarget === null) return;
        const $target = $(event.currentTarget);
        const parent = $target.parent();
        const folderId = parent.data("folder-id");

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
