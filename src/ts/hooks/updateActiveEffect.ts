import { Listener } from "./index.ts";
import {
    isItemConvenient,
    renderConvenientEffectsAppIfOpen,
} from "../helpers.ts";

/**
 * Handle re-rendering the app if it is open and an update occurs
 */
const UpdateActiveEffect: Listener = {
    listen(): void {
        Hooks.on(
            "updateActiveEffect",
            (activeEffect: any, _data, _metadata, userId) => {
                if (game.user.id !== userId) return;

                const effect = activeEffect as ActiveEffect<any>;
                const parent = effect.parent;

                // TODO why parent and not just effect?
                if (parent instanceof Item && isItemConvenient(parent)) {
                    renderConvenientEffectsAppIfOpen();
                }
            },
        );
    },
};

export { UpdateActiveEffect };
