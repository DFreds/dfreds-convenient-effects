import { Flags } from "../utils/flags.ts";
import { Listener } from "./index.ts";
import { createCeEffectId } from "../utils/creates.ts";
import { updateOldCeEffectIds } from "../utils/updates.ts";
import { findAllEffects } from "../utils/finds.ts";
import { ActiveEffectSource } from "@client/documents/_module.mjs";

const PreUpdateActiveEffect: Listener = {
    listen(): void {
        Hooks.on("preUpdateActiveEffect", (activeEffect: any, data: any, _metadata: any, _userId: any) => {
            const effect = activeEffect as ActiveEffect<any>;
            if (Flags.isConvenient(effect) && effect.parent instanceof Item && Flags.isConvenient(effect.parent)) {
                const effectData = data as PreCreate<ActiveEffectSource>;

                const oldCeEffectId = Flags.getCeEffectId(activeEffect);
                const newCeEffectId = createCeEffectId(effectData.name ?? effect.name);

                if (newCeEffectId === oldCeEffectId) return;

                Flags.setCeEffectId(effectData, newCeEffectId);

                const allEffects = findAllEffects({ backup: false });
                updateOldCeEffectIds(allEffects, oldCeEffectId, newCeEffectId);
            }
        });
    },
};

export { PreUpdateActiveEffect };
