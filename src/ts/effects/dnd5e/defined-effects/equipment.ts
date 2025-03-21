import { COLORS, SECONDS } from "src/ts/constants.ts";
import { createConvenientEffect } from "src/ts/utils/creates.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { ItemEffects } from "../../effect-definition.ts";

function equipment(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Folders.Equipment,
            ),
        },
        effects: [
            bullseyeLantern(),
            candle(),
            hoodedLantern(),
            lantern(),
            torch(),
        ],
    };
}

function bullseyeLantern(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BullseyeLantern.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BullseyeLantern.description,
            ),
            img: "icons/sundries/lights/lantern-iron-yellow.webp",
            duration: { seconds: SECONDS.IN_SIX_HOURS },
            changes: [
                {
                    key: "ATL.light.angle",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "60",
                },
                {
                    key: "ATL.light.dim",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "120",
                },
                {
                    key: "ATL.light.bright",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "60",
                },
                {
                    key: "ATL.light.color",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: COLORS.FIRE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.4",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "torch","speed": 1,"intensity": 1}',
                },
            ],
        },
    });
}

function candle(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Candle.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Candle.description,
            ),
            img: "icons/sundries/lights/candle-unlit-white.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "ATL.light.dim",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "10",
                },
                {
                    key: "ATL.light.bright",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "5",
                },
                {
                    key: "ATL.light.color",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: COLORS.FIRE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.2",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "torch","speed": 1,"intensity": 1}',
                },
            ],
        },
    });
}

function hoodedLantern(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HoodedLantern.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HoodedLantern.description,
            ),
            img: "icons/sundries/lights/lantern-iron-yellow.webp",
            duration: { seconds: SECONDS.IN_SIX_HOURS },
            changes: [
                {
                    key: "ATL.light.dim",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "5",
                },
                {
                    key: "ATL.light.bright",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0",
                },
                {
                    key: "ATL.light.color",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: COLORS.FIRE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.4",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "torch","speed": 1,"intensity": 1}',
                },
            ],
        },
    });
}

function lantern(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Lantern.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Lantern.description,
            ),
            img: "icons/sundries/lights/lantern-iron-yellow.webp",
            duration: { seconds: SECONDS.IN_SIX_HOURS },
            changes: [
                {
                    key: "ATL.light.dim",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "60",
                },
                {
                    key: "ATL.light.bright",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "30",
                },
                {
                    key: "ATL.light.color",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: COLORS.FIRE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.4",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "torch","speed": 1,"intensity": 1}',
                },
            ],
        },
    });
}

function torch(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Torch.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Torch.description,
            ),
            img: "icons/sundries/lights/torch-black.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "ATL.light.dim",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "40",
                },
                {
                    key: "ATL.light.bright",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "20",
                },
                {
                    key: "ATL.light.color",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: COLORS.FIRE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.4",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "torch","speed": 1,"intensity": 1}',
                },
            ],
        },
    });
}

export { equipment };
