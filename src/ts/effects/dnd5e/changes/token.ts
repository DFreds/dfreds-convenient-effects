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
    attribute: "speed" | "intensity";
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
    type:
        | "flame"
        | "torch"
        | "revolving"
        | "siren"
        | "pulse"
        | "reactivepulse"
        | "chroma"
        | "wave"
        | "fog"
        | "sunburst"
        | "dome"
        | "emanation"
        | "hexa"
        | "ghost"
        | "energy"
        | "vortex"
        | "witchwave"
        | "rainbowswirl"
        | "radialrainbow"
        | "fairy"
        | "grid"
        | "starlight"
        | "smokepatch";
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
    type = "override",
    priority,
}: {
    attribute: "scaleX" | "scaleY";
    value: string | number;
    type?: "override" | "multiply";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `token.texture.${attribute}`,
        type,
        value,
        priority,
    };
}

function multiplyTokenScale({ value, priority }: { value: number; priority?: number }): Partial<EffectChangeData>[] {
    return [
        tokenTexture({ attribute: "scaleX", value, type: "multiply", priority }),
        tokenTexture({ attribute: "scaleY", value, type: "multiply", priority }),
    ];
}

function tokenAlpha({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "token.alpha",
        type: "override",
        value,
        priority,
    };
}

function tokenMovementAction({
    value,
    priority,
}: {
    value: "blink" | "burrow" | "climb" | "crawl" | "displace" | "fly" | "jump" | "swim" | "walk";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: "token.movementAction",
        type: "override",
        value,
        priority,
    };
}

function tokenDetectionMode({
    id,
    range,
    enabled = true,
    priority,
}: {
    id: string;
    range: number;
    enabled?: boolean;
    priority?: number;
}): Partial<EffectChangeData>[] {
    return [
        {
            key: `token.detectionModes.${id}.range`,
            type: "override",
            value: range,
            priority,
        },
        {
            key: `token.detectionModes.${id}.enabled`,
            type: "override",
            value: enabled,
            priority,
        },
    ];
}

export {
    multiplyTokenScale,
    tokenAlpha,
    tokenDetectionMode,
    tokenLight,
    tokenLightAnimationAttribute,
    tokenLightAnimationType,
    tokenMovementAction,
    tokenSight,
    tokenTexture,
};
