import { ActiveEffectSource } from "@client/documents/_module.mjs";
import { ItemEffects } from "../../effect-definition.ts";
import { createConvenientEffect } from "../../../utils/creates.ts";
import { COLORS, SECONDS } from "../../../constants.ts";
import { tokenLight, tokenLightAnimationAttribute, tokenLightAnimationType } from "../changes/token.ts";

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
            duration: { value: SECONDS.IN_SIX_HOURS, units: "seconds" },
            changes: [
                tokenLight({
                    attribute: "angle",
                    value: "60",
                }),
                tokenLight({
                    attribute: "dim",
                    value: "120",
                }),
                tokenLight({
                    attribute: "bright",
                    value: "60",
                }),
                tokenLight({
                    attribute: "color",
                    value: COLORS.FIRE,
                }),
                tokenLight({
                    attribute: "alpha",
                    value: "0.4",
                }),
                tokenLightAnimationAttribute({
                    attribute: "speed",
                    value: "1",
                }),
                tokenLightAnimationAttribute({
                    attribute: "intensity",
                    value: "1",
                }),
                tokenLightAnimationType({
                    type: "flame",
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
            duration: { value: SECONDS.IN_ONE_HOUR, units: "seconds" },
            changes: [
                tokenLight({
                    attribute: "dim",
                    value: "10",
                }),
                tokenLight({
                    attribute: "bright",
                    value: "5",
                }),
                tokenLight({
                    attribute: "color",
                    value: COLORS.FIRE,
                }),
                tokenLight({
                    attribute: "alpha",
                    value: "0.2",
                }),
                tokenLightAnimationAttribute({
                    attribute: "speed",
                    value: "1",
                }),
                tokenLightAnimationAttribute({
                    attribute: "intensity",
                    value: "1",
                }),
                tokenLightAnimationType({
                    type: "flame",
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
            duration: { value: SECONDS.IN_SIX_HOURS, units: "seconds" },
            changes: [
                tokenLight({
                    attribute: "dim",
                    value: "5",
                }),
                tokenLight({
                    attribute: "bright",
                    value: "0",
                }),
                tokenLight({
                    attribute: "color",
                    value: COLORS.FIRE,
                }),
                tokenLight({
                    attribute: "alpha",
                    value: "0.4",
                }),
                tokenLightAnimationAttribute({
                    attribute: "speed",
                    value: "1",
                }),
                tokenLightAnimationAttribute({
                    attribute: "intensity",
                    value: "1",
                }),
                tokenLightAnimationType({
                    type: "flame",
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
            duration: { value: SECONDS.IN_SIX_HOURS, units: "seconds" },
            changes: [
                tokenLight({
                    attribute: "dim",
                    value: "60",
                }),
                tokenLight({
                    attribute: "bright",
                    value: "30",
                }),
                tokenLight({
                    attribute: "color",
                    value: COLORS.FIRE,
                }),
                tokenLight({
                    attribute: "alpha",
                    value: "0.4",
                }),
                tokenLightAnimationAttribute({
                    attribute: "speed",
                    value: "1",
                }),
                tokenLightAnimationAttribute({
                    attribute: "intensity",
                    value: "1",
                }),
                tokenLightAnimationType({
                    type: "flame",
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
            duration: { value: SECONDS.IN_ONE_HOUR, units: "seconds" },
            changes: [
                tokenLight({
                    attribute: "dim",
                    value: "40",
                }),
                tokenLight({
                    attribute: "bright",
                    value: "20",
                }),
                tokenLight({
                    attribute: "color",
                    value: COLORS.FIRE,
                }),
                tokenLight({
                    attribute: "alpha",
                    value: "0.4",
                }),
                tokenLightAnimationAttribute({
                    attribute: "speed",
                    value: "1",
                }),
                tokenLightAnimationAttribute({
                    attribute: "intensity",
                    value: "1",
                }),
                tokenLightAnimationType({
                    type: "flame",
                }),
            ],
        },
    });
}

export { equipment };
