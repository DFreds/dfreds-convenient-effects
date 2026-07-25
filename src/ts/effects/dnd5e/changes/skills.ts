import { EffectChangeData } from "@common/documents/active-effect.mjs";

type SkillType =
    | "acr"
    | "ani"
    | "arc"
    | "ath"
    | "dec"
    | "his"
    | "ins"
    | "inv"
    | "itm"
    | "med"
    | "nat"
    | "per"
    | "prc"
    | "prf"
    | "rel"
    | "slt"
    | "ste"
    | "sur";

function skillCheckBonus({
    skillType,
    value,
    priority,
}: {
    skillType: SkillType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.skills.${skillType}.bonuses.check`,
        type: "add",
        value,
        priority,
    };
}

function skillCheckMode({
    skillType,
    value,
    priority,
}: {
    skillType: SkillType;
    value: "-1" | "0" | "1";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.skills.${skillType}.roll.mode`,
        type: "add",
        value,
        priority,
    };
}

function skillPassiveBonus({
    skillType,
    value,
    priority,
}: {
    skillType: SkillType;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.skills.${skillType}.bonuses.passive`,
        type: "add",
        value,
        priority,
    };
}

// NOTE: Proficiency level: 0 none, 0.5 half, 1 proficient, 2 expertise.
function skillProficiency({
    skillType,
    value,
    priority,
}: {
    skillType: SkillType;
    value: "0" | "0.5" | "1" | "2";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.skills.${skillType}.value`,
        type: "upgrade",
        value,
        priority,
    };
}

function toolCheckBonus({
    toolType,
    value,
    priority,
}: {
    toolType: string;
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.tools.${toolType}.bonuses.check`,
        type: "add",
        value,
        priority,
    };
}

function toolCheckMode({
    toolType,
    value,
    priority,
}: {
    toolType: string;
    value: "-1" | "0" | "1";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.tools.${toolType}.roll.mode`,
        type: "add",
        value,
        priority,
    };
}

function toolProficiency({
    toolType,
    value,
    priority,
}: {
    toolType: string;
    value: "0" | "0.5" | "1" | "2";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.tools.${toolType}.value`,
        type: "upgrade",
        value,
        priority,
    };
}

export {
    skillCheckBonus,
    skillCheckMode,
    skillPassiveBonus,
    skillProficiency,
    toolCheckBonus,
    toolCheckMode,
    toolProficiency,
};
export type { SkillType };
