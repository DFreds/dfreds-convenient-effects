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

export { skillCheckBonus, skillCheckMode };
