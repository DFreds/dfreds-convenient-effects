import { MODULE_ID } from "../constants.ts";
import { createCeEffectId } from "../utils/creates.ts";
import { Flags } from "../utils/flags.ts";
import { Listener } from "./index.ts";

const PreCreateActiveEffect: Listener = {
    listen(): void {
        Hooks.on("preCreateActiveEffect", (activeEffect: any, _data: any, _options: any, _userId: any) => {
            const effect = activeEffect as ActiveEffect<any>;
            const isConvenientEffect =
                Flags.isConvenient(effect) && effect.parent instanceof Item && Flags.isConvenient(effect.parent);
            if (!isConvenientEffect || Flags.isBackup(effect)) return;

            const duplicateSource = effect._stats?.duplicateSource;
            const original = duplicateSource ? fromUuidSync(duplicateSource) : null;
            const sharesOriginalId =
                original instanceof ActiveEffect && Flags.getCeEffectId(original) === Flags.getCeEffectId(effect);
            if (!sharesOriginalId) return;

            effect.updateSource({ [`flags.${MODULE_ID}.ceEffectId`]: createCeEffectId(effect.name) });
        });
    },
};

export { PreCreateActiveEffect };
