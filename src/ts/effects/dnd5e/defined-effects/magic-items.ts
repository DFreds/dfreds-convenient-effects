import { createConvenientEffect } from "src/ts/utils/creates.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { ItemEffects } from "../../effect-definition.ts";
import { Flags } from "src/ts/utils/flags.ts";
import { notEmpty } from "src/ts/utils/types.ts";
import { abilityUpgrade } from "../changes/abilities.ts";
import { damageBonus } from "../changes/bonuses.ts";

function magicItems(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.Folders.MagicItems",
            ),
        },
        effects: [
            // this.#armorOfInvulnerability, nested effect
            // this.#armorOfResistance, nested effect
            amuletOfHealth(),
            beltOfDwarvenkind(),
            beltOfGiantStrength(),
            beltOfHillGiantStrength(),
            beltOfFrostGiantStrength(),
            beltOfStoneGiantStrength(),
            beltOfFireGiantStrength(),
            beltOfCloudGiantStrength(),
            beltOfStormGiantStrength(),
            // this.#bootsOfElvenkind,
            // this.#bootsOfSpeed, // TODO maybe - it's an active effect
            // this.#bootsOfTheWinterlands,
            bracersOfArchery(),
            bracersOfDefense(),
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
            ringOfAcidResistance(),
            // this.#ringOfFreeAction,
            // this.#ringOfProtection,
            // this.#ringOfResistance,
            // this.#ringOfSwimming,
            // this.#ringOfWarmth
            // TODO oils? https://www.5esrd.com/gamemastering/magic-items/potions-oils/
        ],
    };
}

function amuletOfHealth(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.AmuletOfHealth.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.AmuletOfHealth.description",
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

function beltOfDwarvenkind(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfDwarvenkind.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfDwarvenkind.description",
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

function beltOfGiantStrength(): PreCreate<ActiveEffectSource> {
    const nestedEffectIds = [
        beltOfHillGiantStrength(),
        beltOfStoneGiantStrength(),
        beltOfFrostGiantStrength(),
        beltOfFireGiantStrength(),
        beltOfCloudGiantStrength(),
        beltOfStormGiantStrength(),
    ]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfGiantStrength.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfGiantStrength.description",
            ),
            img: "icons/equipment/waist/belt-armored-steel.webp",
        },
        nestedEffectIds,
        isTemporary: false,
    });
}

function beltOfHillGiantStrength(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfHillGiantStrength.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfHillGiantStrength.description",
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

function beltOfStoneGiantStrength(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfStoneGiantStrength.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfStoneGiantStrength.description",
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

function beltOfFrostGiantStrength(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfFrostGiantStrength.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfFrostGiantStrength.description",
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

function beltOfFireGiantStrength(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfFireGiantStrength.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfFireGiantStrength.description",
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

function beltOfCloudGiantStrength(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfCloudGiantStrength.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfCloudGiantStrength.description",
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

function beltOfStormGiantStrength(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfStormGiantStrength.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BeltOfStormGiantStrength.description",
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

function bracersOfArchery(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BracersOfArchery.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BracersOfArchery.description",
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

function bracersOfDefense(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BracersOfDefense.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BracersOfDefense.description",
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

function ringOfAcidResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfAcidResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfAcidResistance.description",
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

export { magicItems };
