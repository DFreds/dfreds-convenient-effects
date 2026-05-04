import { EffectChangeData } from "@common/documents/active-effect.mjs";

function advantage(): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.advantage.all`,
        type: "custom",
        value: "1",
    };
}

function disadvantage(): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.disadvantage.all`,
        type: "custom",
        value: "1",
    };
}

function advantageAttack({
    attackType,
}: {
    attackType: "all" | "mwak" | "msak" | "rwak" | "rsak";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.advantage.attack.${attackType}`,
        type: "custom",
        value: "1",
    };
}

function disadvantageAttack({
    attackType,
}: {
    attackType: "all" | "mwak" | "msak" | "rwak" | "rsak" | "str" | "dex";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.disadvantage.attack.${attackType}`,
        type: "custom",
        value: "1",
    };
}

function grantAdvantageAttack({
    attackType,
}: {
    attackType: "all" | "mwak" | "msak" | "rwak" | "rsak";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.grants.advantage.attack.${attackType}`,
        type: "custom",
        value: "1",
    };
}

function grantDisadvantageAttack({
    attackType,
}: {
    attackType: "all" | "mwak" | "msak" | "rwak" | "rsak";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.grants.disadvantage.attack.${attackType}`,
        type: "custom",
        value: "1",
    };
}

function failAbilitySave({
    saveType,
}: {
    saveType: "all" | "str" | "dex" | "con" | "int" | "wis" | "cha";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.fail.ability.save.${saveType}`,
        type: "custom",
        value: "1",
    };
}

function grantCriticalRange({
    range,
}: {
    range: string;
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.grants.critical.range`,
        type: "override",
        value: range,
    };
}

function grantFailAttack({
    attackType,
}: {
    attackType: "all";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.grants.attack.fail.${attackType}`,
        type: "custom",
        value: "1",
    };
}

function optionalLabel({
    key,
    label,
}: {
    key: string;
    label: string;
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.optional.${key}.label`,
        type: "override",
        value: label,
    };
}

function optionalAttack({
    key,
    attackType,
    value,
}: {
    key: string;
    attackType: "all" | "mwak" | "msak" | "rwak" | "rsak";
    value: string;
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.optional.${key}.attack.${attackType}`,
        type: "override",
        value,
    };
}

function optionalSave({
    key,
    saveType,
    value,
}: {
    key: string;
    saveType: "all" | "str" | "dex" | "con" | "int" | "wis" | "cha";
    value: string;
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.optional.${key}.save.${saveType}`,
        type: "override",
        value,
    };
}

function optionalAbilityCheck({
    key,
    abilityCheckType,
    value,
}: {
    key: string;
    abilityCheckType: "all" | "str" | "dex" | "con" | "int" | "wis" | "cha";
    value: string;
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.optional.${key}.check.${abilityCheckType}`,
        type: "override",
        value,
    };
}

function optionalSkill({
    key,
    skillType,
    value,
}: {
    key: string;
    skillType: "all";
    value: string;
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.optional.${key}.skill.${skillType}`,
        type: "override",
        value,
    };
}

function magicResistanceSaves(): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.magicResistance.save.all`,
        type: "custom",
        value: "1",
    };
}

export {
    advantage,
    disadvantage,
    advantageAttack,
    disadvantageAttack,
    grantAdvantageAttack,
    grantDisadvantageAttack,
    failAbilitySave,
    grantCriticalRange,
    grantFailAttack,
    optionalLabel,
    optionalAttack,
    optionalSave,
    optionalAbilityCheck,
    optionalSkill,
    magicResistanceSaves,
};
