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

export { abilityUpgrade };
