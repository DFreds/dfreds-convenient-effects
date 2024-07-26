import {
    isItemConvenient,
    renderConvenientEffectsAppIfOpen,
} from "../helpers.ts";
import { Listener } from "./index.ts";

/**
 * Re-renders the convenient effects app if a convenient effect is created
 */
const CreateActiveEffect: Listener = {
    listen(): void {
        Hooks.on(
            "createActiveEffect",
            (activeEffect: any, _metadata, userId) => {
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

export { CreateActiveEffect };
