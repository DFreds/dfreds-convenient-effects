import { id as MODULE_ID } from "@static/module.json";
import { Listener } from "./index.ts";

/**
 * Handle creating the Item that will hold the effects
 */
const Ready: Listener = {
    listen(): void {
        Hooks.once("ready", async () => {
            // TODO anything else here?

            Hooks.callAll(`${MODULE_ID}.createEffects`);
        });
    },
};

export { Ready };
