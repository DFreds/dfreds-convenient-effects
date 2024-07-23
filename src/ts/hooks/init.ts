import { HandlebarHelpers } from "../handlebar-helpers.ts";
import { Settings } from "../settings.ts";
import { Listener } from "./index.ts";

/**
 * Initialize the settings, handlebar helpers, and text enrichers
 */
const Init: Listener = {
    listen(): void {
        Hooks.once("init", () => {
            new Settings().register();
            new HandlebarHelpers().register();
            // new TextEnrichers().initialize(); // TODO
        });
    },
};

export { Init };
