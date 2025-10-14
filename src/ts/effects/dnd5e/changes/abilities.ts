import { EffectChangeData } from "@common/documents/active-effect.mjs";

type AbilityType = "str" | "dex" | "con" | "int" | "wis" | "cha";

function addAbility({
    ability,
    value,
    priority,
}: {
    ability: AbilityType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.abilities.${ability}.value`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

function downgradeAbility({
    ability,
    value,
    priority,
}: {
    ability: AbilityType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.abilities.${ability}.value`,
        mode: CONST.ACTIVE_EFFECT_MODES.DOWNGRADE,
        value,
        priority,
    };
}

function upgradeAbility({
    ability,
    value,
    priority,
}: {
    ability: AbilityType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.abilities.${ability}.value`,
        mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
        value,
        priority,
    };
}

function abilitySaveBonus({
    ability,
    value,
    priority,
}: {
    ability: "str" | "dex" | "con" | "int" | "wis" | "cha";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.abilities.${ability}.bonuses.save`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

function abilityCheckMode({
    ability,
    value,
    priority,
}: {
    ability: AbilityType;
    value: "-1" | "0" | "1";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.abilities.${ability}.check.roll.mode`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

function abilitySaveMode({
    ability,
    value,
    priority,
}: {
    ability: AbilityType;
    value: "-1" | "0" | "1";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.abilities.${ability}.save.roll.mode`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

function abilitySaveMax({
    ability,
    value,
    priority,
}: {
    ability: AbilityType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.abilities.${ability}.save.roll.max`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

export {
    addAbility,
    downgradeAbility,
    upgradeAbility,
    abilitySaveBonus,
    abilityCheckMode,
    abilitySaveMode,
    abilitySaveMax,
};
