import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function atlLight({
    lightType,
    value,
    priority,
}: {
    lightType: "dim" | "bright" | "color" | "alpha" | "animation";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `ATL.light.${lightType}`,
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        value,
        priority,
    };
}

export { atlLight };
