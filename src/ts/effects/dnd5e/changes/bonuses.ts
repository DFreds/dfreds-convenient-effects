import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";

function attackBonus({
    attackType,
    value,
    priority,
}: {
    attackType:
        | "heal"
        | "msak"
        | "mwak"
        | "rsak"
        | "rwak"
        | "spell"
        | "swak"
        | "weapon";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.${attackType}.attack`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

function spellDcBonus({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.spell.dc`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

function checkBonus({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.abilities.check`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

function damageBonus({
    damageType,
    value,
    priority,
}: {
    damageType:
        | "check"
        | "heal"
        | "msak"
        | "mwak"
        | "rsak"
        | "rwak"
        | "save"
        | "spell"
        | "weapon";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.${damageType}.damage`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

function saveBonus({
    value,
    priority,
}: {
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.abilities.save`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

export { attackBonus, checkBonus, damageBonus, saveBonus, spellDcBonus };
