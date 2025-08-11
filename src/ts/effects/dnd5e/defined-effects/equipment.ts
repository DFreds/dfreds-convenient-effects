import { ActiveEffectSource } from "@client/documents/_module.mjs";
import { ItemEffects } from "../../effect-definition.ts";
import { atlLight } from "../changes/atl.ts";
import { createConvenientEffect } from "../../../utils/creates.ts";
import { COLORS, SECONDS } from "../../../constants.ts";

function equipment(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Folders.Equipment"),
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
                "ConvenientEffects.Dnd.BullseyeLantern.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BullseyeLantern.description",
            ),
            img: "icons/sundries/lights/lantern-iron-yellow.webp",
            duration: { seconds: SECONDS.IN_SIX_HOURS },
            changes: [
                atlLight({
                    lightType: "angle",
                    value: "60",
                }),
                atlLight({
                    lightType: "dim",
                    value: "120",
                }),
                atlLight({
                    lightType: "bright",
                    value: "60",
                }),
                atlLight({
                    lightType: "color",
                    value: COLORS.FIRE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.4",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "torch","speed": 1,"intensity": 1}',
                }),
            ],
        },
    });
}

function candle(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Candle.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Candle.description",
            ),
            img: "icons/sundries/lights/candle-unlit-white.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                atlLight({
                    lightType: "dim",
                    value: "10",
                }),
                atlLight({
                    lightType: "bright",
                    value: "5",
                }),
                atlLight({
                    lightType: "color",
                    value: COLORS.FIRE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.2",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "torch","speed": 1,"intensity": 1}',
                }),
            ],
        },
    });
}

function hoodedLantern(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.HoodedLantern.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.HoodedLantern.description",
            ),
            img: "icons/sundries/lights/lantern-iron-yellow.webp",
            duration: { seconds: SECONDS.IN_SIX_HOURS },
            changes: [
                atlLight({
                    lightType: "dim",
                    value: "5",
                }),
                atlLight({
                    lightType: "bright",
                    value: "0",
                }),
                atlLight({
                    lightType: "color",
                    value: COLORS.FIRE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.4",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "torch","speed": 1,"intensity": 1}',
                }),
            ],
        },
    });
}

function lantern(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Lantern.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Lantern.description",
            ),
            img: "icons/sundries/lights/lantern-iron-yellow.webp",
            duration: { seconds: SECONDS.IN_SIX_HOURS },
            changes: [
                atlLight({
                    lightType: "dim",
                    value: "60",
                }),
                atlLight({
                    lightType: "bright",
                    value: "30",
                }),
                atlLight({
                    lightType: "color",
                    value: COLORS.FIRE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.4",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "torch","speed": 1,"intensity": 1}',
                }),
            ],
        },
    });
}

function torch(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Torch.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Torch.description",
            ),
            img: "icons/sundries/lights/torch-black.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                atlLight({
                    lightType: "dim",
                    value: "40",
                }),
                atlLight({
                    lightType: "bright",
                    value: "20",
                }),
                atlLight({
                    lightType: "color",
                    value: COLORS.FIRE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.4",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "torch","speed": 1,"intensity": 1}',
                }),
            ],
        },
    });
}

export { equipment };
