import { createConvenientEffect } from "src/ts/utils/creates.ts";
import { ItemEffects } from "../../effect-definition.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { COLORS, SECONDS } from "src/ts/constants.ts";
import { attackBonus, damageBonus, saveBonus } from "../changes/bonuses.ts";
import {
    blinded,
    charmed,
    deafened,
    incapacitated,
    invisible,
    paralyzed,
    prone,
    restrained,
} from "./conditions.ts";
import { Flags } from "src/ts/utils/flags.ts";
import { notEmpty } from "src/ts/utils/types.ts";
import {
    acBonus,
    acCalc,
    acFormula,
    upgradeDarkvision,
    movement,
    upgradeMovement,
    multiplyEncumbrance,
} from "../changes/attributes.ts";
import {
    advantageAbility,
    advantageAbilityCheck,
    advantageAbilitySave,
    advantageAttack,
    advantageDeathSave,
    disadvantageAbilityCheck,
    disadvantageAbilitySave,
    disadvantageAttack,
    grantAdvantageAttack,
    grantDisadvantageAttack,
    optionalAbilityCheck,
    optionalLabel,
    optionalSave,
    optionalSkill,
} from "../changes/midi-qol.ts";
import { tokenMagic } from "../changes/macros.ts";
import { abilitySaveBonus, downgradeAbility } from "../changes/abilities.ts";
import {
    addAllDamageImmunity,
    addAllDamageResistance,
    addAllDamageVulnerability,
    addAllLanguages,
    addConditionImmunity,
    addDamageImmunity,
    addDamageResistance,
} from "../changes/traits.ts";
import { atlLight, atlSightRange, atlSightVisionMode } from "../changes/atl.ts";
import { skillCheckBonus } from "../changes/skills.ts";
import { initiativeAdv } from "../changes/dnd5e.ts";

function spells(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Folders.Spells"),
        },
        effects: [
            acidArrow(),
            aid(),
            alterSelf(),
            antilifeShell(),
            arcaneHand(),
            bane(),
            barkskin(),
            beaconOfHope(),
            blackTentacles(),
            bless(),
            blindnessDeafness(),
            blindnessDeafnessBlindness(),
            blindnessDeafnessDeafness(),
            blur(),
            charmPerson(),
            command(),
            comprehendLanguages(),
            contagion(),
            contagionBlindingSickness(),
            contagionFilthFever(),
            contagionFleshRot(),
            contagionMindfire(),
            contagionSeizure(),
            contagionSlimyDoom(),
            darkvision(),
            disguiseSelf(),
            divineFavor(),
            divineWord(),
            enlargeReduce(),
            enlargeReduceEnlarge(),
            enlargeReduceReduce(),
            enhanceAbility(),
            enhanceAbilityBearsEndurance(),
            enhanceAbilityBullsStrength(),
            enhanceAbilityCatsGrace(),
            enhanceAbilityEaglesSplendor(),
            enhanceAbilityFoxsCunning(),
            enhanceAbilityOwlsWisdom(),
            faerieFire(),
            falseLife(),
            featherFall(),
            feeblemind(),
            fireShield(),
            fireShieldColdResistance(),
            fireShieldFireResistance(),
            findThePath(),
            fly(),
            foresight(),
            freedomOfMovement(),
            globeOfInvulnerability(),
            greaterInvisibility(),
            guidance(),
            guidingBolt(),
            haste(),
            heroesFeast(),
            heroism(),
            hideousLaughter(),
            holdMonster(),
            holdPerson(),
            holyAura(),
            huntersMark(),
            invisibility(),
            irresistibleDance(),
            jump(),
            light(),
            longstrider(),
            mageArmor(),
            mindBlank(),
            mirrorImage(),
            passWithoutTrace(),
            protectionFromEnergy(),
            protectionFromEnergyAcid(),
            protectionFromEnergyCold(),
            protectionFromEnergyFire(),
            protectionFromEnergyLightning(),
            protectionFromEnergyThunder(),
            protectionFromPoison(),
            protectionFromEvilAndGood(),
            rayOfFrost(),
            regenerate(),
            resilientSphere(),
            resistance(),
            shield(),
            shieldOfFaith(),
            slow(),
            speakWithAnimals(),
            speakWithDead(),
            speakWithPlants(),
            spiderClimb(),
            spiritGuardians(),
            spiritualWeapon(),
            stoneskin(),
            suggestion(),
            telekinesis(),
            trueStrike(),
            viciousMockery(),
            wardingBond(),
            waterBreathing(),
            waterWalk(),
        ],
    };
}

