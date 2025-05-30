import { createConvenientEffect } from "src/ts/utils/creates.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { ItemEffects } from "../../effect-definition.ts";
import { Flags } from "src/ts/utils/flags.ts";
import { notEmpty } from "src/ts/utils/types.ts";
import {
    addAbility,
    downgradeAbility,
    upgradeAbility,
} from "../changes/abilities.ts";
import {
    attackBonus,
    checkBonus,
    damageBonus,
    saveBonus,
    spellDcBonus,
} from "../changes/bonuses.ts";
import {
    addConditionImmunity,
    addDamageImmunity,
    addDamageResistance,
    addLanguage,
    addWeaponProficiency,
} from "../changes/traits.ts";
import {
    acBonus,
    acCalc,
    acFormula,
    addDarkvision,
    upgradeDarkvision,
    upgradeMovement,
    upgradeTrueSight,
} from "../changes/attributes.ts";
import { atlSightRange, atlSightVisionMode } from "../changes/atl.ts";
import {
    advantageSkill,
    grantDisadvantageAttack,
    magicResistanceSaves,
} from "../changes/midi-qol.ts";

function magicItems(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.Folders.MagicItems",
            ),
        },
        effects: [
            amuletOfHealth(),
            beltOfDwarvenkind(),
            beltOfGiantStrength(),
            beltOfHillGiantStrength(),
            beltOfFrostGiantStrength(),
            beltOfStoneGiantStrength(),
            beltOfFireGiantStrength(),
            beltOfCloudGiantStrength(),
            beltOfStormGiantStrength(),
            bootsOfElvenkind(),
            // bootsOfSpeed(), // TODO maybe - it's an active effect
            bootsOfTheWinterlands(),
            bracersOfArchery(),
            bracersOfDefense(),
            broochOfShielding(),
            // broomOfFlying(),
            // cloakOfArachnida(),
            cloakOfDisplacement(),
            cloakOfElvenkind(),
            cloakOfProtection(),
            cloakOfTheMantaRay(),
            eyesOfTheEagle(),
            gauntletsOfOgrePower(),
            gogglesOfNight(),
            headbandOfIntellect(),
            robeOfEyes(),
            robeOfStars(),
            robeOfTheArchmagi(),
            // iounStone(), // TODO lots of nested effects
            mantleOfSpellResistance(),
            periaptOfHealth(),
            periaptOfProofAgainstPoison(),
            stoneOfGoodLuck(),
            // wingedBoots, // TODO maybe
            // wingsOfFlying, // TODO maybe
            ringOfFreeAction(),
            ringOfResistance(),
            ringOfAcidResistance(),
            ringOfColdResistance(),
            ringOfFireResistance(),
            ringOfForceResistance(),
            ringOfLightningResistance(),
            ringOfNecroticResistance(),
            ringOfPoisonResistance(),
            ringOfPsychicResistance(),
            ringOfRadiantResistance(),
            ringOfThunderResistance(),
            ringOfSwimming(),
            ringOfWarmth(),
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
                upgradeAbility({
                    ability: "con",
                    value: "19",
                }),
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
                addDamageResistance({
                    damageType: "poison",
                }),
                upgradeDarkvision({
                    value: "60",
                    priority: 5,
                }),
                atlSightRange({
                    value: "60",
                    priority: 5,
                }),
                atlSightVisionMode({
                    value: "darkvision",
                    priority: 5,
                }),
                addLanguage({
                    language: "dwarvish",
                }),
                addAbility({
                    ability: "con",
                    value: "2",
                    priority: 5,
                }),
                downgradeAbility({
                    ability: "con",
                    value: "20",
                    priority: 50,
                }),
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
                upgradeAbility({
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
                upgradeAbility({
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
                upgradeAbility({
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
                upgradeAbility({
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
                upgradeAbility({
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
                upgradeAbility({
                    ability: "str",
                    value: "29",
                }),
            ],
        },
        isTemporary: false,
    });
}

function bootsOfElvenkind(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BootsOfElvenkind.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BootsOfElvenkind.description",
            ),
            img: "icons/equipment/feet/boots-pointed-cloth-green.webp",
            changes: [advantageSkill({ skillType: "ste" })],
        },
        isTemporary: false,
    });
}

function bootsOfTheWinterlands(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BootsOfTheWinterlands.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BootsOfTheWinterlands.description",
            ),
            img: "icons/equipment/feet/boots-leather-banded-furred.webp",
            changes: [addDamageResistance({ damageType: "cold" })],
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
                addWeaponProficiency({
                    weapon: "longbow",
                }),
                addWeaponProficiency({
                    weapon: "shortbow",
                }),
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
                acBonus({
                    value: "2",
                }),
            ],
        },
        isTemporary: false,
    });
}

