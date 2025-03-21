import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function addDamageImmunity({
    damageType,
}: {
    damageType: "poison";
}): Partial<EffectChangeData> {
    return {
        key: "system.traits.di.value",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: damageType,
    };
}

function addDamageResistance({
    damageType,
}: {
    damageType:
        | "acid"
        | "bludgeoning"
        | "cold"
        | "fire"
        | "force"
        | "lightning"
        | "necrotic"
        | "piercing"
        | "poison"
        | "psychic"
        | "radiant"
        | "slashing"
        | "thunder";
}): Partial<EffectChangeData> {
    return {
        key: "system.traits.dr.value",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: damageType,
    };
}

function addAllDamageResistance(): Partial<EffectChangeData> {
    return {
        key: "system.traits.dr.all",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

export { addDamageImmunity, addDamageResistance, addAllDamageResistance };
