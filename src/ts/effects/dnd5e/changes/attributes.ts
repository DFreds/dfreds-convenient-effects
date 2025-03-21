import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function acCover({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: "system.attributes.ac.cover",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

function exhaustion({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: "system.attributes.exhaustion",
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        value,
        priority,
    };
}

function movement({
    movementType,
    value,
    priority,
}: {
    movementType:
        | "all"
        | "burrow"
        | "climb"
        | "fly"
        | "hover"
        | "swim"
        | "units"
        | "walk";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.attributes.movement.${movementType}`,
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value,
        priority,
    };
}

export { exhaustion, movement, acCover };
