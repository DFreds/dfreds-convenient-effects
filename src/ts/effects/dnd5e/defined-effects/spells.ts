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

function spells(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Folders.Spells,
            ),
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.AcidArrow.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.AcidArrow.description,
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
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Aid.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Aid.description,
            ),
            img: "icons/magic/life/heart-cross-blue.webp",
            duration: { seconds: SECONDS.IN_EIGHT_HOURS },
        },
    });
}

function alterSelf(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.AlterSelf.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.AlterSelf.description,
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
                EN_JSON.ConvenientEffects.Dnd.AntilifeShell.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.AntilifeShell.description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-teal.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
        },
    });
}

function arcaneHand(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ArcaneHand.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ArcaneHand.description,
            ),
            img: "icons/magic/fire/projectile-fireball-smoke-strong-teal.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
        },
    });
}

function bane(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Bane.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Bane.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Barkskin.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Barkskin.description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.attributes.ac.formula",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "16",
                    priority: 50,
                },
                {
                    key: "system.attributes.ac.calc",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "custom",
                    priority: 50,
                },
            ],
        },
    });
}

function beaconOfHope(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BeaconOfHope.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BeaconOfHope.description,
            ),
            img: "icons/magic/light/explosion-star-large-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: `flags.midi-qol.advantage.ability.save.wis`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.advantage.deathSave`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function blackTentacles(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BlackTentacles.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BlackTentacles.description,
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
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Bless.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Bless.description,
            ),
            img: "icons/magic/control/buff-flight-wings-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "system.bonuses.abilities.save",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+1d4",
                },
                {
                    key: "system.bonuses.msak.attack",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+1d4",
                },
                {
                    key: "system.bonuses.mwak.attack",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+1d4",
                },
                {
                    key: "system.bonuses.rsak.attack",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+1d4",
                },
                {
                    key: "system.bonuses.rwak.attack",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+1d4",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "bloom",
                },
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
                EN_JSON.ConvenientEffects.Dnd.BlindnessDeafness.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BlindnessDeafness.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Blindness.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Blindness.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Deafness.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Deafness.description,
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
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Blur.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Blur.description,
            ),
            img: "icons/magic/air/air-burst-spiral-blue-gray.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: `flags.midi-qol.grants.disadvantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "blur",
                },
            ],
        },
    });
}

function charmPerson(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.CharmPerson.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.CharmPerson.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Command.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Command.description,
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
                EN_JSON.ConvenientEffects.Dnd.ComprehendLanguages.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ComprehendLanguages.description,
            ),
            img: "icons/magic/symbols/runes-triangle-orange-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.traits.languages.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Contagion.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Contagion.description,
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
                EN_JSON.ConvenientEffects.Dnd.BlindingSickness.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BlindingSickness.description,
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                {
                    key: `flags.midi-qol.disadvantage.ability.save.wis`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.check.wis`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                ...(blinded().changes ?? []),
            ],
        },
    });
}

function contagionFilthFever(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FilthFever.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FilthFever.description,
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                {
                    key: `flags.midi-qol.disadvantage.ability.save.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.check.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.attack.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function contagionFleshRot(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FleshRot.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FleshRot.description,
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                {
                    key: `flags.midi-qol.disadvantage.ability.check.cha`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: "system.traits.dv.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function contagionMindfire(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Mindfire.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Mindfire.description,
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                {
                    key: `flags.midi-qol.disadvantage.ability.save.int`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.check.int`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function contagionSeizure(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Seizure.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Seizure.description,
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                {
                    key: `flags.midi-qol.disadvantage.ability.save.dex`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.check.dex`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.attack.dex`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function contagionSlimyDoom(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SlimyDoom.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SlimyDoom.description,
            ),
            img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_WEEK },
            changes: [
                {
                    key: `flags.midi-qol.disadvantage.ability.save.con`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.check.con`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function darkvision(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Darkvision.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Darkvision.description,
            ),
            img: "icons/magic/perception/eye-ringed-glow-angry-small-red.webp",
            duration: { seconds: SECONDS.IN_EIGHT_HOURS },
            changes: [
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
            ],
        },
    });
}

