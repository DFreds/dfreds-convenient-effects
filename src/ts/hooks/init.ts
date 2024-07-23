import { DEBUG } from "../constants.ts";
import { HandlebarHelpers } from "../handlebar-helpers.ts";
import { Settings } from "../settings.ts";
import { Listener } from "./index.ts";

/**
 * Initialize the settings, handlebar helpers, and text enrichers
 */
const Init: Listener = {
    listen(): void {
        Hooks.once("init", () => {
            CONFIG.debug.hooks = DEBUG;
            new Settings().register();
            new HandlebarHelpers().register();
            // new TextEnrichers().initialize(); // TODO
        });
    },
};

export { Init };
