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

interface FolderResolve {
    data: {
        name: string;
        color: string;
    };
    operation: "create" | "update" | "close";
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
        const result = await this.#getInputFromDialog({});

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
        const effect = item?.effects.get(effectId) as ActiveEffect<Item<null>>;

        const effects = await item?.createEmbeddedDocuments("ActiveEffect", [
            effect,
        ]);

        if (!effects) return;

        (effects[0] as ActiveEffect<Item<null>>).sheet.render(true);
    }

    // TODO do we display the folder config menu? like editing color and name only
    async onEditFolder(target: JQuery<HTMLElement>): Promise<void> {
        const folderId = this.#findClosestFolderIdByElement(target);
        if (!folderId) return;

        const folder = game.items.get(folderId);
        if (!folder) return;

        const result = await this.#getInputFromDialog({ folder });

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

    async onEditEffect(target: JQuery<HTMLElement>): Promise<void> {
        const folderId = this.#findClosestFolderIdByElement(target);
        const effectId = this.#findClosestEffectIdByElement(target);

        if (!folderId || !effectId) return;

        const item = game.items.get(folderId);
        const effect = item?.effects.get(effectId) as ActiveEffect<Item<null>>;

        effect?.sheet.render(true);
    }

    // TODO confirm?
    async onDeleteAllFolder(target: JQuery<HTMLElement>): Promise<void> {
        log(target);
    }

    async onDeleteEffect(target: JQuery<HTMLElement>): Promise<void> {
        const folderId = this.#findClosestFolderIdByElement(target);
        const effectId = this.#findClosestEffectIdByElement(target);

        if (!folderId || !effectId) return;

        const item = game.items.get(folderId);
        await item?.deleteEmbeddedDocuments("ActiveEffect", [effectId]);
    }

    // TODO
    hasBackup(): boolean {
        return true;
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

    async #getInputFromDialog({
        folder,
    }: {
        folder?: Item<null> | null;
    }): Promise<FolderResolve> {
        const safeColor = folder?.id
            ? (folder.getFlag(MODULE_ID, FLAGS.FOLDER_COLOR) as string)
            : "#000000";
        const color = folder?.id
            ? (folder.getFlag(MODULE_ID, FLAGS.FOLDER_COLOR) as string)
            : "";
        const content = await renderTemplate(
            "modules/dfreds-convenient-effects/templates/folder-edit.hbs",
            {
                name: folder?.id ? folder.name : "",
                safeColor,
                color,
                newName: "Folder",
            },
        );

        return new Promise((resolve, _reject) => {
            const dialog = this.#getFolderDialog({
                resolve,
                folder,
                content,
            });
            dialog.render(true);
        });
    }

    #getFolderDialog({
        resolve,
        folder,
        content,
    }: {
        resolve: (value: FolderResolve | PromiseLike<FolderResolve>) => void;
        folder?: Item<null> | null;
        content: string;
    }): Dialog {
        return new Dialog(
            {
                title: folder?.id
                    ? `${game.i18n.localize("FOLDER.Update")}: ${folder.name}`
                    : game.i18n.localize("FOLDER.Create"),
                content,
                close: (_html) => {
                    resolve({
                        operation: "close",
                        data: {
                            name: "",
                            color: "",
                        },
                    });
                },
                default: "ok",
                buttons: {
                    ok: {
                        label: game.i18n.localize(
                            folder?.id ? "FOLDER.Update" : "FOLDER.Create",
                        ),
                        icon: '<i class="fas fa-check"></i>',
                        callback: (html) => {
                            log(html);
                            const folderName = html
                                .find("input[name=name]")
                                .val() as string;
                            const color = html
                                .find("color-picker")
                                .val() as string;

                            resolve({
                                data: {
                                    name: folderName || "Folder",
                                    color: color || "#FFFFFF",
                                },
                                operation: folder?.id ? "update" : "create",
                            });
                        },
                    },
                },
            },
            {
                //     classes: ["sheet", "folder-edit"],
                width: 360,
            },
        );
    }
}

export { ConvenientEffectsController };