function disguiseSelf(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.DisguiseSelf.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.DisguiseSelf.description,
            ),
            img: "icons/magic/control/debuff-energy-hold-teal-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
        },
    });
}

function divineFavor(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.DivineFavor.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.DivineFavor.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.DivineWord.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.DivineWord.description,
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
                EN_JSON.ConvenientEffects.Dnd.EnhanceAbility.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.EnhanceAbility.description,
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
                EN_JSON.ConvenientEffects.Dnd.BearsEndurance.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BearsEndurance.description,
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: `flags.midi-qol.advantage.ability.check.con`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function enhanceAbilityBullsStrength(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BullsStrength.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BullsStrength.description,
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: `flags.midi-qol.advantage.ability.check.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: "system.attributes.encumbrance.max",
                    mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
                    value: "2",
                    priority: 5,
                },
            ],
        },
    });
}

function enhanceAbilityCatsGrace(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.CatsGrace.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.CatsGrace.description,
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: `flags.midi-qol.advantage.ability.check.dex`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function enhanceAbilityEaglesSplendor(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.EaglesSplendor.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.EaglesSplendor.description,
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: `flags.midi-qol.advantage.ability.check.cha`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function enhanceAbilityFoxsCunning() {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FoxsCunning.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FoxsCunning.description,
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: `flags.midi-qol.advantage.ability.check.int`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function enhanceAbilityOwlsWisdom() {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.OwlsWisdom.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.OwlsWisdom.description,
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: `flags.midi-qol.advantage.ability.check.wis`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
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
                EN_JSON.ConvenientEffects.Dnd.EnlargeReduce.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.EnlargeReduce.description,
            ),
            img: "icons/magic/control/energy-stream-link-large-blue.webp",
        },
        nestedEffectIds,
    });
}

function enlargeReduceEnlarge(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Enlarge.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Enlarge.description,
            ),
            img: "icons/magic/control/energy-stream-link-large-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "system.bonuses.weapon.damage",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+1d4",
                },
                {
                    key: `flags.midi-qol.advantage.ability.check.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.advantage.ability.save.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
        isDynamic: true,
    });
}

function enlargeReduceReduce(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Reduce.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Reduce.description,
            ),
            img: "icons/magic/control/energy-stream-link-large-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "system.bonuses.weapon.damage",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "-1d4",
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.check.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.save.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
        isDynamic: true,
    });
}

function faerieFire(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FaerieFire.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FaerieFire.description,
            ),
            img: "icons/magic/fire/projectile-meteor-salvo-strong-teal.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: `flags.midi-qol.grants.advantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: "ATL.light.dim",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "10",
                },
                {
                    key: "ATL.light.color",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: COLORS.WHITE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.25",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "pulse","speed": 1,"intensity": 1}',
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "glow",
                },
            ],
        },
    });
}

function falseLife(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FalseLife.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FalseLife.description,
            ),
            img: "icons/magic/life/heart-cross-purple-orange.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
        },
    });
}

function featherFall(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FeatherFall.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FeatherFall.description,
            ),
            img: "icons/magic/air/wind-swirl-pink-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
        },
    });
}

function feeblemind(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Feeblemind.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Feeblemind.description,
            ),
            img: "icons/magic/light/explosion-star-large-teal-purple.webp",
            changes: [
                {
                    key: "system.abilities.int.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.DOWNGRADE,
                    value: "1",
                    priority: 25,
                },
                {
                    key: "system.abilities.cha.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.DOWNGRADE,
                    value: "1",
                    priority: 25,
                },
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FireShield.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FireShield.description,
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
                EN_JSON.ConvenientEffects.Dnd.FireShieldColdResistance.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FireShieldColdResistance
                    .description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-pentagon-red.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "cold",
                },
                {
                    key: "ATL.light.dim",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "20",
                },
                {
                    key: "ATL.light.bright",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "10",
                },
                {
                    key: "ATL.light.color",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: COLORS.FIRE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.25",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "torch", "speed": 3, "intensity": 1}',
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "fire",
                },
            ],
        },
    });
}

function fireShieldFireResistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FireShieldFireResistance.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FireShieldFireResistance
                    .description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-pentagon-blue.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "fire",
                },
                {
                    key: "ATL.light.dim",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "20",
                },
                {
                    key: "ATL.light.bright",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "10",
                },
                {
                    key: "ATL.light.color",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: COLORS.COLD_FIRE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.25",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "torch", "speed": 3, "intensity": 1}',
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "Fire v2 (coldfire)",
                },
            ],
        },
    });
}

function findThePath(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FindThePath.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FindThePath.description,
            ),
            img: "icons/magic/light/explosion-star-teal.webp",
            duration: { seconds: SECONDS.IN_ONE_DAY },
        },
    });
}

function fly(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Fly.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Fly.description,
            ),
            img: "icons/magic/control/energy-stream-link-white.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            statuses: ["flying"],
            changes: [
                {
                    key: "system.attributes.movement.fly",
                    mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
                    value: "60",
                    priority: 25,
                },
            ],
        },
    });
}

function foresight(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Foresight.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Foresight.description,
            ),
            img: "icons/magic/perception/eye-ringed-glow-angry-large-teal.webp",
            duration: { seconds: SECONDS.IN_EIGHT_HOURS },
            changes: [
                {
                    key: `flags.midi-qol.advantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.advantage.ability.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.advantage.ability.save.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: "flags.dnd5e.initiativeAdv",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.grants.disadvantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function freedomOfMovement(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FreedomOfMovement.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.FreedomOfMovement.description,
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
                EN_JSON.ConvenientEffects.Dnd.GlobeOfInvulnerability.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.GlobeOfInvulnerability
                    .description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-pentagon-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "warp-field",
                },
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
                EN_JSON.ConvenientEffects.Dnd.GreaterInvisibility.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.GreaterInvisibility.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Guidance.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Guidance.description,
            ),
            img: "icons/magic/control/buff-flight-wings-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: `flags.midi-qol.optional.guidance.label`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "Guidance",
                },
                {
                    key: `flags.midi-qol.optional.guidance.check.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "+1d4",
                },
                {
                    key: `flags.midi-qol.optional.guidance.skill.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "+1d4",
                },
            ],
        },
    });
}

function guidingBolt(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.GuidingBolt.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.GuidingBolt.description,
            ),
            img: "icons/magic/fire/projectile-fireball-smoke-large-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E, turns: 1 },
            flags: { dae: { specialDuration: ["isAttacked"] } },
            changes: [
                {
                    key: `flags.midi-qol.grants.advantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function haste(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Haste.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Haste.description,
            ),
            img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "system.attributes.ac.bonus",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+2",
                },
                {
                    key: `flags.midi-qol.advantage.ability.save.dex`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: "system.attributes.movement.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "*2",
                    priority: 25,
                },
            ],
        },
    });
}

function heroesFeast(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HeroesFeast.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HeroesFeast.description,
            ),
            img: "icons/magic/life/heart-cross-strong-flame-purple-orange.webp",
            duration: { seconds: SECONDS.IN_ONE_DAY },
            changes: [
                {
                    key: "system.traits.di.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "poison",
                },
                {
                    key: "system.traits.ci.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "frightened",
                },
                {
                    key: `flags.midi-qol.advantage.ability.save.wis`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function heroism(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Heroism.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Heroism.description,
            ),
            img: "icons/magic/life/heart-cross-strong-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "system.traits.ci.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "frightened",
                },
            ],
        },
    });
}

function hideousLaughter(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HideousLaughter.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HideousLaughter.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HoldMonster.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HoldMonster.description,
            ),
            img: "icons/magic/control/debuff-chains-ropes-red.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "mantle-of-madness",
                },
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HoldPerson.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HoldPerson.description,
            ),
            img: "icons/magic/control/debuff-chains-ropes-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "mantle-of-madness",
                },
            ],
        },
        subEffectIds,
    });
}

function holyAura(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HolyAura.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HolyAura.description,
            ),
            img: "icons/magic/control/buff-flight-wings-runes-blue-white.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: `flags.midi-qol.advantage.ability.save.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.grants.disadvantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: "ATL.light.dim",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "5",
                },
                {
                    key: "ATL.light.color",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: COLORS.WHITE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.25",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "sunburst", "speed": 2,"intensity": 4}',
                },
            ],
        },
    });
}

