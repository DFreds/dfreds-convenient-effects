import { renderConvenientEffectsAppIfOpen } from "../helpers.ts";
import { Settings } from "../settings.ts";
import { Listener } from "./index.ts";

/**
 * Re-renders the convenient effects app if a convenient effect is created
 */
const CreateActiveEffect: Listener = {
    listen(): void {
        Hooks.on("createActiveEffect", (activeEffect: any, _config, userId) => {
            if (game.user.id !== userId) return;

            const effect = activeEffect as ActiveEffect<any>;
            const settings = new Settings();
            if (settings.effectItemIds?.includes(effect.parent.id)) {
                renderConvenientEffectsAppIfOpen();
            }
        });
    },
};

export { CreateActiveEffect };
