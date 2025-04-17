import { Listener } from "./index.ts";
import { EffectInterfaceImpl } from "../effect-interface.ts";
import { MODULE_ID } from "../constants.ts";

/**
 * Handle creating the Item that will hold the effects
 */
const Ready: Listener = {
    listen(): void {
        Hooks.once("ready", async () => {
            Hooks.callAll(`${MODULE_ID}.createEffects`);
        });
    },
};

export { Ready };
