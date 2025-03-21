import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function tokenMagic({
    value,
    priority,
}: {
    value: "Evade Stance" | "outline";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: "macro.tokenMagic",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value,
        priority,
    };
}

export { tokenMagic };
