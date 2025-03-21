import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import {
    EffectDefinition,
    ItemEffects,
    MigrationType,
} from "../effect-definition.ts";
import { createConvenientEffect } from "../../utils/creates.ts";
import { COLORS, SECONDS } from "src/ts/constants.ts";
import { Flags } from "src/ts/utils/flags.ts";
import { notEmpty } from "src/ts/utils/types.ts";
import { migrateOldCustomEffects } from "./migrations/2024-08-14-migrate-old-custom-effects.ts";
import { abilityUpgrade } from "./changes/abilities.ts";
import { damageBonus } from "./changes/bonuses.ts";
import { conditions } from "./defined-effects/conditions.ts";
import { other } from "./defined-effects/other.ts";
import { spells } from "./defined-effects/spells.ts";
import { classFeatures } from "./defined-effects/class-features.ts";

class EffectDefinitionDnd5e extends EffectDefinition {
    override systemId: string = "dnd5e";

    override get initialItemEffects(): ItemEffects[] {
        return [
            conditions(),
            spells(),
            classFeatures(),
            this.#equipment,
            this.#magicItems,
            other(),
        ];
    }

    override get migrations(): MigrationType[] {
        return [migrateOldCustomEffects];
    }

    get #equipment(): ItemEffects {
        return {
            itemData: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Folders.Equipment,
                ),
            },
            effects: [
                this.#bullseyeLantern,
                this.#candle,
                this.#hoodedLantern,
                this.#lantern,
                this.#torch,
            ],
        };
    }

    get #magicItems(): ItemEffects {
        return {
            itemData: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Folders.MagicItems,
                ),
            },
            effects: [
                // this.#armorOfInvulnerability, nested effect
                // this.#armorOfResistance, nested effect
                this.#amuletOfHealth,
                this.#beltOfDwarvenkind,
                this.#beltOfGiantStrength,
                this.#beltOfHillGiantStrength,
                this.#beltOfFrostGiantStrength,
                this.#beltOfStoneGiantStrength,
                this.#beltOfFireGiantStrength,
                this.#beltOfCloudGiantStrength,
                this.#beltOfStormGiantStrength,
                // this.#bootsOfElvenkind,
                // this.#bootsOfSpeed, // TODO maybe - it's an active effect
                // this.#bootsOfTheWinterlands,
                this.#bracersOfArchery,
                this.#bracersOfDefense,
                // this.#broochOfShielding,
                // this.#broomOfFlying,
                // this.#cloakOfArachnida,
                // this.#cloakOfDisplacement,
                // this.#cloakOfElvenkind,
                // this.#cloakOfProtection
                // this.#cloakOfTheMantaRay,
                // this.#eyesOfTheEagle,
                // this.#gauntletsOfOgrePower,
                // this.#gogglesOfNight,
                // this.#headbandOfIntellect,
                // this.#robeOfEyes,
                // this.#robeOfStars,
                // this.#robeOfTheArchmagi,
                // this.#iounStone,
                // this.#mantleOfSpellResistance,
                // this.#periaptOfHealth,
                // this.#periaptOfProofAgainstPoison,
                // this.#stoneOfGoodLuck,
                // this.#wingedBoots, // TODO maybe
                // this.#wingsOfFlying, // TODO maybe
                this.#ringOfAcidResistance,
                // this.#ringOfFreeAction,
                // this.#ringOfProtection,
                // this.#ringOfResistance,
                // this.#ringOfSwimming,
                // this.#ringOfWarmth
                // TODO oils? https://www.5esrd.com/gamemastering/magic-items/potions-oils/
            ],
        };
    }

    get #amuletOfHealth(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.AmuletOfHealth.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.AmuletOfHealth.description,
                ),
                img: "icons/equipment/neck/pendant-faceted-red.webp",
                changes: [
                    {
                        key: "system.abilities.con.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
                        value: "19",
                    },
                ],
            },
            isTemporary: false,
        });
    }

    get #beltOfDwarvenkind(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfDwarvenkind.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfDwarvenkind.description,
                ),
                img: "icons/equipment/waist/belt-armored-steel.webp",
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "poison",
                    },
                    {
                        key: "system.attributes.senses.darkvision",
                        mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
                        value: "60",
                        priority: 5,
                    },
                    {
                        key: "ATL.sight.range",
                        mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
                        value: "60",
                        priority: 5,
                    },
                    {
                        key: "ATL.sight.visionMode",
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "darkvision",
                        priority: 5,
                    },
                    {
                        key: "system.traits.languages.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "dwarvish",
                    },
                    {
                        key: "system.abilities.con.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "2",
                        priority: 5,
                    },
                    {
                        key: "system.abilities.con.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.DOWNGRADE,
                        value: "20",
                        priority: 50,
                    },
                ],
            },
            isTemporary: false,
        });
    }

    get #beltOfGiantStrength(): PreCreate<ActiveEffectSource> {
        const nestedEffectIds = [
            this.#beltOfHillGiantStrength,
            this.#beltOfStoneGiantStrength,
            this.#beltOfFrostGiantStrength,
            this.#beltOfFireGiantStrength,
            this.#beltOfCloudGiantStrength,
            this.#beltOfStormGiantStrength,
        ]
            .map((effect) => Flags.getCeEffectId(effect))
            .filter(notEmpty);
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfGiantStrength.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfGiantStrength
                        .description,
                ),
                img: "icons/equipment/waist/belt-armored-steel.webp",
            },
            nestedEffectIds,
            isTemporary: false,
        });
    }

    get #beltOfHillGiantStrength(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfHillGiantStrength.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfHillGiantStrength
                        .description,
                ),
                img: "icons/equipment/waist/belt-buckle-square-leather-brown.webp",
                changes: [
                    abilityUpgrade({
                        ability: "str",
                        value: "21",
                    }),
                ],
            },
            isTemporary: false,
        });
    }

    get #beltOfStoneGiantStrength(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfStoneGiantStrength.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfStoneGiantStrength
                        .description,
                ),
                img: "icons/equipment/waist/belt-armored-steel.webp",
                changes: [
                    abilityUpgrade({
                        ability: "str",
                        value: "23",
                    }),
                ],
            },
            isTemporary: false,
        });
    }

    get #beltOfFrostGiantStrength(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfFrostGiantStrength.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfFrostGiantStrength
                        .description,
                ),
                img: "icons/equipment/waist/cloth-sash-purple.webp",
                changes: [
                    abilityUpgrade({
                        ability: "str",
                        value: "23",
                    }),
                ],
            },
            isTemporary: false,
        });
    }

    get #beltOfFireGiantStrength(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfFireGiantStrength.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfFireGiantStrength
                        .description,
                ),
                img: "icons/equipment/waist/belt-coiled-leather-steel.webp",
                changes: [
                    abilityUpgrade({
                        ability: "str",
                        value: "25",
                    }),
                ],
            },
            isTemporary: false,
        });
    }

    get #beltOfCloudGiantStrength(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfCloudGiantStrength.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfCloudGiantStrength
                        .description,
                ),
                img: "icons/equipment/waist/belt-thick-gemmed-steel-grey.webp",
                changes: [
                    abilityUpgrade({
                        ability: "str",
                        value: "27",
                    }),
                ],
            },
            isTemporary: false,
        });
    }

    get #beltOfStormGiantStrength(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfStormGiantStrength.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BeltOfStormGiantStrength
                        .description,
                ),
                img: "icons/equipment/waist/sash-cloth-gold-purple.webp",
                changes: [
                    abilityUpgrade({
                        ability: "str",
                        value: "29",
                    }),
                ],
            },
            isTemporary: false,
        });
    }

    get #bracersOfArchery(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BracersOfArchery.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BracersOfArchery.description,
                ),
                img: "icons/equipment/wrist/bracer-banded-leather.webp",
                changes: [
                    damageBonus({
                        damageType: "rwak",
                        value: "2",
                    }),
                    {
                        key: "system.traits.weaponProf.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "longbow",
                    },
                    {
                        key: "system.traits.weaponProf.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "shortbow",
                    },
                ],
            },
            isTemporary: false,
        });
    }

    get #bracersOfDefense(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BracersOfDefense.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BracersOfDefense.description,
                ),
                img: "icons/equipment/wrist/bracer-yellow-fancy.webp",
                changes: [
                    {
                        key: "system.attributes.ac.bonus",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "2",
                    },
                ],
            },
            isTemporary: false,
        });
    }

    get #ringOfAcidResistance(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.RingOfAcidResistance.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.RingOfAcidResistance
                        .description,
                ),
                img: "icons/equipment/finger/ring-band-engraved-scrolls-silver.webp",
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "acid",
                    },
                ],
            },
            isTemporary: false,
        });
    }

    get #bullseyeLantern(): PreCreate<ActiveEffectSource> {
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

    get #candle(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Candle.name,
                ),
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

    get #hoodedLantern(): PreCreate<ActiveEffectSource> {
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

    get #lantern(): PreCreate<ActiveEffectSource> {
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

    get #torch(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Torch.name,
                ),
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
}

export { EffectDefinitionDnd5e };