function acidArrow(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.AcidArrow.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.AcidArrow.description",
            ),
            img: "icons/magic/acid/projectile-bolts-salvo-green.webp",
            changes: [
                {
                    key: `flags.midi-qol.OverTime`,
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "turn=end,removeCondition=true,damageRoll=2d4,damageType=acid,label=Acid Arrow",
                },
            ],
        },
    });
}

function aid(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Aid.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Aid.description",
            ),
            img: "icons/magic/life/heart-cross-blue.webp",
            duration: { seconds: SECONDS.IN_EIGHT_HOURS },
        },
    });
}

function alterSelf(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.AlterSelf.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.AlterSelf.description",
            ),
            img: "icons/magic/control/debuff-energy-hold-green.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
        },
    });
}

function antilifeShell(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.AntilifeShell.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.AntilifeShell.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-teal.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
        },
    });
}

function arcaneHand(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.ArcaneHand.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ArcaneHand.description",
            ),
            img: "icons/magic/fire/projectile-fireball-smoke-strong-teal.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
        },
    });
}

function bane(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Bane.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Bane.description",
            ),
            img: "icons/magic/unholy/strike-beam-blood-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                saveBonus({
                    value: "-1d4",
                }),
                attackBonus({
                    attackType: "mwak",
                    value: "-1d4",
                }),
                attackBonus({
                    attackType: "msak",
                    value: "-1d4",
                }),
                attackBonus({
                    attackType: "rsak",
                    value: "-1d4",
                }),
                attackBonus({
                    attackType: "rwak",
                    value: "-1d4",
                }),
            ],
        },
    });
}

function barkskin(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Barkskin.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Barkskin.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                acFormula({
                    value: "16",
                    priority: 50,
                }),
                acCalc({
                    value: "custom",
                    priority: 50,
                }),
            ],
        },
    });
}

function beaconOfHope(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.BeaconOfHope.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BeaconOfHope.description",
            ),
            img: "icons/magic/light/explosion-star-large-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                advantageAbilitySave({
                    saveType: "wis",
                }),
                advantageDeathSave(),
            ],
        },
    });
}

function blackTentacles(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BlackTentacles.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BlackTentacles.description",
            ),
            img: "icons/magic/nature/vines-thorned-curled-glow-teal-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: restrained().changes,
        },
    });
}

function bless(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Bless.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Bless.description",
            ),
            img: "icons/magic/control/buff-flight-wings-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                saveBonus({
                    value: "+1d4",
                }),
                attackBonus({
                    attackType: "msak",
                    value: "+1d4",
                }),
                attackBonus({
                    attackType: "mwak",
                    value: "+1d4",
                }),
                attackBonus({
                    attackType: "rsak",
                    value: "+1d4",
                }),
                attackBonus({
                    attackType: "rwak",
                    value: "+1d4",
                }),
                tokenMagic({
                    value: "bloom",
                }),
            ],
        },
    });
}

function blindnessDeafness(): PreCreate<ActiveEffectSource> {
    const nestedEffectIds = [
        blindnessDeafnessBlindness(),
        blindnessDeafnessDeafness(),
    ]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BlindnessDeafness.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BlindnessDeafness.description",
            ),
            img: "icons/magic/perception/eye-ringed-glow-angry-red.webp",
        },
        nestedEffectIds,
    });
}

function blindnessDeafnessBlindness(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [Flags.getCeEffectId(blinded())].filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Blindness.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Blindness.description",
            ),
            img: "icons/magic/perception/eye-ringed-glow-angry-red.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
        },
        subEffectIds,
    });
}

function blindnessDeafnessDeafness(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [Flags.getCeEffectId(deafened())].filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Deafness.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Deafness.description",
            ),
            img: "icons/magic/perception/eye-ringed-glow-angry-red.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
        },
        subEffectIds,
    });
}

