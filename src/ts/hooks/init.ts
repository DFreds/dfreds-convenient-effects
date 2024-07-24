import { DEBUG } from "../constants.ts";
import { HandlebarHelpers } from "../handlebar-helpers.ts";
import { Settings } from "../settings.ts";
import { activateSocketListener } from "../sockets/socket.ts";
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
            activateSocketListener();
            // new TextEnrichers().initialize(); // TODO
        });
    },
};

export { Init };
