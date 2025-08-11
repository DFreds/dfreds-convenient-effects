import { EffectChangeData } from "@common/documents/active-effect.mjs";

function skillCheckBonus({
    skillType,
    value,
    priority,
}: {
    skillType: "ste";
    value: string;
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: `system.skills.${skillType}.bonuses.check`,
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value,
        priority,
    };
}

export { skillCheckBonus };