function blur(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Blur.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Blur.description",
            ),
            img: "icons/magic/air/air-burst-spiral-blue-gray.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                grantDisadvantageAttack({
                    attackType: "all",
                }),
                tokenMagic({
                    value: "blur",
                }),
            ],
        },
    });
}

function charmPerson(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.CharmPerson.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.CharmPerson.description",
            ),
            img: "icons/magic/fire/explosion-fireball-medium-purple-pink.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: charmed().changes,
        },
    });
}

function command(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Command.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Command.description",
            ),
            img: "icons/magic/fire/explosion-fireball-small-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E, turns: 1 },
        },
    });
}

function comprehendLanguages(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ComprehendLanguages.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ComprehendLanguages.description",
            ),
            img: "icons/magic/symbols/runes-triangle-orange-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [addAllLanguages()],
        },
    });
}

function contagion(): PreCreate<ActiveEffectSource> {
    const nestedEffectIds = [
        contagionBlindingSickness(),
        contagionFilthFever(),
        contagionFleshRot(),
        contagionMindfire(),
        contagionSeizure(),
        contagionSlimyDoom(),
    ]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Contagion.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Contagion.description",
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
        },
        nestedEffectIds,
    });
}

function contagionBlindingSickness(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BlindingSickness.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BlindingSickness.description",
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                disadvantageAbilitySave({
                    saveType: "wis",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "wis",
                }),
                ...(blinded().changes ?? []),
            ],
        },
    });
}

function contagionFilthFever(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.FilthFever.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FilthFever.description",
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                disadvantageAbilitySave({
                    saveType: "str",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "str",
                }),
                disadvantageAttack({
                    attackType: "str",
                }),
            ],
        },
    });
}

function contagionFleshRot(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.FleshRot.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FleshRot.description",
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                disadvantageAbilityCheck({
                    abilityCheckType: "cha",
                }),
                addAllDamageVulnerability(),
            ],
        },
    });
}

function contagionMindfire(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Mindfire.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Mindfire.description",
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                disadvantageAbilitySave({
                    saveType: "int",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "int",
                }),
            ],
        },
    });
}

function contagionSeizure(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Seizure.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Seizure.description",
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                disadvantageAbilitySave({
                    saveType: "dex",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "dex",
                }),
                disadvantageAttack({
                    attackType: "dex",
                }),
            ],
        },
    });
}

function contagionSlimyDoom(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.SlimyDoom.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.SlimyDoom.description",
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                disadvantageAbilitySave({
                    saveType: "con",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "con",
                }),
            ],
        },
    });
}

function darkvision(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Darkvision.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Darkvision.description",
            ),
            img: "icons/magic/perception/eye-ringed-glow-angry-small-red.webp",
            duration: { seconds: SECONDS.IN_EIGHT_HOURS },
            changes: [
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
            ],
        },
    });
}

function disguiseSelf(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.DisguiseSelf.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.DisguiseSelf.description",
            ),
            img: "icons/magic/control/debuff-energy-hold-teal-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
        },
    });
}

function divineFavor(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.DivineFavor.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.DivineFavor.description",
            ),
            img: "icons/magic/fire/dagger-rune-enchant-flame-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                damageBonus({
                    damageType: "weapon",
                    value: "+1d4[radiant]",
                }),
            ],
        },
    });
}

function divineWord(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.DivineWord.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.DivineWord.description",
            ),
            img: "icons/magic/light/explosion-star-large-orange-purple.webp",
        },
        isDynamic: true,
    });
}

function enhanceAbility(): PreCreate<ActiveEffectSource> {
    const nestedEffectIds = [
        enhanceAbilityBearsEndurance(),
        enhanceAbilityBullsStrength(),
        enhanceAbilityCatsGrace(),
        enhanceAbilityEaglesSplendor(),
        enhanceAbilityFoxsCunning(),
        enhanceAbilityOwlsWisdom(),
    ]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.EnhanceAbility.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.EnhanceAbility.description",
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
        },
        nestedEffectIds,
    });
}

