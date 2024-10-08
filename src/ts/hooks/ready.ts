import { id as MODULE_ID } from "@static/module.json";
import { Listener } from "./index.ts";
import { EffectInterface } from "../effect-interface.ts";

/**
 * Handle creating the Item that will hold the effects
 */
const Ready: Listener = {
    listen(): void {
        Hooks.once("ready", async () => {
            game.dfreds = game.dfreds || {};
            game.dfreds.effectInterface = new EffectInterface();
            Hooks.callAll(`${MODULE_ID}.createEffects`);
        });
    },
};

export { Ready };
