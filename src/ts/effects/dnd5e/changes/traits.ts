import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function addConditionImmunity({
    condition,
}: {
    condition:
        | "frightened"
        | "paralyzed"
        | "poisoned"
        | "stunned"
        | "unconscious"
        | "restrained";
}): Partial<EffectChangeData> {
    return {
        key: "system.traits.ci.value",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: condition,
    };
}

function addDamageImmunity({
    damageType,
}: {
    damageType: "poison" | "psychic";
}): Partial<EffectChangeData> {
    return {
        key: "system.traits.di.value",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: damageType,
    };
}

function addAllDamageImmunity(): Partial<EffectChangeData> {
    return {
        key: "system.traits.di.all",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
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

function addAllDamageVulnerability(): Partial<EffectChangeData> {
    return {
        key: "system.traits.dv.all",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

function addLanguage({
    language,
}: {
    language: string;
}): Partial<EffectChangeData> {
    return {
        key: "system.traits.languages.value",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: language,
    };
}

function addWeaponProficiency({
    weapon,
}: {
    weapon: string;
}): Partial<EffectChangeData> {
    return {
        key: "system.traits.weaponProf.value",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: weapon,
    };
}

function addAllLanguages(): Partial<EffectChangeData> {
    return {
        key: "system.traits.languages.all",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

export {
    addConditionImmunity,
    addAllDamageImmunity,
    addAllDamageResistance,
    addDamageImmunity,
    addDamageResistance,
    addLanguage,
    addWeaponProficiency,
    addAllLanguages,
    addAllDamageVulnerability,
};
