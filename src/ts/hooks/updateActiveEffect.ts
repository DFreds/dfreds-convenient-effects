import { Listener } from "./index.ts";
import { renderConvenientEffectsAppIfOpen } from "../utils/helpers.ts";
import { Flags } from "../utils/flags.ts";

/**
 * Handle re-rendering the app if it is open and an update occurs
 */
const UpdateActiveEffect: Listener = {
    listen(): void {
        Hooks.on(
            "updateActiveEffect",
            (activeEffect: any, _data, _metadata, _userId) => {
                const effect = activeEffect as ActiveEffect<any>;

                if (
                    Flags.isConvenient(effect) &&
                    effect.parent instanceof Item &&
                    Flags.isConvenient(effect.parent)
                ) {
                    renderConvenientEffectsAppIfOpen();
                }
                // const statusesArray = Array.from(effect.statuses ?? []);
                // if (isTemporary) {
                //     statusesArray.unshift(
                //         `convenient-effect-${effect.name}`.slugify(),
                //     );
                // }
                // effect.statuses = statusesArray;
            },
        );
    },
};

export { UpdateActiveEffect };
