import { EffectChangeData } from "@common/documents/active-effect.mjs";

function acMin({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.ac.min",
        type: "upgrade",
        value,
        priority,
    };
}

function acBonus({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.ac.bonus",
        type: "add",
        value,
        priority,
    };
}

function acCalc({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.ac.calc",
        type: "override",
        value,
        priority,
    };
}

function acCover({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.ac.cover",
        type: "add",
        value,
        priority,
    };
}

function acFormula({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.ac.formula",
        type: "override",
        value,
        priority,
    };
}

type SenseType = "blindsight" | "darkvision" | "tremorsense" | "truesight";

function addSense({
    sense,
    value,
    priority,
}: {
    sense: SenseType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.attributes.senses.ranges.${sense}`,
        type: "add",
        value,
        priority,
    };
}

function upgradeSense({
    sense,
    value,
    priority,
}: {
    sense: SenseType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.attributes.senses.ranges.${sense}`,
        type: "upgrade",
        value,
        priority,
    };
}

function addDarkvision({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return addSense({ sense: "darkvision", value, priority });
}

function upgradeDarkvision({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return upgradeSense({ sense: "darkvision", value, priority });
}

function upgradeTrueSight({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return upgradeSense({ sense: "truesight", value, priority });
}

function tempMaxHp({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.hp.tempmax",
        type: "add",
        value,
        priority,
    };
}

function hpBonus({
    bonusType,
    value,
    priority,
}: {
    bonusType: "level" | "overall";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.attributes.hp.bonuses.${bonusType}`,
        type: "add",
        value,
        priority,
    };
}

function acFlat({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.ac.flat",
        type: "override",
        value,
        priority,
    };
}

/**
 * Every movement speed dnd5e derives. Map over this to build a change per speed
 * for effects that alter movement as a whole.
 */
const MOVEMENT_TYPES = ["burrow", "climb", "fly", "swim", "walk"] as const;

type MovementType = (typeof MOVEMENT_TYPES)[number];

function movementBonus({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.movement.bonus",
        type: "add",
        value,
        priority,
    };
}

function movementOverride({
    movementType,
    value,
    priority,
}: {
    movementType: MovementType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.attributes.movement.${movementType}`,
        type: "override",
        value,
        priority,
    };
}

function movementMultiply({
    movementType,
    value,
    priority,
}: {
    movementType: MovementType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.attributes.movement.${movementType}`,
        type: "multiply",
        value,
        priority,
    };
}

function upgradeMovement({
    movementType,
    value,
    priority,
}: {
    movementType: MovementType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.attributes.movement.${movementType}`,
        type: "upgrade",
        value,
        priority,
    };
}

function movementHover({ value, priority }: { value: boolean; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.movement.hover",
        type: "override",
        value,
        priority,
    };
}

function ignoreDifficultTerrain({
    movementType,
    priority,
}: {
    movementType: MovementType;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: "system.attributes.movement.ignoredDifficultTerrain",
        type: "add",
        value: movementType,
        priority,
    };
}

function multiplyEncumbrance({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.encumbrance.multipliers.overall",
        type: "multiply",
        value,
        priority,
    };
}

function initiativeMode({
    value,
    priority,
}: {
    value: "-1" | "0" | "1";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.attributes.init.roll.mode`,
        type: "add",
        value,
        priority,
    };
}

function concentrationMode({
    value,
    priority,
}: {
    value: "-1" | "0" | "1";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.attributes.concentration.roll.mode`,
        type: "add",
        value,
        priority,
    };
}

function deathMode({ value, priority }: { value: "-1" | "0" | "1"; priority?: number }): Partial<EffectChangeData> {
    return {
        key: `system.attributes.death.roll.mode`,
        type: "add",
        value,
        priority,
    };
}

function concentrationSaveBonus({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.concentration.bonuses.save",
        type: "add",
        value,
        priority,
    };
}

function deathSaveBonus({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: "system.attributes.death.bonuses.save",
        type: "add",
        value,
        priority,
    };
}

export {
    MOVEMENT_TYPES,
    acBonus,
    acCalc,
    acCover,
    acFlat,
    acFormula,
    acMin,
    addDarkvision,
    addSense,
    concentrationMode,
    concentrationSaveBonus,
    deathMode,
    deathSaveBonus,
    hpBonus,
    ignoreDifficultTerrain,
    initiativeMode,
    movementBonus,
    movementHover,
    movementMultiply,
    movementOverride,
    multiplyEncumbrance,
    tempMaxHp,
    upgradeDarkvision,
    upgradeMovement,
    upgradeSense,
    upgradeTrueSight,
};
export type { MovementType, SenseType };
