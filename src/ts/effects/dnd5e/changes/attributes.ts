import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function acBonus({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: "system.attributes.ac.bonus",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

function acCalc({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: "system.attributes.ac.calc",
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        value,
        priority,
    };
}

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

function acFormula({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: "system.attributes.ac.formula",
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        value,
        priority,
    };
}

function upgradeDarkvision({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: "system.attributes.senses.darkvision",
        mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
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

function upgradeMovement({
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
        mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
        value,
        priority,
    };
}

export {
    acBonus,
    acCalc,
    acCover,
    acFormula,
    exhaustion,
    movement,
    upgradeMovement,
    upgradeDarkvision,
};
