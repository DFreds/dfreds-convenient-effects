import Constants from "./constants.js";

/**
 * Handle setting and fetching all settings in the module
 */
export default class Settings {
    // Config setting keys
    static ALLOW_PLAYER_CUSTOM_EFFECTS = "allowPlayerCustomEffects";
    static APP_CONTROLS_PERMISSION = "controlsPermission";
    static INTEGRATE_WITH_ATE = "integrateWithAtl";
    static INTEGRATE_WITH_TOKEN_MAGIC = "integrateWithTokenMagic";
    static PRIORITIZE_TARGETS = "prioritizeTargets";
    static SHOW_NESTED_EFFECTS = "showNestedEffects";

    // Non-config setting keys
    static CUSTOM_EFFECTS_ITEM_ID = "customEffectsItemId";
    static EXPANDED_FOLDERS = "expandedFolders";

    /**
     * Register all the settings for the module
     */
    registerSettings() {
        this._registerConfigSettings();
        this._registerNonConfigSettings();
    }

    _registerConfigSettings() {
        const userRoles = {};
        userRoles[CONST.USER_ROLES.PLAYER] = "Player";
        userRoles[CONST.USER_ROLES.TRUSTED] = "Trusted Player";
        userRoles[CONST.USER_ROLES.ASSISTANT] = "Assistant GM";
        userRoles[CONST.USER_ROLES.GAMEMASTER] = "Game Master";
        userRoles[5] = "None";

        game.settings.register(
            Constants.MODULE_ID,
            Settings.ALLOW_PLAYER_CUSTOM_EFFECTS,
            {
                name: "Allow Player Custom Effects",
                hint: "If enabled, players will be allowed to create, duplicate, edit, and delete all custom effects.",
                scope: "world",
                config: true,
                default: false,
                type: Boolean,
                onChange: async (value) => {
                    const customEffectsItem =
                        await this._findCustomEffectsItem();

                    if (!customEffectsItem) return;

                    let newOwnership = duplicate(customEffectsItem.ownership);
                    newOwnership.default = value ? 3 : 0;
                    await customEffectsItem.update({ ownership: newOwnership });
                },
            },
        );

        game.settings.register(
            Constants.MODULE_ID,
            Settings.INTEGRATE_WITH_ATE,
            {
                name: "Integrate with ATE",
                hint: "If enabled, certain effects will also change light emitted from tokens or the size of a token via Active Token Effects.",
                scope: "world",
                config: true,
                default: true,
                type: Boolean,
            },
        );

        game.settings.register(
            Constants.MODULE_ID,
            Settings.INTEGRATE_WITH_TOKEN_MAGIC,
            {
                name: "Integrate with Token Magic",
                hint: "If enabled, certain effects will also apply a token magic filter to tokens via Token Magic.",
                scope: "world",
                config: true,
                default: true,
                type: Boolean,
            },
        );

        game.settings.register(
            Constants.MODULE_ID,
            Settings.PRIORITIZE_TARGETS,
            {
                name: "Prioritize Targets",
                hint: "If enabled, effects will be applied to any targeted tokens instead of selected tokens.",
                scope: "client",
                config: true,
                default: false,
                type: Boolean,
            },
        );

        game.settings.register(
            Constants.MODULE_ID,
            Settings.SHOW_NESTED_EFFECTS,
            {
                name: "Show Nested Effects",
                hint: "If enabled, nested effects will be shown in the application.",
                scope: "client",
                config: true,
                default: false,
                type: Boolean,
            },
        );
    }

    _registerNonConfigSettings() {
        game.settings.register(
            Constants.MODULE_ID,
            Settings.CUSTOM_EFFECTS_ITEM_ID,
            {
                name: "Custom Effects Item ID",
                scope: "world",
                config: false,
                default: "",
                type: String,
            },
        );
    }

    /**
     * Returns the game setting for allowing players to manipulate custom effects.
     *
     * @returns {boolean} true if players can manipulate custom effects
     */
    get allowPlayerCustomEffects() {
        return game.settings.get(
            Constants.MODULE_ID,
            Settings.ALLOW_PLAYER_CUSTOM_EFFECTS,
        );
    }

    /**
     * Returns the game setting for integrating with ATE
     *
     * @returns {boolean} true if integration with ATE is enabled
     */
    get integrateWithAte() {
        return game.settings.get(
            Constants.MODULE_ID,
            Settings.INTEGRATE_WITH_ATE,
        );
    }

    /**
     * Returns the game setting for integrating with Token Magic
     *
     * @returns {boolean} true if integration with Token Magic is enabled
     */
    get integrateWithTokenMagic() {
        return game.settings.get(
            Constants.MODULE_ID,
            Settings.INTEGRATE_WITH_TOKEN_MAGIC,
        );
    }

    /**
     * Returns the game setting for prioritizing targets
     *
     * @returns {boolean} true if targets should take first priority
     */
    get prioritizeTargets() {
        return game.settings.get(
            Constants.MODULE_ID,
            Settings.PRIORITIZE_TARGETS,
        );
    }

    /**
     * Returns the game setting for showing nested effects
     *
     * @returns {boolean} true if nested effects should be shown
     */
    get showNestedEffects() {
        return game.settings.get(
            Constants.MODULE_ID,
            Settings.SHOW_NESTED_EFFECTS,
        );
    }

    /**
     * Returns the game setting for the custom effects item ID
     *
     * @returns {string} the ID of the custom effects item
     */
    get customEffectsItemId() {
        return game.settings.get(
            Constants.MODULE_ID,
            Settings.CUSTOM_EFFECTS_ITEM_ID,
        );
    }

    /**
     * Sets the custom effects item ID
     *
     * @param {string} id - the ID of the custom effects item
     * @returns {Promise} a promise that resolves when the settings update is complete
     */
    async setCustomEffectsItemId(id) {
        return game.settings.set(
            Constants.MODULE_ID,
            Settings.CUSTOM_EFFECTS_ITEM_ID,
            id,
        );
    }

    _findCustomEffectsItem() {
        return game.items.get(this.customEffectsItemId);
    }
}
