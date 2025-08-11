import { EffectChangeData } from "@common/documents/active-effect.mjs";

function initiativeAdv(): Partial<EffectChangeData> {
    return {
        key: "flags.dnd5e.initiativeAdv",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

function initiativeDisadv(): Partial<EffectChangeData> {
    return {
        key: "flags.dnd5e.initiativeDisadv",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value: "1",
    };
}

export { initiativeAdv, initiativeDisadv };