function enhanceAbilityBearsEndurance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BearsEndurance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BearsEndurance.description",
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                advantageAbilityCheck({
                    abilityCheckType: "con",
                }),
            ],
        },
    });
}

function enhanceAbilityBullsStrength(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BullsStrength.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BullsStrength.description",
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                advantageAbilityCheck({
                    abilityCheckType: "str",
                }),
                multiplyEncumbrance({
                    value: "2",
                    priority: 5,
                }),
            ],
        },
    });
}

function enhanceAbilityCatsGrace(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.CatsGrace.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.CatsGrace.description",
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                advantageAbilityCheck({
                    abilityCheckType: "dex",
                }),
            ],
        },
    });
}

function enhanceAbilityEaglesSplendor(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.EaglesSplendor.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.EaglesSplendor.description",
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                advantageAbilityCheck({
                    abilityCheckType: "cha",
                }),
            ],
        },
    });
}

function enhanceAbilityFoxsCunning() {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.FoxsCunning.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FoxsCunning.description",
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                advantageAbilityCheck({
                    abilityCheckType: "int",
                }),
            ],
        },
    });
}

function enhanceAbilityOwlsWisdom() {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.OwlsWisdom.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.OwlsWisdom.description",
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                advantageAbilityCheck({
                    abilityCheckType: "wis",
                }),
            ],
        },
    });
}

function enlargeReduce(): PreCreate<ActiveEffectSource> {
    const nestedEffectIds = [enlargeReduceEnlarge(), enlargeReduceReduce()]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.EnlargeReduce.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.EnlargeReduce.description",
            ),
            img: "icons/magic/control/energy-stream-link-large-blue.webp",
        },
        nestedEffectIds,
    });
}

function enlargeReduceEnlarge(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Enlarge.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Enlarge.description",
            ),
            img: "icons/magic/control/energy-stream-link-large-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                damageBonus({
                    damageType: "weapon",
                    value: "+1d4",
                }),
                advantageAbilityCheck({
                    abilityCheckType: "str",
                }),
                advantageAbilitySave({
                    saveType: "str",
                }),
            ],
        },
        isDynamic: true,
    });
}

function enlargeReduceReduce(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Reduce.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Reduce.description",
            ),
            img: "icons/magic/control/energy-stream-link-large-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                damageBonus({
                    damageType: "weapon",
                    value: "-1d4",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "str",
                }),
                disadvantageAbilitySave({
                    saveType: "str",
                }),
            ],
        },
        isDynamic: true,
    });
}

function faerieFire(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.FaerieFire.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FaerieFire.description",
            ),
            img: "icons/magic/fire/projectile-meteor-salvo-strong-teal.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                grantAdvantageAttack({
                    attackType: "all",
                }),
                atlLight({
                    lightType: "dim",
                    value: "10",
                }),
                atlLight({
                    lightType: "color",
                    value: COLORS.WHITE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.25",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "pulse","speed": 1,"intensity": 1}',
                }),
                tokenMagic({
                    value: "glow",
                }),
            ],
        },
    });
}

function falseLife(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.FalseLife.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FalseLife.description",
            ),
            img: "icons/magic/life/heart-cross-purple-orange.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
        },
    });
}

function featherFall(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.FeatherFall.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FeatherFall.description",
            ),
            img: "icons/magic/air/wind-swirl-pink-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
        },
    });
}

function feeblemind(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Feeblemind.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Feeblemind.description",
            ),
            img: "icons/magic/light/explosion-star-large-teal-purple.webp",
            changes: [
                downgradeAbility({
                    ability: "int",
                    value: "1",
                    priority: 25,
                }),
                downgradeAbility({
                    ability: "cha",
                    value: "1",
                    priority: 25,
                }),
            ],
        },
    });
}

function fireShield(): PreCreate<ActiveEffectSource> {
    const nestedEffectIds = [
        fireShieldColdResistance(),
        fireShieldFireResistance(),
    ]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.FireShield.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FireShield.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-pentagon-red.webp",
        },
        nestedEffectIds,
    });
}

function fireShieldColdResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.FireShieldColdResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FireShieldColdResistance.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-pentagon-red.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                addDamageResistance({
                    damageType: "cold",
                }),
                atlLight({
                    lightType: "dim",
                    value: "20",
                }),
                atlLight({
                    lightType: "bright",
                    value: "10",
                }),
                atlLight({
                    lightType: "color",
                    value: COLORS.FIRE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.25",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "torch", "speed": 3, "intensity": 1}',
                }),
                tokenMagic({
                    value: "fire",
                }),
            ],
        },
    });
}

function fireShieldFireResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.FireShieldFireResistance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FireShieldFireResistance.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-pentagon-blue.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                addDamageResistance({
                    damageType: "fire",
                }),
                atlLight({
                    lightType: "dim",
                    value: "20",
                }),
                atlLight({
                    lightType: "bright",
                    value: "10",
                }),
                atlLight({
                    lightType: "color",
                    value: COLORS.COLD_FIRE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.25",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "torch", "speed": 3, "intensity": 1}',
                }),
                tokenMagic({
                    value: "Fire v2 (coldfire)",
                }),
            ],
        },
    });
}

function findThePath(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.FindThePath.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FindThePath.description",
            ),
            img: "icons/magic/light/explosion-star-teal.webp",
            duration: { seconds: SECONDS.IN_ONE_DAY },
        },
    });
}

function fly(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Fly.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Fly.description",
            ),
            img: "icons/magic/control/energy-stream-link-white.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            statuses: ["flying"],
            changes: [
                upgradeMovement({
                    movementType: "fly",
                    value: "60",
                    priority: 25,
                }),
            ],
        },
    });
}

function foresight(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Foresight.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Foresight.description",
            ),
            img: "icons/magic/perception/eye-ringed-glow-angry-large-teal.webp",
            duration: { seconds: SECONDS.IN_EIGHT_HOURS },
            changes: [
                advantageAttack({
                    attackType: "all",
                }),
                advantageAbility({
                    abilityType: "all",
                }),
                advantageAbilitySave({
                    saveType: "all",
                }),
                initiativeAdv(),
                grantDisadvantageAttack({
                    attackType: "all",
                }),
            ],
        },
    });
}

function freedomOfMovement(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.FreedomOfMovement.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.FreedomOfMovement.description",
            ),
            img: "icons/skills/melee/strike-blade-knife-white-red.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
        },
    });
}

function globeOfInvulnerability(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.GlobeOfInvulnerability.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.GlobeOfInvulnerability.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-pentagon-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                tokenMagic({
                    value: "warp-field",
                }),
            ],
        },
    });
}

function greaterInvisibility(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [invisible()]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.GreaterInvisibility.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.GreaterInvisibility.description",
            ),
            img: "icons/magic/air/fog-gas-smoke-swirling-gray.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            statuses: ["invisible"],
        },
        subEffectIds,
    });
}

function guidance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Guidance.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Guidance.description",
            ),
            img: "icons/magic/control/buff-flight-wings-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                optionalLabel({
                    key: "guidance",
                    label: "Guidance",
                }),
                optionalAbilityCheck({
                    key: "guidance",
                    abilityCheckType: "all",
                    value: "+1d4",
                }),
                optionalSkill({
                    key: "guidance",
                    skillType: "all",
                    value: "+1d4",
                }),
            ],
        },
    });
}

function guidingBolt(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.GuidingBolt.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.GuidingBolt.description",
            ),
            img: "icons/magic/fire/projectile-fireball-smoke-large-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E, turns: 1 },
            flags: { dae: { specialDuration: ["isAttacked"] } },
            changes: [
                grantAdvantageAttack({
                    attackType: "all",
                }),
            ],
        },
    });
}

function haste(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Haste.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Haste.description",
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                acBonus({
                    value: "+2",
                }),
                advantageAbilitySave({
                    saveType: "dex",
                }),
                movement({
                    movementType: "all",
                    value: "*2",
                    priority: 25,
                }),
            ],
        },
    });
}

