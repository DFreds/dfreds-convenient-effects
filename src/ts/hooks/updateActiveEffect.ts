import { Listener } from "./index.ts";
import { Settings } from "../settings.ts";
import { renderConvenientEffectsAppIfOpen } from "../helpers.ts";

/**
 * Handle re-rendering the app if it is open and an update occurs
 */
const UpdateActiveEffect: Listener = {
    listen(): void {
        Hooks.on("updateActiveEffect", (activeEffect: any, _config, userId) => {
            if (game.user.id !== userId) return;

            const effect = activeEffect as ActiveEffect<any>;
            const settings = new Settings();
            if (settings.effectItemIds?.includes(effect.parent.id)) {
                // TODO Below??
                // const effectHelpers = new EffectHelpers();
                // effectHelpers.updateStatusId(activeEffect);
                renderConvenientEffectsAppIfOpen();
            }
        });
    },
};

export { UpdateActiveEffect };
