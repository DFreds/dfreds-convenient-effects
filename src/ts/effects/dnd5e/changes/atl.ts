import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function atlLight({
    lightType,
    value,
    priority,
}: {
    lightType: "angle" | "dim" | "bright" | "color" | "alpha" | "animation";
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

function atlSightRange({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `ATL.sight.range`,
        mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
        value,
        priority,
    };
}

function atlSightVisionMode({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `ATL.sight.visionMode`,
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        value,
        priority,
    };
}

export { atlLight, atlSightRange, atlSightVisionMode };
