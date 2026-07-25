import { EffectChangeData } from "@common/documents/active-effect.mjs";

const ALL = "ALL";

type DamageType =
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

type ConditionType =
    | "bleeding"
    | "blinded"
    | "burning"
    | "charmed"
    | "cursed"
    | "deafened"
    | "dehydration"
    | "diseased"
    | "exhaustion"
    | "falling"
    | "frightened"
    | "grappled"
    | "incapacitated"
    | "invisible"
    | "malnutrition"
    | "paralyzed"
    | "petrified"
    | "poisoned"
    | "prone"
    | "restrained"
    | "silenced"
    | "stunned"
    | "suffocation"
    | "surprised"
    | "transformed"
    | "unconscious";

function addConditionImmunity({ condition }: { condition: ConditionType }): Partial<EffectChangeData> {
    return {
        key: "system.traits.ci.value",
        type: "add",
        value: condition,
    };
}

function addDamageImmunity({ damageType }: { damageType: DamageType }): Partial<EffectChangeData> {
    return {
        key: "system.traits.di.value",
        type: "add",
        value: damageType,
    };
}

function addAllDamageImmunity(): Partial<EffectChangeData> {
    return {
        key: "system.traits.di.value",
        type: "add",
        value: ALL,
    };
}

function addDamageResistance({ damageType }: { damageType: DamageType }): Partial<EffectChangeData> {
    return {
        key: "system.traits.dr.value",
        type: "add",
        value: damageType,
    };
}

function addAllDamageResistance(): Partial<EffectChangeData> {
    return {
        key: "system.traits.dr.value",
        type: "add",
        value: ALL,
    };
}

function addDamageBypass({ bypass }: { bypass: "ada" | "mgc" | "sil" }): Partial<EffectChangeData> {
    return {
        key: "system.traits.dr.bypasses",
        type: "add",
        value: bypass,
    };
}

function addDamageVulnerability({ damageType }: { damageType: DamageType }): Partial<EffectChangeData> {
    return {
        key: "system.traits.dv.value",
        type: "add",
        value: damageType,
    };
}

function addAllDamageVulnerability(): Partial<EffectChangeData> {
    return {
        key: "system.traits.dv.value",
        type: "add",
        value: ALL,
    };
}

function addLanguage({ language }: { language: string }): Partial<EffectChangeData> {
    return {
        key: "system.traits.languages.value",
        type: "add",
        value: language,
    };
}

function addAllLanguages(): Partial<EffectChangeData> {
    return {
        key: "system.traits.languages.value",
        type: "add",
        value: ALL,
    };
}

function addWeaponProficiency({ weapon }: { weapon: string }): Partial<EffectChangeData> {
    return {
        key: "system.traits.weaponProf.value",
        type: "add",
        value: weapon,
    };
}

function addWeaponMastery({ weapon }: { weapon: string }): Partial<EffectChangeData> {
    return {
        key: "system.traits.weaponProf.mastery.value",
        type: "add",
        value: weapon,
    };
}

function addArmorProficiency({ armor }: { armor: "lgt" | "med" | "hvy" | "shl" }): Partial<EffectChangeData> {
    return {
        key: "system.traits.armorProf.value",
        type: "add",
        value: armor,
    };
}

function damageModification({
    damageType,
    value,
    priority,
}: {
    damageType: DamageType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.traits.dm.amount.${damageType}`,
        type: "add",
        value,
        priority,
    };
}

function damageModificationBypass({ bypass }: { bypass: "ada" | "mgc" | "sil" }): Partial<EffectChangeData> {
    return {
        key: "system.traits.dm.bypasses",
        type: "add",
        value: bypass,
    };
}

function addSize({ value }: { value: string }): Partial<EffectChangeData> {
    return {
        key: "system.traits.size",
        type: "override",
        value,
    };
}

export {
    ALL,
    addAllDamageImmunity,
    addAllDamageResistance,
    addAllDamageVulnerability,
    addAllLanguages,
    addArmorProficiency,
    addConditionImmunity,
    addDamageBypass,
    addDamageImmunity,
    addDamageResistance,
    addDamageVulnerability,
    addLanguage,
    addSize,
    addWeaponMastery,
    addWeaponProficiency,
    damageModification,
    damageModificationBypass,
};
export type { ConditionType, DamageType };
