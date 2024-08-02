import Constants from "./constants.js";

/**
 * Handle setting and fetching all settings in the module
 */
export default class Settings {
    // Config setting keys
    static SHOW_NESTED_EFFECTS = "showNestedEffects";

    // Non-config setting keys

    /**
     * Register all the settings for the module
     */
    registerSettings() {
        this._registerConfigSettings();
    }

    _registerConfigSettings() {
        // TODO port over
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
}
