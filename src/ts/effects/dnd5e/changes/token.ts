import { EffectChangeData } from "@common/documents/active-effect.mjs";

function tokenLight({
    attribute,
    value,
    priority,
}: {
    attribute: "angle" | "dim" | "bright" | "color" | "alpha";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `token.light.${attribute}`,
        type: "override",
        value,
        priority,
    };
}

function tokenLightAnimationAttribute({
    attribute,
    value,
    priority,
}: {
    attribute: "speed" | "intensity" | "speed";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `token.light.animation.${attribute}`,
        type: "override",
        value,
        priority,
    };
}

function tokenLightAnimationType({
    type,
    priority,
}: {
    type: "flame" | "torch" | "revolving" | "siren" | "pulse" | "reactivepulse" | "chroma" | "wave" | "fog" | "sunburst" | "dome" | "emanation" | "hexa" | "ghost" | "energy" | "vortex" | "witchwave" | "rainbowswirl" | "radialrainbow" | "fairy" | "grid" | "starlight" | "smokepatch";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `token.light.animation.type`,
        type: "override",
        value: type,
        priority,
    };
}

function tokenSight({
    attribute,
    value,
    priority,
}: {
    attribute: "range" | "visionMode" | "saturation";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `token.sight.${attribute}`,
        type: "override",
        value,
        priority,
    };
}

function tokenTexture({
    attribute,
    value,
    priority,
}: {
    attribute: "scaleX" | "scaleY";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `token.texture.${attribute}`,
        type: "override",
        value,
        priority,
    };
}

export { tokenLight, tokenLightAnimationAttribute, tokenLightAnimationType, tokenSight, tokenTexture };
