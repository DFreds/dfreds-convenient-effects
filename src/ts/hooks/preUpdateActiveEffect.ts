import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Flags } from "../utils/flags.ts";
import { Listener } from "./index.ts";
import { createCeEffectId } from "../utils/creates.ts";

const PreUpdateActiveEffect: Listener = {
    listen(): void {
        Hooks.on(
            "preUpdateActiveEffect",
            (activeEffect: any, data: any, _metadata, _userId) => {
                const effect = activeEffect as ActiveEffect<any>;
                if (
                    Flags.isConvenient(effect) &&
                    effect.parent instanceof Item &&
                    Flags.isConvenient(effect.parent)
                ) {
                    const effectData = data as PreCreate<ActiveEffectSource>;

                    const oldCeEffectId = Flags.getCeEffectId(activeEffect);
                    const ceEffectId = createCeEffectId(
                        effectData.name ?? effect.name,
                    );

                    if (ceEffectId !== oldCeEffectId) {
                        Flags.setCeEffectId(effectData, ceEffectId);
                    }
                }
            },
        );
    },
};

export { PreUpdateActiveEffect };