function broochOfShielding(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BroochOfShielding.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BroochOfShielding.description",
            ),
            img: "icons/equipment/neck/pendant-bronze-gem-blue.webp",
            changes: [addDamageResistance({ damageType: "force" })],
        },
        isTemporary: false,
    });
}

function cloakOfDisplacement(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.CloakOfDisplacement.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.CloakOfDisplacement.description",
            ),
            img: "icons/equipment/back/cloak-brown-accent-brown-layered-collared-fur.webp",
            changes: [grantDisadvantageAttack({ attackType: "all" })],
        },
        isTemporary: false,
    });
}

function cloakOfElvenkind(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.CloakOfElvenkind.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.CloakOfElvenkind.description",
            ),
            img: "icons/equipment/back/cloak-collared-feathers-green.webp",
            changes: [advantageSkill({ skillType: "ste" })],
        },
        isTemporary: false,
    });
}

function cloakOfProtection(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.CloakOfProtection.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.CloakOfProtection.description",
            ),
            img: "icons/equipment/back/cloak-heavy-fur-blue.webp",
            changes: [
                acBonus({
                    value: "+1",
                }),
                saveBonus({
                    value: "+1",
                }),
            ],
        },
        isTemporary: false,
    });
}

function cloakOfTheMantaRay(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.CloakOfTheMantaRay.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.CloakOfTheMantaRay.description",
            ),
            img: "icons/equipment/head/hood-cloth-teal-gold.webp",
            changes: [
                upgradeMovement({
                    movementType: "swim",
                    value: "60",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfResistance(): PreCreate<ActiveEffectSource> {
    const nestedEffectIds = [
        ringOfAcidResistance(),
        ringOfColdResistance(),
        ringOfFireResistance(),
        ringOfForceResistance(),
        ringOfLightningResistance(),
        ringOfNecroticResistance(),
        ringOfPoisonResistance(),
        ringOfPsychicResistance(),
        ringOfRadiantResistance(),
        ringOfThunderResistance(),
    ]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);

    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfResistance.description",
            ),
            img: "icons/equipment/finger/ring-faceted-silver-orange.webp",
        },
        nestedEffectIds,
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
                addDamageResistance({
                    damageType: "acid",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfColdResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfColdResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfColdResistance.description",
            ),
            img: "icons/equipment/finger/ring-faceted-silver-orange.webp",
            changes: [
                addDamageResistance({
                    damageType: "cold",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfFireResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfFireResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfFireResistance.description",
            ),
            img: "icons/equipment/finger/ring-cabochon-gold-orange.webp",
            changes: [
                addDamageResistance({
                    damageType: "fire",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfForceResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfForceResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfForceResistance.description",
            ),
            img: "icons/equipment/finger/ring-faceted-gold-purple.webp",
            changes: [
                addDamageResistance({
                    damageType: "force",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfLightningResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfLightningResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfLightningResistance.description",
            ),
            img: "icons/equipment/finger/ring-cabochon-gold-orange.webp",
            changes: [
                addDamageResistance({
                    damageType: "lightning",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfNecroticResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfNecroticResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfNecroticResistance.description",
            ),
            img: "icons/equipment/finger/ring-band-engraved-scrolls-silver.webp",
            changes: [
                addDamageResistance({
                    damageType: "necrotic",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfPoisonResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfPoisonResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfPoisonResistance.description",
            ),
            img: "icons/equipment/finger/ring-faceted-gold-purple.webp",
            changes: [
                addDamageResistance({
                    damageType: "poison",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfPsychicResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfPsychicResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfPsychicResistance.description",
            ),
            img: "icons/equipment/finger/ring-cabochon-notched-gold-green.webp",
            changes: [
                addDamageResistance({
                    damageType: "psychic",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfRadiantResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfRadiantResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfRadiantResistance.description",
            ),
            img: "icons/equipment/finger/ring-inlay-red.webp",
            changes: [
                addDamageResistance({
                    damageType: "radiant",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfThunderResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfThunderResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfThunderResistance.description",
            ),
            img: "icons/equipment/finger/ring-faceted-silver-orange.webp",
            changes: [
                addDamageResistance({
                    damageType: "thunder",
                }),
            ],
        },
        isTemporary: false,
    });
}

function eyesOfTheEagle(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.EyesOfTheEagle.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.EyesOfTheEagle.description",
            ),
            img: "icons/equipment/head/goggles-leather-blue.webp",
            changes: [
                advantageSkill({
                    skillType: "prc",
                }),
            ],
        },
        isTemporary: false,
    });
}

function gauntletsOfOgrePower(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.GauntletsOfOgrePower.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.GauntletsOfOgrePower.description",
            ),
            img: "icons/equipment/hand/gauntlet-armored-steel-grey.webp",
            changes: [
                upgradeAbility({
                    ability: "str",
                    value: "19",
                }),
            ],
        },
        isTemporary: false,
    });
}

function gogglesOfNight(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.GogglesOfNight.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.GogglesOfNight.description",
            ),
            img: "icons/equipment/head/goggles-leather-blue.webp",
            changes: [addDarkvision({ value: "60" })],
        },
        isTemporary: false,
    });
}

function headbandOfIntellect(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.HeadbandOfIntellect.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.HeadbandOfIntellect.description",
            ),
            img: "icons/equipment/finger/ring-cabochon-silver-gold-red.webp",
            changes: [
                upgradeAbility({
                    ability: "int",
                    value: "19",
                }),
            ],
        },
        isTemporary: false,
    });
}

