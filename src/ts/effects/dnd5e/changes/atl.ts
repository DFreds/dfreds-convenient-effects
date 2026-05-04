import { EffectChangeData } from "@common/documents/active-effect.mjs";

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
        type: "override",
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
        type: "upgrade",
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
        type: "override",
        value,
        priority,
    };
}

export { atlLight, atlSightRange, atlSightVisionMode };