function heroesFeast(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.HeroesFeast.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.HeroesFeast.description",
            ),
            img: "icons/magic/life/heart-cross-strong-flame-purple-orange.webp",
            duration: { seconds: SECONDS.IN_ONE_DAY },
            changes: [
                addDamageImmunity({
                    damageType: "poison",
                }),
                addConditionImmunity({
                    condition: "frightened",
                }),
                advantageAbilitySave({
                    saveType: "wis",
                }),
            ],
        },
    });
}

function heroism(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Heroism.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Heroism.description",
            ),
            img: "icons/magic/life/heart-cross-strong-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                addConditionImmunity({
                    condition: "frightened",
                }),
            ],
        },
    });
}

function hideousLaughter(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.HideousLaughter.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.HideousLaughter.description",
            ),
            img: "icons/magic/fire/explosion-fireball-medium-purple-pink.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                ...(incapacitated().changes ?? []),
                ...(prone().changes ?? []),
            ],
        },
    });
}

function holdMonster(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [paralyzed()]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.HoldMonster.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.HoldMonster.description",
            ),
            img: "icons/magic/control/debuff-chains-ropes-red.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                tokenMagic({
                    value: "mantle-of-madness",
                }),
            ],
        },
        subEffectIds,
    });
}

function holdPerson(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [paralyzed()]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.HoldPerson.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.HoldPerson.description",
            ),
            img: "icons/magic/control/debuff-chains-ropes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                tokenMagic({
                    value: "mantle-of-madness",
                }),
            ],
        },
        subEffectIds,
    });
}

function holyAura(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.HolyAura.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.HolyAura.description",
            ),
            img: "icons/magic/control/buff-flight-wings-runes-blue-white.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                advantageAbilitySave({
                    saveType: "all",
                }),
                grantDisadvantageAttack({
                    attackType: "all",
                }),
                atlLight({
                    lightType: "dim",
                    value: "5",
                }),
                atlLight({
                    lightType: "color",
                    value: COLORS.WHITE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.25",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "sunburst", "speed": 2,"intensity": 4}',
                }),
            ],
        },
    });
}

function huntersMark(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.HuntersMark.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.HuntersMark.description",
            ),
            img: "icons/magic/perception/eye-ringed-glow-angry-small-red.webp",
        },
    });
}

function invisibility(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [invisible()]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Invisibility.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Invisibility.description",
            ),
            img: "icons/magic/air/fog-gas-smoke-dense-gray.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            flags: { dae: { specialDuration: ["1Attack", "1Spell"] } },
            statuses: ["invisible"],
        },
        subEffectIds,
    });
}

function irresistibleDance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.IrresistibleDance.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.IrresistibleDance.description",
            ),
            img: "icons/magic/control/debuff-chains-ropes-red.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                movement({
                    movementType: "all",
                    value: "0",
                    priority: 25,
                }),
                disadvantageAbilitySave({
                    saveType: "dex",
                }),
                disadvantageAttack({
                    attackType: "all",
                }),
                grantAdvantageAttack({
                    attackType: "all",
                }),
            ],
        },
    });
}

function jump(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Jump.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Jump.description",
            ),
            img: "icons/magic/control/debuff-energy-hold-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
        },
    });
}

function light(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Light.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Light.description",
            ),
            img: "icons/magic/light/explosion-star-small-blue-yellow.webp",
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
                    value: COLORS.WHITE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.25",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "pulse", "speed": 3,"intensity": 1}',
                }),
            ],
        },
    });
}

function longstrider(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Longstrider.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Longstrider.description",
            ),
            img: "icons/magic/air/wind-stream-blue-gray.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                movement({
                    movementType: "all",
                    value: "+10",
                    priority: 25,
                }),
            ],
        },
    });
}

function mageArmor(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.MageArmor.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.MageArmor.description",
            ),
            img: "icons/magic/defensive/shield-barrier-glowing-triangle-blue.webp",
            duration: { seconds: SECONDS.IN_EIGHT_HOURS },
            changes: [
                acCalc({
                    value: "mage",
                    priority: 5,
                }),
            ],
        },
    });
}

function mindBlank(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.MindBlank.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.MindBlank.description",
            ),
            img: "icons/magic/air/air-burst-spiral-large-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_DAY },
            changes: [
                addDamageImmunity({
                    damageType: "psychic",
                }),
            ],
        },
    });
}

