import { renderAppIfOpen } from "../ui/render-app-if-open.ts";
import { Flags } from "../utils/flags.ts";
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

                if (
                    Flags.isConvenient(effect) &&
                    effect.parent instanceof Item &&
                    Flags.isConvenient(effect.parent)
                ) {
                    renderAppIfOpen();
                }
            },
        );
    },
};

export { CreateActiveEffect };
