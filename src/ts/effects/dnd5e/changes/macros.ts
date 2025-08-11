import { EffectChangeData } from "@common/documents/active-effect.mjs";

function tokenMagic({
    value,
    priority,
}: {
    value:
        | "Evade Stance"
        | "outline"
        | "clover"
        | "oldfilm"
        | "blur"
        | "bloom"
        | "images"
        | "water-field"
        | "glow"
        | "fire"
        | "fog"
        | "warp-field"
        | "Fire v2 (coldfire)"
        | "electric"
        | "mantle-of-madness"
        | "pure-fire-aura"
        | "pure-ice-aura"
        | "shockwave"
        | "bevel";
    priority?: number;
}): Partial<EffectChangeData> {
    return {
        key: "macro.tokenMagic",
        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
        value,
        priority,
    };
}

export { tokenMagic };