function huntersMark(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HuntersMark.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HuntersMark.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Invisibility.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Invisibility.description,
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
                EN_JSON.ConvenientEffects.Dnd.IrresistibleDance.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.IrresistibleDance.description,
            ),
            img: "icons/magic/control/debuff-chains-ropes-red.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "system.attributes.movement.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "0",
                    priority: 25,
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.save.dex`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.grants.advantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function jump(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Jump.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Jump.description,
            ),
            img: "icons/magic/control/debuff-energy-hold-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
        },
    });
}

function light(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Light.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Light.description,
            ),
            img: "icons/magic/light/explosion-star-small-blue-yellow.webp",
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
                    value: COLORS.WHITE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.25",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "pulse", "speed": 3,"intensity": 1}',
                },
            ],
        },
    });
}

function longstrider(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Longstrider.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Longstrider.description,
            ),
            img: "icons/magic/air/wind-stream-blue-gray.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                {
                    key: "system.attributes.movement.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "+10",
                    priority: 25,
                },
            ],
        },
    });
}

function mageArmor(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.MageArmor.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.MageArmor.description,
            ),
            img: "icons/magic/defensive/shield-barrier-glowing-triangle-blue.webp",
            duration: { seconds: SECONDS.IN_EIGHT_HOURS },
            changes: [
                {
                    key: "system.attributes.ac.calc",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "mage",
                    priority: 5,
                },
            ],
        },
    });
}

function mindBlank(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.MindBlank.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.MindBlank.description,
            ),
            img: "icons/magic/air/air-burst-spiral-large-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_DAY },
            changes: [
                {
                    key: "system.traits.di.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "psychic",
                },
            ],
        },
    });
}

function mirrorImage(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.MirrorImage.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.MirrorImage.description,
            ),
            img: "icons/magic/control/debuff-energy-hold-levitate-pink.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "images",
                },
            ],
        },
    });
}

function passWithoutTrace(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.PassWithoutTrace.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.PassWithoutTrace.description,
            ),
            img: "icons/magic/air/fog-gas-smoke-brown.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.skills.ste.bonuses.check",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+10",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "fog",
                },
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
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromEnergy.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromEnergy.description,
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
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromAcid.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromAcid.description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-acid.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "acid",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "clover",
                },
            ],
        },
    });
}

function protectionFromEnergyCold(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromCold.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromCold.description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "cold",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "pure-ice-aura",
                },
            ],
        },
    });
}

function protectionFromEnergyFire(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromFire.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromFire.description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-red.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "fire",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "pure-fire-aura",
                },
            ],
        },
    });
}

function protectionFromEnergyLightning(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromLightning.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromLightning
                    .description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "lightning",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "electric",
                },
            ],
        },
    });
}

function protectionFromEnergyThunder(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromThunder.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromThunder.description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-teal-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "thunder",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "shockwave",
                },
            ],
        },
    });
}

function protectionFromPoison(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromPoison.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromPoison.description,
            ),
            img: "icons/magic/defensive/shield-barrier-glowing-triangle-green.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "poison",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "bevel",
                },
            ],
        },
    });
}

function protectionFromEvilAndGood(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromEvilAndGood.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ProtectionFromEvilAndGood
                    .description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
        },
    });
}

function rayOfFrost(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.RayOfFrost.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.RayOfFrost.description,
            ),
            img: "icons/magic/light/beam-rays-blue-small.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E },
            changes: [
                {
                    key: "system.attributes.movement.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "-10",
                    priority: 25,
                },
            ],
        },
    });
}

function regenerate(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Regenerate.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Regenerate.description,
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
                EN_JSON.ConvenientEffects.Dnd.ResilientSphere.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ResilientSphere.description,
            ),
            img: "icons/magic/light/explosion-star-large-pink.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "system.attributes.movement.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "*0.5",
                    priority: 25,
                },
                {
                    key: "system.traits.di.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function resistance(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Resistance.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Resistance.description,
            ),
            img: "icons/magic/defensive/shield-barrier-glowing-triangle-orange.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: `flags.midi-qol.optional.resistance.label`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "Resistance",
                },
                {
                    key: `flags.midi-qol.optional.resistance.save.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "+1d4",
                },
            ],
        },
    });
}

