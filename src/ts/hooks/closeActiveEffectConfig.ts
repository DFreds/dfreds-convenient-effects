import {
    isEffectConvenient,
    renderConvenientEffectsAppIfOpen,
} from "../helpers.ts";
import { Listener } from "./index.ts";

const CloseActiveEffectConfig: Listener = {
    listen(): void {
        Hooks.on(
            "closeActiveEffectConfig",
            (activeEffectConfig: any, _html) => {
                const config = activeEffectConfig as ActiveEffectConfig<any>;
                const effect = config.object as ActiveEffect<any>;

                if (isEffectConvenient(effect)) {
                    renderConvenientEffectsAppIfOpen();
                }
            },
        );
    },
};

export { CloseActiveEffectConfig };