function mirrorImage(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.MirrorImage.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.MirrorImage.description",
            ),
            img: "icons/magic/control/debuff-energy-hold-levitate-pink.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                tokenMagic({
                    value: "images",
                }),
            ],
        },
    });
}

function passWithoutTrace(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.PassWithoutTrace.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.PassWithoutTrace.description",
            ),
            img: "icons/magic/air/fog-gas-smoke-brown.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                skillCheckBonus({
                    skillType: "ste",
                    value: "+10",
                }),
                tokenMagic({
                    value: "fog",
                }),
            ],
        },
    });
}

function protectionFromEnergy(): PreCreate<ActiveEffectSource> {
    const nestedEffectIds = [
        protectionFromEnergyAcid(),
        protectionFromEnergyCold(),
        protectionFromEnergyFire(),
        protectionFromEnergyLightning(),
        protectionFromEnergyThunder(),
    ]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromEnergy.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromEnergy.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-teal.webp",
        },
        nestedEffectIds,
    });
}

function protectionFromEnergyAcid(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromAcid.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromAcid.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-acid.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                addDamageResistance({
                    damageType: "acid",
                }),
                tokenMagic({
                    value: "clover",
                }),
            ],
        },
    });
}

function protectionFromEnergyCold(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromCold.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromCold.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                addDamageResistance({
                    damageType: "cold",
                }),
                tokenMagic({
                    value: "pure-ice-aura",
                }),
            ],
        },
    });
}

function protectionFromEnergyFire(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromFire.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromFire.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-red.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                addDamageResistance({
                    damageType: "fire",
                }),
                tokenMagic({
                    value: "pure-fire-aura",
                }),
            ],
        },
    });
}

function protectionFromEnergyLightning(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromLightning.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromLightning.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                addDamageResistance({
                    damageType: "lightning",
                }),
                tokenMagic({
                    value: "electric",
                }),
            ],
        },
    });
}

function protectionFromEnergyThunder(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromThunder.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromThunder.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-teal-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                addDamageResistance({
                    damageType: "thunder",
                }),
                tokenMagic({
                    value: "shockwave",
                }),
            ],
        },
    });
}

function protectionFromPoison(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromPoison.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromPoison.description",
            ),
            img: "icons/magic/defensive/shield-barrier-glowing-triangle-green.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                addDamageResistance({
                    damageType: "poison",
                }),
                tokenMagic({
                    value: "bevel",
                }),
            ],
        },
    });
}

function protectionFromEvilAndGood(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromEvilAndGood.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ProtectionFromEvilAndGood.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
        },
    });
}

function rayOfFrost(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.RayOfFrost.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RayOfFrost.description",
            ),
            img: "icons/magic/light/beam-rays-blue-small.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E },
            changes: [
                movement({
                    movementType: "all",
                    value: "-10",
                    priority: 25,
                }),
            ],
        },
    });
}

function regenerate(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Regenerate.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Regenerate.description",
            ),
            img: "icons/magic/life/heart-cross-strong-flame-green.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: `flags.midi-qol.OverTime.regenerate`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "label=Regenerate,turn=start,damageRoll=1,damageType=healing,condition=@attributes.hp.value > 0 && @attributes.hp.value < @attributes.hp.max",
                },
            ],
        },
    });
}

function resilientSphere(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ResilientSphere.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ResilientSphere.description",
            ),
            img: "icons/magic/light/explosion-star-large-pink.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                movement({
                    movementType: "all",
                    value: "*0.5",
                    priority: 25,
                }),
                addAllDamageImmunity(),
            ],
        },
    });
}

function resistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Resistance.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Resistance.description",
            ),
            img: "icons/magic/defensive/shield-barrier-glowing-triangle-orange.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                optionalLabel({
                    key: "resistance",
                    label: "Resistance",
                }),
                optionalSave({
                    key: "resistance",
                    saveType: "all",
                    value: "+1d4",
                }),
            ],
        },
    });
}

