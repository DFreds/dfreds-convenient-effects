import { id as MODULE_ID } from "@static/module.json";
import { Listener } from "./index.ts";
import { activateSocketListener } from "../sockets/socket.ts";
import { EffectInterface } from "../effect-interface.ts";

/**
 * Handle creating the Item that will hold the effects
 */
const Ready: Listener = {
    listen(): void {
        Hooks.once("ready", async () => {
            game.dfreds = {
                effectInterface: new EffectInterface(),
            };

            activateSocketListener();

            Hooks.callAll(`${MODULE_ID}.createEffects`);
        });
    },
};

export { Ready };
