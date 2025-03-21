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

function addAllDamageResistance({
    damageType,
}: {
    damageType: "physical" | "magical";
}): Partial<EffectChangeData> {
    return {
        key: "system.traits.dr.all",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: damageType,
    };
}

export { addDamageImmunity, addAllDamageResistance };
