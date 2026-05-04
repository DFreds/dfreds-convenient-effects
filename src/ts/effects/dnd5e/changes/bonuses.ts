import { EffectChangeData } from "@common/documents/active-effect.mjs";

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
        type: "add",
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
        type: "add",
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
        type: "add",
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
        type: "add",
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
        type: "add",
        value,
        priority,
    };
}

export { attackBonus, checkBonus, damageBonus, saveBonus, spellDcBonus };
