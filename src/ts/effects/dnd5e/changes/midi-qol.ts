import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

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
    attackType: "all" | "mwak" | "msak" | "rwak" | "rsak";
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

function advantageAbilityCheck({
    abilityCheckType,
}: {
    abilityCheckType: "all";
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
    abilityCheckType: "all";
}): Partial<EffectChangeData> {
    return {
        key: `flags.midi-qol.disadvantage.ability.check.${abilityCheckType}`,
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

function advantageSave({
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

function disadvantageSave({
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

function failSave({
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

export {
    advantageAttack,
    disadvantageAttack,
    grantAdvantageAttack,
    grantDisadvantageAttack,
    advantageAbilityCheck,
    disadvantageAbilityCheck,
    advantageSave,
    disadvantageSave,
    failSave,
    grantCriticalRange,
};