function robeOfEyes(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.RobeOfEyes.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RobeOfEyes.description",
            ),
            img: "icons/equipment/head/hood-red.webp",
            changes: [
                advantageSkill({
                    skillType: "prc",
                }),
                upgradeDarkvision({
                    value: "120",
                }),
                upgradeTrueSight({
                    value: "120",
                }),
            ],
        },
        isTemporary: false,
    });
}

function robeOfStars(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.RobeOfStars.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RobeOfStars.description",
            ),
            img: "icons/equipment/back/cloak-plain-blue.webp",
            changes: [
                saveBonus({
                    value: "+1",
                }),
            ],
        },
        isTemporary: false,
    });
}

function robeOfTheArchmagi(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RobeOfTheArchmagi.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RobeOfTheArchmagi.description",
            ),
            img: "icons/equipment/back/cloak-plain-white.webp",
            changes: [
                acCalc({
                    value: "custom",
                }),
                acFormula({
                    value: "15 + @abilities.dex.mod",
                }),
                magicResistanceSaves(),
                attackBonus({
                    attackType: "spell",
                    value: "+2",
                }),
                spellDcBonus({
                    value: "+2",
                }),
            ],
        },
        isTemporary: false,
    });
}

function mantleOfSpellResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.MantleOfSpellResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.MantleOfSpellResistance.description",
            ),
            img: "icons/equipment/back/cape-layered-violet-white-swirl.webp",
            changes: [magicResistanceSaves()],
        },
        isTemporary: false,
    });
}

function periaptOfHealth(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.PeriaptOfHealth.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.PeriaptOfHealth.description",
            ),
            img: "icons/equipment/neck/pendant-faceted-red.webp",
            changes: [
                addConditionImmunity({
                    condition: "diseased",
                }),
            ],
        },
        isTemporary: false,
    });
}

function periaptOfProofAgainstPoison(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.PeriaptOfProofAgainstPoison.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.PeriaptOfProofAgainstPoison.description",
            ),
            img: "icons/equipment/neck/necklace-hook-brown.webp",
            changes: [
                addConditionImmunity({
                    condition: "poisoned",
                }),
                addDamageImmunity({
                    damageType: "poison",
                }),
            ],
        },
        isTemporary: false,
    });
}

function stoneOfGoodLuck(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.StoneOfGoodLuck.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.StoneOfGoodLuck.description",
            ),
            img: "icons/commodities/gems/gem-rough-rectangle-red.webp",
            changes: [
                saveBonus({
                    value: "+1",
                }),
                checkBonus({
                    value: "+1",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfFreeAction(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfFreeAction.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfFreeAction.description",
            ),
            img: "icons/equipment/finger/ring-cabochon-notched-gold-green.webp",
            changes: [
                addConditionImmunity({
                    condition: "paralyzed",
                }),
                addConditionImmunity({
                    condition: "restrained",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfSwimming(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfSwimming.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfSwimming.description",
            ),
            img: "icons/equipment/finger/ring-cabochon-notched-gold-green.webp",
            changes: [
                upgradeMovement({
                    movementType: "swim",
                    value: "40",
                }),
            ],
        },
        isTemporary: false,
    });
}

function ringOfWarmth(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.RingOfWarmth.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RingOfWarmth.description",
            ),
            img: "icons/equipment/finger/ring-cabochon-gold-orange.webp",
            changes: [
                addDamageResistance({
                    damageType: "cold",
                }),
            ],
        },
        isTemporary: false,
    });
}
export { magicItems };
