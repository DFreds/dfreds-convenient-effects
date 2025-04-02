import { Listener } from "./index.ts";
import { Flags } from "../utils/flags.ts";
import { renderAppIfOpen } from "../ui/render-app-if-open.ts";

/**
 * Handle re-rendering the app if it is open and an update occurs
 */
const UpdateActiveEffect: Listener = {
    listen(): void {
        Hooks.on(
            "updateActiveEffect",
            (activeEffect: any, _data, _metadata, _userId) => {
                const effect = activeEffect as ActiveEffect<any>;

                const isConvenient =
                    Flags.isConvenient(effect) &&
                    effect.parent instanceof Item &&
                    Flags.isConvenient(effect.parent);

                if (isConvenient) {
                    renderAppIfOpen();
                }
            },
        );
    },
};

export { UpdateActiveEffect };