function shield(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Shield.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Shield.description,
            ),
            img: "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E },
            flags: { dae: { specialDuration: ["turnStart"] } },
            changes: [
                {
                    key: "system.attributes.ac.bonus",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+5",
                    priority: 5,
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "water-field",
                },
            ],
        },
    });
}

function shieldOfFaith(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ShieldOfFaith.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ShieldOfFaith.description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                {
                    key: "system.attributes.ac.bonus",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+2",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "bloom",
                },
            ],
        },
    });
}

function slow(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Slow.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Slow.description,
            ),
            img: "icons/magic/air/fog-gas-smoke-dense-pink.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "system.attributes.ac.bonus",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "-2",
                },
                {
                    key: "system.abilities.dex.bonuses.save",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "-2",
                },
                {
                    key: "system.attributes.movement.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "*0.5",
                    priority: 25,
                },
            ],
        },
    });
}

function speakWithAnimals(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SpeakWithAnimals.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SpeakWithAnimals.description,
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
                EN_JSON.ConvenientEffects.Dnd.SpeakWithDead.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SpeakWithDead.description,
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
                EN_JSON.ConvenientEffects.Dnd.SpeakWithPlants.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SpeakWithPlants.description,
            ),
            img: "icons/magic/nature/leaf-glow-teal.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
        },
    });
}

function spiderClimb(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SpiderClimb.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SpiderClimb.description,
            ),
            img: "icons/magic/control/debuff-chains-blue.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                {
                    key: "system.attributes.movement.climb",
                    mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
                    value: "@attributes.movement.walk",
                    priority: 25,
                },
            ],
        },
    });
}

function spiritGuardians(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SpiritGuardians.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SpiritGuardians.description,
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
                EN_JSON.ConvenientEffects.Dnd.SpiritualWeapon.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.SpiritualWeapon.description,
            ),
            img: "icons/magic/fire/dagger-rune-enchant-flame-purple.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
        },
    });
}

function stoneskin(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Stoneskin.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Stoneskin.description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "physical",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "oldfilm",
                },
            ],
        },
    });
}

function suggestion(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Suggestion.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Suggestion.description,
            ),
            img: "icons/magic/air/air-burst-spiral-pink.webp",
            duration: { seconds: SECONDS.IN_EIGHT_HOURS },
        },
    });
}

function telekinesis(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Telekinesis.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Telekinesis.description,
            ),
            img: "icons/magic/control/debuff-energy-hold-levitate-yellow.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
        },
    });
}

function trueStrike(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.TrueStrike.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.TrueStrike.description,
            ),
            img: "icons/magic/fire/dagger-rune-enchant-blue-gray.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E, turns: 1 },
            flags: { dae: { specialDuration: ["1Attack"] } },
            changes: [
                {
                    key: `flags.midi-qol.advantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function viciousMockery(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ViciousMockery.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ViciousMockery.description,
            ),
            img: "icons/skills/toxins/cup-goblet-poisoned-spilled.webp",
            duration: { seconds: SECONDS.IN_ONE_ROUND_DND5E, turns: 1 },
            flags: { dae: { specialDuration: ["1Attack"] } },
            changes: [
                {
                    key: `flags.midi-qol.disadvantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function wardingBond(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.WardingBond.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.WardingBond.description,
            ),
            img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
            changes: [
                {
                    key: "system.attributes.ac.bonus",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+1",
                },
                {
                    key: "system.bonuses.abilities.save",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+1",
                },
                {
                    key: "system.traits.dr.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "physical",
                },
                {
                    key: "system.traits.dr.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "magical",
                },
            ],
        },
    });
}

function waterBreathing(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.WaterBreathing.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.WaterBreathing.description,
            ),
            img: "icons/magic/water/pseudopod-swirl-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_DAY },
        },
    });
}

function waterWalk(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.WaterWalk.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.WaterWalk.description,
            ),
            img: "icons/creatures/slimes/slime-movement-swirling-blue.webp",
            duration: { seconds: SECONDS.IN_ONE_HOUR },
        },
    });
}

export { spells };
