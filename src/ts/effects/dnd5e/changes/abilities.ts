import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function abilityUpgrade({
    ability,
    value,
    priority = 5,
}: {
    ability: "str" | "dex" | "con" | "int" | "wis" | "cha";
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

function saveBonus({
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

export { abilityUpgrade, saveBonus };
