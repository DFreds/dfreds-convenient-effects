import { id as MODULE_ID } from "@static/module.json";
import { Listener } from "./index.ts";
import { activateSocketListener } from "../sockets/socket.ts";

/**
 * Handle creating the Item that will hold the effects
 */
const Ready: Listener = {
    listen(): void {
        Hooks.once("ready", async () => {
            activateSocketListener();

            Hooks.callAll(`${MODULE_ID}.createEffects`);
        });
    },
};

export { Ready };
