import {
    isEffectConvenient,
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
            (activeEffect: any, _metadata, _userId) => {
                const effect = activeEffect as ActiveEffect<any>;

                if (!isEffectConvenient(effect)) return;

                renderConvenientEffectsAppIfOpen();
            },
        );
    },
};

export { CreateActiveEffect };
