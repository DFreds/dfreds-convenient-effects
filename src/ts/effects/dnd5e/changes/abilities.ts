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
        type: "add",
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
        type: "downgrade",
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
        type: "upgrade",
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
        type: "add",
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
        type: "add",
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
        type: "add",
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
        type: "add",
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
