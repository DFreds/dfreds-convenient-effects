import { renderConvenientEffectsAppIfOpen } from "../helpers.ts";
import { Flags } from "../utils/flags.ts";
import { Listener } from "./index.ts";

const CloseActiveEffectConfig: Listener = {
    listen(): void {
        Hooks.on(
            "closeActiveEffectConfig",
            (activeEffectConfig: any, _html) => {
                const config = activeEffectConfig as ActiveEffectConfig<any>;
                const effect = config.object as ActiveEffect<any>;

                if (
                    Flags.isConvenient(effect) &&
                    effect.parent instanceof Item &&
                    Flags.isConvenient(effect.parent)
                ) {
                    renderConvenientEffectsAppIfOpen();
                }
            },
        );
    },
};

export { CloseActiveEffectConfig };
