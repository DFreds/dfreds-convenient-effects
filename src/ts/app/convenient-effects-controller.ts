import { ConvenientEffectsApp } from "./convenient-effects-app.ts";
import { Settings } from "../settings.ts";
import { findEffectFolderItems } from "../helpers.ts";

interface ViewData {
    folders: Item<any>[];
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
        // TODO do we still do favorites?

        return {
            folders: findEffectFolderItems(),
        };
    }

    onSearchTextChange(
        _event: KeyboardEvent,
        _query: string,
        _rgx: RegExp,
        _html: HTMLElement | null,
    ): void {
        // const isSearch = !!query;
        // let matchingItems = {};
        // if (isSearch) {
        //     matchingItems = this._getMatchingItems(rgx);
        // }
        // for (let el of html.querySelectorAll(".directory-item")) {
        //     let isEntity = el.classList.contains("entity");
        //     let isFolder = el.classList.contains("folder");
        //     if (isEntity) {
        //         let match =
        //             isSearch &&
        //             matchingItems.effectNames.has(el.dataset.effectName);
        //         el.style.display = !isSearch || match ? "flex" : "none";
        //     } else if (isFolder) {
        //         let match =
        //             isSearch &&
        //             matchingItems.folderIds.has(el.dataset.folderId);
        //         el.style.display = !isSearch || match ? "flex" : "none";
        //         // Expand folders with matches
        //         if (match) el.classList.remove("collapsed");
        //         else
        //             el.classList.toggle(
        //                 "collapsed",
        //                 !this._settings.isFolderExpanded(el.dataset.folderId),
        //             );
        //     }
        // }
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
}

export { ConvenientEffectsController };
