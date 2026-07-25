import { EffectChangeData } from "@common/documents/active-effect.mjs";

type ActionType = "mwak" | "rwak" | "msak" | "rsak";

const WEAPON_ACTION_TYPES = ["mwak", "rwak"] as const;
const SPELL_ACTION_TYPES = ["msak", "rsak"] as const;
const ALL_ACTION_TYPES = ["mwak", "rwak", "msak", "rsak"] as const;

function attackBonus({
    actionType,
    value,
    priority,
}: {
    actionType: ActionType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.${actionType}.attack`,
        type: "add",
        value,
        priority,
    };
}

function damageBonus({
    actionType,
    value,
    priority,
}: {
    actionType: ActionType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.${actionType}.damage`,
        type: "add",
        value,
        priority,
    };
}

function attackBonuses({
    actionTypes,
    value,
    priority,
}: {
    actionTypes: readonly ActionType[];
    value: string;
    priority?: number;
}): Partial<EffectChangeData>[] {
    return actionTypes.map((actionType) => attackBonus({ actionType, value, priority }));
}

function damageBonuses({
    actionTypes,
    value,
    priority,
}: {
    actionTypes: readonly ActionType[];
    value: string;
    priority?: number;
}): Partial<EffectChangeData>[] {
    return actionTypes.map((actionType) => damageBonus({ actionType, value, priority }));
}

function spellDcBonus({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.spell.dc`,
        type: "add",
        value,
        priority,
    };
}

function checkBonus({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.abilities.check`,
        type: "add",
        value,
        priority,
    };
}

function saveBonus({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.abilities.save`,
        type: "add",
        value,
        priority,
    };
}

function skillBonus({ value, priority }: { value: string; priority?: number }): Partial<EffectChangeData> {
    return {
        key: `system.bonuses.abilities.skill`,
        type: "add",
        value,
        priority,
    };
}

export {
    ALL_ACTION_TYPES,
    SPELL_ACTION_TYPES,
    WEAPON_ACTION_TYPES,
    attackBonus,
    attackBonuses,
    checkBonus,
    damageBonus,
    damageBonuses,
    saveBonus,
    skillBonus,
    spellDcBonus,
};
export type { ActionType };
