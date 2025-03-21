import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function initiativeDisadv(): Partial<EffectChangeData> {
    return {
        key: "flags.dnd5e.initiativeDisadv",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

export { initiativeDisadv };