function shield(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Shield.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Shield.description",
            ),
            img: "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E },
            flags: { dae: { specialDuration: ["turnStart"] } },
            changes: [
                acBonus({
                    value: "+5",
                    priority: 5,
                }),
                tokenMagic({
                    value: "water-field",
                }),
            ],
        },
    });
}

function shieldOfFaith(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ShieldOfFaith.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ShieldOfFaith.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                acBonus({
                    value: "+2",
                }),
                tokenMagic({
                    value: "bloom",
                }),
            ],
        },
    });
}

function slow(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Slow.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Slow.description",
            ),
            img: "icons/magic/air/fog-gas-smoke-dense-pink.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                acBonus({
                    value: "-2",
                }),
                abilitySaveBonus({
                    ability: "dex",
                    value: "-2",
                }),
                movement({
                    movementType: "all",
                    value: "*0.5",
                    priority: 25,
                }),
            ],
        },
    });
}

function speakWithAnimals(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.SpeakWithAnimals.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.SpeakWithAnimals.description",
            ),
            img: "icons/magic/nature/wolf-paw-glow-small-teal-blue.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
        },
    });
}

function speakWithDead(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.SpeakWithDead.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.SpeakWithDead.description",
            ),
            img: "icons/magic/control/fear-fright-shadow-monster-green.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
        },
    });
}

function speakWithPlants(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.SpeakWithPlants.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.SpeakWithPlants.description",
            ),
            img: "icons/magic/nature/leaf-glow-teal.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
        },
    });
}

function spiderClimb(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.SpiderClimb.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.SpiderClimb.description",
            ),
            img: "icons/magic/control/debuff-chains-blue.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                upgradeMovement({
                    movementType: "climb",
                    value: "@attributes.movement.walk",
                    priority: 25,
                }),
            ],
        },
    });
}

function spiritGuardians(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.SpiritGuardians.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.SpiritGuardians.description",
            ),
            img: "icons/magic/light/projectile-bolts-salvo-white.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
        },
    });
}

function spiritualWeapon(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.SpiritualWeapon.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.SpiritualWeapon.description",
            ),
            img: "icons/magic/fire/dagger-rune-enchant-flame-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
        },
    });
}

function stoneskin(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Stoneskin.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Stoneskin.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                addDamageResistance({
                    damageType: "bludgeoning",
                }),
                addDamageResistance({
                    damageType: "piercing",
                }),
                addDamageResistance({
                    damageType: "slashing",
                }),
                tokenMagic({
                    value: "oldfilm",
                }),
            ],
        },
    });
}

function suggestion(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Suggestion.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Suggestion.description",
            ),
            img: "icons/magic/air/air-burst-spiral-pink.webp",
            duration: { seconds: SECONDS.IN_EIGHT_HOURS },
        },
    });
}

function telekinesis(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Telekinesis.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Telekinesis.description",
            ),
            img: "icons/magic/control/debuff-energy-hold-levitate-yellow.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
        },
    });
}

function trueStrike(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.TrueStrike.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.TrueStrike.description",
            ),
            img: "icons/magic/fire/dagger-rune-enchant-blue-gray.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E, turns: 1 },
            flags: { dae: { specialDuration: ["1Attack"] } },
            changes: [
                advantageAttack({
                    attackType: "all",
                }),
            ],
        },
    });
}

function viciousMockery(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ViciousMockery.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ViciousMockery.description",
            ),
            img: "icons/skills/toxins/cup-goblet-poisoned-spilled.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E, turns: 1 },
            flags: { dae: { specialDuration: ["1Attack"] } },
            changes: [
                disadvantageAttack({
                    attackType: "all",
                }),
            ],
        },
    });
}

function wardingBond(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.WardingBond.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.WardingBond.description",
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                acBonus({
                    value: "+1",
                }),
                saveBonus({
                    value: "+1",
                }),
                addAllDamageResistance(),
            ],
        },
    });
}

function waterBreathing(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.WaterBreathing.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.WaterBreathing.description",
            ),
            img: "icons/magic/water/pseudopod-swirl-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_DAY },
        },
    });
}

function waterWalk(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.WaterWalk.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.WaterWalk.description",
            ),
            img: "icons/creatures/slimes/slime-movement-swirling-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
        },
    });
}

export { spells };
