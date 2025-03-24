import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function advantage(): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.advantage.all`,
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

function disadvantage(): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.disadvantage.all`,
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

function advantageDeathSave(): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.advantage.deathSave`,
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
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
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
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
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
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
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
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
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

function advantageAbility({
    abilityType,
}: {
    abilityType: "all" | "str" | "dex" | "con" | "int" | "wis" | "cha";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.advantage.ability.${abilityType}`,
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

function advantageAbilityCheck({
    abilityCheckType,
}: {
    abilityCheckType: "all" | "str" | "dex" | "con" | "int" | "wis" | "cha";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.advantage.ability.check.${abilityCheckType}`,
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

function disadvantageAbilityCheck({
    abilityCheckType,
}: {
    abilityCheckType: "all" | "str" | "dex" | "con" | "int" | "wis" | "cha";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.disadvantage.ability.check.${abilityCheckType}`,
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

function advantageAbilitySave({
    saveType,
}: {
    saveType: "all" | "str" | "dex" | "con" | "int" | "wis" | "cha";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.advantage.ability.save.${saveType}`,
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

function disadvantageAbilitySave({
    saveType,
}: {
    saveType: "all" | "str" | "dex" | "con" | "int" | "wis" | "cha";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.disadvantage.ability.save.${saveType}`,
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
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
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
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
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
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
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
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
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
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
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
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
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
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
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
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
        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        value,
    };
}

export {
    advantage,
    advantageDeathSave,
    disadvantage,
    advantageAttack,
    disadvantageAttack,
    grantAdvantageAttack,
    grantDisadvantageAttack,
    advantageAbility,
    advantageAbilityCheck,
    disadvantageAbilityCheck,
    advantageAbilitySave,
    disadvantageAbilitySave,
    failAbilitySave,
    grantCriticalRange,
    grantFailAttack,
    optionalLabel,
    optionalAttack,
    optionalSave,
    optionalAbilityCheck,
    optionalSkill,
};
