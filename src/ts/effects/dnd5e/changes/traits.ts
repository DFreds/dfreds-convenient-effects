import { EffectChangeData } from "@common/documents/active-effect.mjs";

function addConditionImmunity({
    condition,
}: {
    condition:
        | "diseased"
        | "frightened"
        | "paralyzed"
        | "poisoned"
        | "stunned"
        | "unconscious"
        | "restrained";
}): Partial<EffectChangeData> {
    return {
        key: "system.traits.ci.value",
        type: "add",
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
        type: "add",
        value: damageType,
    };
}

function addAllDamageImmunity(): Partial<EffectChangeData> {
    return {
        key: "system.traits.di.all",
        type: "custom",
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
        | "physical"
        | "piercing"
        | "poison"
        | "psychic"
        | "radiant"
        | "slashing"
        | "thunder";
}): Partial<EffectChangeData> {
    return {
        key: "system.traits.dr.value",
        type: "add",
        value: damageType,
    };
}

function addAllDamageResistance(): Partial<EffectChangeData> {
    return {
        key: "system.traits.dr.all",
        type: "custom",
        value: "1",
    };
}

function addAllDamageVulnerability(): Partial<EffectChangeData> {
    return {
        key: "system.traits.dv.all",
        type: "custom",
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
        type: "add",
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
        type: "add",
        value: weapon,
    };
}

function addAllLanguages(): Partial<EffectChangeData> {
    return {
        key: "system.traits.languages.all",
        type: "custom",
        value: "1",
    };
}

function addSize({
    value,
}: {
    value: string;
}): Partial<EffectChangeData> {
    return {
        key: "system.traits.size",
        type: "override",
        value,
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
    addSize,
};
