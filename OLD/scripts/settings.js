import Constants from "./constants.js";

/**
 * Handle setting and fetching all settings in the module
 */
export default class Settings {
    // Config setting keys
    static PRIORITIZE_TARGETS = "prioritizeTargets";
    static SHOW_NESTED_EFFECTS = "showNestedEffects";

    // Non-config setting keys

    /**
     * Register all the settings for the module
     */
    registerSettings() {
        this._registerConfigSettings();
    }

    _registerConfigSettings() {
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
}
