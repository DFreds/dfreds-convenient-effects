import { HandlebarHelpers } from "../ui/handlebar-helpers.ts";
import { Listener } from "./index.ts";
import { Settings } from "../settings.ts";
import { Keybindings } from "../keybindings.ts";

/**
 * Initialize the settings, handlebar helpers, and text enrichers
 */
const Init: Listener = {
    listen(): void {
        Hooks.once("init", () => {
            if (BUILD_MODE === "development") {
                CONFIG.debug.hooks = true;
            }
            new Settings().register();
            new HandlebarHelpers().register();
            new Keybindings().register();
        });
    },
};

export { Init };
