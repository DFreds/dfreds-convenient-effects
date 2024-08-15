import { DEBUG } from "../constants.ts";
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
            CONFIG.debug.hooks = DEBUG;
            new Settings().register();
            new HandlebarHelpers().register();
            new Keybindings().register();
        });
    },
};

export { Init };
