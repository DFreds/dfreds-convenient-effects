import { MODULE_ID } from "./constants.ts";

class Settings {
    #USER_ROLES: Record<number, string> = {};

    // Config keys
    #APP_CONTROLS_PERMISSION = "appControlsPermission";
    #CREATE_FOLDERS_PERMISSION = "createFoldersPermission";

    // Non-config keys
    #EXPANDED_FOLDERS = "expandedFolders";
    #SHOW_HIDDEN_EFFECTS = "showHiddenEffects";
    #SHOW_NESTED_EFFECTS = "showNestedEffects";
    #HAS_INITIALIZED = "hasInitialized";
    #PRIORITIZE_TARGETS = "prioritizeTargets";

    constructor() {
        this.#USER_ROLES[CONST.USER_ROLES.PLAYER] = game.i18n.localize(
            "ConvenientEffects.Setting.Player",
        );
        this.#USER_ROLES[CONST.USER_ROLES.TRUSTED] = game.i18n.localize(
            "ConvenientEffects.Setting.TrustedPlayer",
        );
        this.#USER_ROLES[CONST.USER_ROLES.ASSISTANT] = game.i18n.localize(
            "ConvenientEffects.Setting.AssistantGM",
        );
        this.#USER_ROLES[CONST.USER_ROLES.GAMEMASTER] = game.i18n.localize(
            "ConvenientEffects.Setting.GameMaster",
        );
        this.#USER_ROLES[5] = game.i18n.localize(
            "ConvenientEffects.Setting.None",
        );
    }

    register(): void {
        this.#registerConfigSettings();
        this.#registerNonConfigSettings();
    }

    #registerConfigSettings(): void {
        this.#registerAppControlsPermission();
        this.#registerCreateFoldersPermission();
    }

    #registerNonConfigSettings(): void {
        this.#registerExpandedFolders();
        this.#registerShowHiddenEffects();
        this.#registerShowNestedEffects();
        this.#registerPrioritizeTargets();
        this.#registerHasInitialized();
    }

    #registerAppControlsPermission(): void {
        game.settings.register(MODULE_ID, this.#APP_CONTROLS_PERMISSION, {
            name: "ConvenientEffects.Setting.AppControlsPermissionName",
            hint: "ConvenientEffects.Setting.AppControlsPermissionHint",
            scope: "world",
            config: true,
            default: CONST.USER_ROLES.GAMEMASTER,
            choices: this.#USER_ROLES,
            type: String,
            requiresReload: true,
        });
    }

    #registerCreateFoldersPermission(): void {
        game.settings.register(MODULE_ID, this.#CREATE_FOLDERS_PERMISSION, {
            name: "ConvenientEffects.Setting.CreateFoldersPermissionName",
            hint: "ConvenientEffects.Setting.CreateFoldersPermissionHint",
            scope: "world",
            config: true,
            default: CONST.USER_ROLES.GAMEMASTER,
            choices: this.#USER_ROLES,
            type: String,
            requiresReload: false,
        });
    }

    #registerExpandedFolders(): void {
        game.settings.register(MODULE_ID, this.#EXPANDED_FOLDERS, {
            name: "Expanded Folders",
            scope: "client",
            config: false,
            default: [],
            type: Array,
        });
    }

    #registerShowHiddenEffects(): void {
        game.settings.register(MODULE_ID, this.#SHOW_HIDDEN_EFFECTS, {
            name: "Show Hidden Effects",
            scope: "client",
            config: false,
            default: false,
            type: Boolean,
        });
    }

    #registerShowNestedEffects(): void {
        game.settings.register(MODULE_ID, this.#SHOW_NESTED_EFFECTS, {
            name: "Show Nested Effects",
            scope: "client",
            config: false,
            default: false,
            type: Boolean,
        });
    }

    #registerPrioritizeTargets(): void {
        game.settings.register(MODULE_ID, this.#PRIORITIZE_TARGETS, {
            name: "Prioritize Targets",
            scope: "client",
            config: false,
            default: false,
            type: Boolean,
        });
    }

    #registerHasInitialized(): void {
        game.settings.register(MODULE_ID, this.#HAS_INITIALIZED, {
            name: "Has Initialized",
            scope: "world",
            config: false,
            default: false,
            type: Boolean,
        });
    }

    get appControlsPermission(): number {
        return game.settings.get(
            MODULE_ID,
            this.#APP_CONTROLS_PERMISSION,
        ) as unknown as number;
    }

    get createFoldersPermission(): number {
        return game.settings.get(
            MODULE_ID,
            this.#CREATE_FOLDERS_PERMISSION,
        ) as unknown as number;
    }

    /**
     * Returns the game setting for the saved expanded folder names
     *
     * @returns the IDs of all of the saved expanded folders
     */
    get expandedFolders(): string[] {
        return game.settings.get(MODULE_ID, this.#EXPANDED_FOLDERS) as unknown as string[];
    }

    /**
     * Adds a given folder ID to the saved expanded folders
     *
     * @param id - the ID of the folder to add to the saved expanded folders
     * @returns a promise that resolves when the settings update is complete
     */
    async addExpandedFolder(id: string): Promise<unknown> {
        let expandedFolderArray = this.expandedFolders;
        expandedFolderArray.push(id);

        expandedFolderArray = [...new Set(expandedFolderArray)]; // remove duplicates

        return game.settings.set(
            MODULE_ID,
            this.#EXPANDED_FOLDERS,
            expandedFolderArray,
        );
    }

    /**
     * Removes a given folder name from the saved expanded folders
     *
     * @param id - the ID of the folder to remove from the saved expanded folders
     * @returns a promise that resolves when the settings update is complete
     */
    async removeExpandedFolder(id: string): Promise<unknown> {
        const expandedFolderArray = this.expandedFolders.filter(
            (expandedFolder) => expandedFolder !== id,
        );
        return game.settings.set(
            MODULE_ID,
            this.#EXPANDED_FOLDERS,
            expandedFolderArray,
        );
    }

    /**
     * Removes all saved expanded folders
     *
     * @returns a promise that resolves when the settings update is complete
     */
    async clearExpandedFolders(): Promise<unknown> {
        return game.settings.set(MODULE_ID, this.#EXPANDED_FOLDERS, []);
    }

    /**
     * Checks if the given folder name is expanded
     *
     * @param id - the folder ID to search for
     * @returns true if the folder is in the saved expanded folders, false otherwise
     */
    isFolderExpanded(id: string): boolean {
        return this.expandedFolders.includes(id);
    }

    get showHiddenEffects(): boolean {
        return game.settings.get(
            MODULE_ID,
            this.#SHOW_HIDDEN_EFFECTS,
        ) as unknown as boolean;
    }

    async setShowHiddenEffects(value: boolean): Promise<unknown> {
        return game.settings.set(MODULE_ID, this.#SHOW_HIDDEN_EFFECTS, value);
    }

    get showNestedEffects(): boolean {
        return game.settings.get(
            MODULE_ID,
            this.#SHOW_NESTED_EFFECTS,
        ) as unknown as boolean;
    }

    async setShowNestedEffects(value: boolean): Promise<unknown> {
        return game.settings.set(MODULE_ID, this.#SHOW_NESTED_EFFECTS, value);
    }

    get prioritizeTargets(): boolean {
        return game.settings.get(
            MODULE_ID,
            this.#PRIORITIZE_TARGETS,
        ) as unknown as boolean;
    }

    async setPrioritizeTargets(value: boolean): Promise<unknown> {
        return game.settings.set(MODULE_ID, this.#PRIORITIZE_TARGETS, value);
    }

    get hasInitialized(): boolean {
        return game.settings.get(MODULE_ID, this.#HAS_INITIALIZED) as unknown as boolean;
    }

    async setHasInitialized(value: boolean): Promise<unknown> {
        return game.settings.set(MODULE_ID, this.#HAS_INITIALIZED, value);
    }
}

export { Settings };
