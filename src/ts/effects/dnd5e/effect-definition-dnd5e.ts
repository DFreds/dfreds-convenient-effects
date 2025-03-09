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

class EffectDefinitionDnd5e extends EffectDefinition {
    override systemId: string = "dnd5e";

    override get initialItemEffects(): ItemEffects[] {
        return [
            this.#conditions,
            this.#spells,
            this.#classFeatures,
            this.#equipment,
            this.#other,
        ];
    }

    override get migrations(): MigrationType[] {
        return [migrateOldCustomEffects];
    }

    get #conditions(): ItemEffects {
        return {
            itemData: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Folders.Conditions,
                ),
            },
            effects: [
                this.#blinded,
                this.#charmed,
                this.#concentrating,
                this.#dead,
                this.#deafened,
                this.#exhaustion1,
                this.#exhaustion2,
                this.#exhaustion3,
                this.#exhaustion4,
                this.#exhaustion5,
                this.#frightened,
                this.#grappled,
                this.#incapacitated,
                this.#invisible,
                this.#paralyzed,
                this.#petrified,
                this.#poisoned,
                this.#prone,
                this.#restrained,
                this.#stunned,
                this.#unconscious,
                this.#wounded,
            ],
        };
    }

    get #spells(): ItemEffects {
        return {
            itemData: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Folders.Spells,
                ),
            },
            effects: [
                this.#acidArrow,
                this.#aid,
                this.#alterSelf,
                this.#antilifeShell,
                this.#arcaneHand,
                this.#bane,
                this.#barkskin,
                this.#beaconOfHope,
                this.#blackTentacles,
                this.#bless,
                this.#blindnessDeafness,
                this.#blindnessDeafnessBlindness,
                this.#blindnessDeafnessDeafness,
                this.#blur,
                this.#charmPerson,
                this.#command,
                this.#comprehendLanguages,
                this.#contagion,
                this.#contagionBlindingSickness,
                this.#contagionFilthFever,
                this.#contagionFleshRot,
                this.#contagionMindfire,
                this.#contagionSeizure,
                this.#contagionSlimyDoom,
                this.#darkvision,
                this.#disguiseSelf,
                this.#divineFavor,
                this.#divineWord,
                this.#enlargeReduce,
                this.#enlargeReduceEnlarge,
                this.#enlargeReduceReduce,
                this.#enhanceAbility,
                this.#enhanceAbilityBearsEndurance,
                this.#enhanceAbilityBullsStrength,
                this.#enhanceAbilityCatsGrace,
                this.#enhanceAbilityEaglesSplendor,
                this.#enhanceAbilityFoxsCunning,
                this.#enhanceAbilityOwlsWisdom,
                this.#faerieFire,
                this.#falseLife,
                this.#featherFall,
                this.#feeblemind,
                this.#fireShield,
                this.#fireShieldColdResistance,
                this.#fireShieldFireResistance,
                this.#findThePath,
                this.#fly,
                this.#foresight,
                this.#freedomOfMovement,
                this.#globeOfInvulnerability,
                this.#greaterInvisibility,
                this.#guidance,
                this.#guidingBolt,
                this.#haste,
                this.#heroesFeast,
                this.#heroism,
                this.#hideousLaughter,
                this.#holdMonster,
                this.#holdPerson,
                this.#holyAura,
                this.#huntersMark,
                this.#invisibility,
                this.#irresistibleDance,
                this.#jump,
                this.#light,
                this.#longstrider,
                this.#mageArmor,
                this.#mindBlank,
                this.#mirrorImage,
                this.#passWithoutTrace,
                this.#protectionFromEnergy,
                this.#protectionFromEnergyAcid,
                this.#protectionFromEnergyCold,
                this.#protectionFromEnergyFire,
                this.#protectionFromEnergyLightning,
                this.#protectionFromEnergyThunder,
                this.#protectionFromPoison,
                this.#protectionFromEvilAndGood,
                this.#rayOfFrost,
                this.#regenerate,
                this.#resilientSphere,
                this.#resistance,
                this.#shield,
                this.#shieldOfFaith,
                this.#slow,
                this.#speakWithAnimals,
                this.#speakWithDead,
                this.#speakWithPlants,
                this.#spiderClimb,
                this.#spiritGuardians,
                this.#spiritualWeapon,
                this.#stoneskin,
                this.#suggestion,
                this.#telekinesis,
                this.#trueStrike,
                this.#viciousMockery,
                this.#wardingBond,
                this.#waterBreathing,
                this.#waterWalk,
            ],
        };
    }

    get #classFeatures(): ItemEffects {
        return {
            itemData: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Folders.ClassFeatures,
                ),
            },
            effects: [
                this.#bardicInspiration,
                this.#bardicInspirationD6,
                this.#bardicInspirationD8,
                this.#bardicInspirationD10,
                this.#bardicInspirationD12,
                this.#channelDivinitySacredWeapon,
                this.#channelDivinityTurnTheUnholy,
                this.#channelDivinityTurnUndead,
                this.#kiEmptyBody,
                this.#kiPatientDefense,
                this.#rage,
                this.#recklessAttack,
                this.#recklessAttackAdvantage,
            ],
        };
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

    get #other(): ItemEffects {
        return {
            itemData: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Folders.Other,
                ),
            },
            effects: [
                this.#bonusAction,
                this.#coverHalf,
                this.#coverThreeQuarters,
                this.#coverTotal,
                this.#encumbered,
                this.#dodge,
                this.#flanked,
                this.#flanking,
                this.#greatWeaponMaster,
                this.#heavilyEncumbered,
                this.#inspiration,
                this.#rangedDisadvantage,
                this.#reaction,
                this.#ready,
                this.#sharpshooter,
            ],
        };
    }

    get #blinded(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Blinded.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Blinded.description,
                ),
                img: "modules/dfreds-convenient-effects/images/blinded.svg",
                statuses: ["blinded"],
                changes: [
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

    get #charmed(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Charmed.name,
                ),
                statuses: ["charmed"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Charmed.description,
                ),
                img: "modules/dfreds-convenient-effects/images/charmed.svg",
            },
        });
    }

    get #concentrating(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Concentrating.name,
                ),
                statuses: ["concentrating"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Concentrating.description,
                ),
                img: "modules/dfreds-convenient-effects/images/concentrating.svg",
            },
        });
    }

    get #dead(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Dead.name,
                ),
                statuses: ["dead"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Dead.description,
                ),
                img: "icons/svg/skull.svg",
            },
        });
    }

    get #deafened(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Deafened.name,
                ),
                statuses: ["deafened"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Deafened.description,
                ),
                img: "modules/dfreds-convenient-effects/images/deafened.svg",
            },
        });
    }

    get #exhaustion1(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Exhaustion1.name,
                ),
                statuses: ["exhaustion"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Exhaustion1.description,
                ),
                img: "modules/dfreds-convenient-effects/images/exhaustion1.svg",
                flags: { dnd5e: { exhaustionLevel: 1 } },
                changes: [
                    {
                        key: "system.attributes.exhaustion",
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.check.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "flags.dnd5e.initiativeDisadv",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #exhaustion2(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Exhaustion2.name,
                ),
                statuses: ["exhaustion"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Exhaustion2.description,
                ),
                img: "modules/dfreds-convenient-effects/images/exhaustion2.svg",
                flags: { dnd5e: { exhaustionLevel: 2 } },
                changes: [
                    {
                        key: "system.attributes.exhaustion",
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "2",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.check.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "flags.dnd5e.initiativeDisadv",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
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

    get #exhaustion3(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Exhaustion3.name,
                ),
                statuses: ["exhaustion"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Exhaustion3.description,
                ),
                img: "modules/dfreds-convenient-effects/images/exhaustion3.svg",
                flags: { dnd5e: { exhaustionLevel: 3 } },
                changes: [
                    {
                        key: "system.attributes.exhaustion",
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "3",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.check.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "flags.dnd5e.initiativeDisadv",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "system.attributes.movement.all",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "*0.5",
                        priority: 25,
                    },
                    {
                        key: `flags.midi-qol.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.save.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #exhaustion4(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Exhaustion4.name,
                ),
                statuses: ["exhaustion"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Exhaustion4.description,
                ),
                img: "modules/dfreds-convenient-effects/images/exhaustion4.svg",
                flags: { dnd5e: { exhaustionLevel: 4 } },
                changes: [
                    {
                        key: "system.attributes.exhaustion",
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "4",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.check.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "flags.dnd5e.initiativeDisadv",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "system.attributes.movement.all",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "*0.5",
                        priority: 25,
                    },
                    {
                        key: `flags.midi-qol.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.save.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "system.attributes.hp.max",
                        mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
                        value: "0.5",
                        priority: 5,
                    },
                ],
            },
        });
    }

    get #exhaustion5(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Exhaustion5.name,
                ),
                statuses: ["exhaustion"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Exhaustion5.description,
                ),
                img: "modules/dfreds-convenient-effects/images/exhaustion5.svg",
                flags: { dnd5e: { exhaustionLevel: 5 } },
                changes: [
                    {
                        key: "system.attributes.exhaustion",
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "5",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.check.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "flags.dnd5e.initiativeDisadv",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "system.attributes.movement.all",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "0",
                        priority: 25,
                    },
                    {
                        key: `flags.midi-qol.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.save.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "system.attributes.hp.max",
                        mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
                        value: "0.5",
                        priority: 5,
                    },
                ],
            },
        });
    }

    get #frightened(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Frightened.name,
                ),
                statuses: ["frightened"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Frightened.description,
                ),
                img: "modules/dfreds-convenient-effects/images/frightened.svg",
                changes: [
                    {
                        key: `flags.midi-qol.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.check.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #grappled(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Grappled.name,
                ),
                statuses: ["grappled"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Grappled.description,
                ),
                img: "modules/dfreds-convenient-effects/images/grappled.svg",
                changes: [
                    {
                        key: "system.attributes.movement.all",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "0",
                        priority: 25,
                    },
                ],
            },
        });
    }

    get #incapacitated(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Incapacitated.name,
                ),
                statuses: ["incapacitated"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Incapacitated.description,
                ),
                img: "modules/dfreds-convenient-effects/images/incapacitated.svg",
            },
        });
    }

    get #invisible(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Invisible.name,
                ),
                statuses: ["invisible"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Invisible.description,
                ),
                img: "modules/dfreds-convenient-effects/images/invisible.svg",
                changes: [
                    {
                        key: `flags.midi-qol.advantage.attack.all`,
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

    get #paralyzed(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [this.#incapacitated]
            .map((effect) => Flags.getCeEffectId(effect))
            .filter(notEmpty);
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Paralyzed.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Paralyzed.description,
                ),
                img: "modules/dfreds-convenient-effects/images/paralyzed.svg",
                statuses: ["paralyzed"],
                changes: [
                    {
                        key: `flags.midi-qol.fail.ability.save.dex`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.fail.ability.save.str`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.grants.advantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.grants.critical.range`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "5",
                    },
                    {
                        key: "system.attributes.movement.all",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "0",
                        priority: 25,
                    },
                ],
            },
            subEffectIds,
        });
    }

    get #petrified(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [this.#incapacitated]
            .map((effect) => Flags.getCeEffectId(effect))
            .filter(notEmpty);
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Petrified.name,
                ),
                statuses: ["petrified"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Petrified.description,
                ),
                img: "modules/dfreds-convenient-effects/images/petrified.svg",
                changes: [
                    {
                        key: `flags.midi-qol.grants.advantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.fail.ability.save.dex`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.fail.ability.save.str`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "system.traits.di.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "poison",
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
                    {
                        key: "system.attributes.movement.all",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "0",
                        priority: 25,
                    },
                ],
            },
            subEffectIds,
        });
    }

    get #poisoned(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Poisoned.name,
                ),
                statuses: ["poisoned"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Poisoned.description,
                ),
                img: "modules/dfreds-convenient-effects/images/poisoned.svg",
                changes: [
                    {
                        key: `flags.midi-qol.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.check.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #prone(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Prone.name,
                ),
                statuses: ["prone"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Prone.description,
                ),
                img: "modules/dfreds-convenient-effects/images/prone.svg",
                changes: [
                    {
                        key: `flags.midi-qol.grants.advantage.attack.mwak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.grants.advantage.attack.msak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.grants.disadvantage.attack.rwak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.grants.disadvantage.attack.rsak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
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

    get #restrained(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Restrained.name,
                ),
                statuses: ["restrained"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Restrained.description,
                ),
                img: "modules/dfreds-convenient-effects/images/restrained.svg",
                changes: [
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
                    {
                        key: "system.attributes.movement.all",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "0",
                        priority: 25,
                    },
                ],
            },
        });
    }

    get #stunned(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [this.#incapacitated]
            .map((effect) => Flags.getCeEffectId(effect))
            .filter(notEmpty);
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Stunned.name,
                ),
                statuses: ["stunned"],
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Stunned.description,
                ),
                img: "modules/dfreds-convenient-effects/images/stunned.svg",
                changes: [
                    {
                        key: `flags.midi-qol.fail.ability.save.dex`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.fail.ability.save.str`,
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
            subEffectIds,
        });
    }

    get #unconscious(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [this.#incapacitated]
            .map((effect) => Flags.getCeEffectId(effect))
            .filter(notEmpty);
        return createConvenientEffect({
            effect: {
                statuses: ["unconscious"],
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Unconscious.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Unconscious.description,
                ),
                img: "icons/svg/unconscious.svg",
                changes: [
                    {
                        key: `flags.midi-qol.fail.ability.save.dex`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.fail.ability.save.str`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.grants.advantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.grants.critical.range`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "5",
                    },
                    {
                        key: "system.attributes.movement.all",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "0",
                        priority: 25,
                    },
                ],
            },
            subEffectIds,
        });
    }

    get #wounded(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Wounded.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Wounded.description,
                ),
                img: "modules/dfreds-convenient-effects/images/wounded.svg",
            },
        });
    }

    get #acidArrow(): PreCreate<ActiveEffectSource> {
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

    get #aid(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Aid.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Aid.description,
                ),
                img: "icons/magic/life/heart-cross-blue.webp",
                duration: { seconds: SECONDS.IN_EIGHT_HOURS },
            },
        });
    }

    get #alterSelf(): PreCreate<ActiveEffectSource> {
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

    get #antilifeShell(): PreCreate<ActiveEffectSource> {
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

    get #arcaneHand(): PreCreate<ActiveEffectSource> {
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

    get #bane(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Bane.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Bane.description,
                ),
                img: "icons/magic/unholy/strike-beam-blood-red-purple.webp",
                duration: { seconds: SECONDS.IN_ONE_MINUTE },
                changes: [
                    {
                        key: "system.bonuses.abilities.save",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "-1d4",
                    },
                    {
                        key: "system.bonuses.msak.attack",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "-1d4",
                    },
                    {
                        key: "system.bonuses.mwak.attack",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "-1d4",
                    },
                    {
                        key: "system.bonuses.rsak.attack",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "-1d4",
                    },
                    {
                        key: "system.bonuses.rwak.attack",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "-1d4",
                    },
                ],
            },
        });
    }

    get #barkskin(): PreCreate<ActiveEffectSource> {
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

    get #beaconOfHope(): PreCreate<ActiveEffectSource> {
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

    get #blackTentacles(): PreCreate<ActiveEffectSource> {
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
                changes: this.#restrained.changes,
            },
        });
    }

    get #bless(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Bless.name,
                ),
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

    get #blindnessDeafness(): PreCreate<ActiveEffectSource> {
        const nestedEffectIds = [
            this.#blindnessDeafnessBlindness,
            this.#blindnessDeafnessDeafness,
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

    get #blindnessDeafnessBlindness(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [Flags.getCeEffectId(this.#blinded)].filter(
            notEmpty,
        );
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

    get #blindnessDeafnessDeafness(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [Flags.getCeEffectId(this.#deafened)].filter(
            notEmpty,
        );
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

    get #blur(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Blur.name,
                ),
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

    get #charmPerson(): PreCreate<ActiveEffectSource> {
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
                changes: this.#charmed.changes,
            },
        });
    }

    get #command(): PreCreate<ActiveEffectSource> {
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

    get #comprehendLanguages(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ComprehendLanguages.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ComprehendLanguages
                        .description,
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

    get #contagion(): PreCreate<ActiveEffectSource> {
        const nestedEffectIds = [
            this.#contagionBlindingSickness,
            this.#contagionFilthFever,
            this.#contagionFleshRot,
            this.#contagionMindfire,
            this.#contagionSeizure,
            this.#contagionSlimyDoom,
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

    get #contagionBlindingSickness(): PreCreate<ActiveEffectSource> {
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
                    ...(this.#blinded?.changes ?? []),
                ],
            },
        });
    }

    get #contagionFilthFever(): PreCreate<ActiveEffectSource> {
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

    get #contagionFleshRot(): PreCreate<ActiveEffectSource> {
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

    get #contagionMindfire(): PreCreate<ActiveEffectSource> {
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

    get #contagionSeizure(): PreCreate<ActiveEffectSource> {
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

    get #contagionSlimyDoom(): PreCreate<ActiveEffectSource> {
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

    get #darkvision(): PreCreate<ActiveEffectSource> {
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

    get #disguiseSelf(): PreCreate<ActiveEffectSource> {
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

    get #divineFavor(): PreCreate<ActiveEffectSource> {
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
                    {
                        key: "system.bonuses.weapon.damage",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+1d4[radiant]",
                    },
                ],
            },
        });
    }

    get #divineWord(): PreCreate<ActiveEffectSource> {
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

    get #enhanceAbility(): PreCreate<ActiveEffectSource> {
        const nestedEffectIds = [
            this.#enhanceAbilityBearsEndurance,
            this.#enhanceAbilityBullsStrength,
            this.#enhanceAbilityCatsGrace,
            this.#enhanceAbilityEaglesSplendor,
            this.#enhanceAbilityFoxsCunning,
            this.#enhanceAbilityOwlsWisdom,
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

    get #enhanceAbilityBearsEndurance(): PreCreate<ActiveEffectSource> {
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

    get #enhanceAbilityBullsStrength(): PreCreate<ActiveEffectSource> {
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

    get #enhanceAbilityCatsGrace(): PreCreate<ActiveEffectSource> {
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

    get #enhanceAbilityEaglesSplendor(): PreCreate<ActiveEffectSource> {
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

    get #enhanceAbilityFoxsCunning() {
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

    get #enhanceAbilityOwlsWisdom() {
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

    get #enlargeReduce(): PreCreate<ActiveEffectSource> {
        const nestedEffectIds = [
            this.#enlargeReduceEnlarge,
            this.#enlargeReduceReduce,
        ]
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

    get #enlargeReduceEnlarge(): PreCreate<ActiveEffectSource> {
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

    get #enlargeReduceReduce(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Reduce.name,
                ),
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

    get #faerieFire(): PreCreate<ActiveEffectSource> {
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

    get #falseLife(): PreCreate<ActiveEffectSource> {
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

    get #featherFall(): PreCreate<ActiveEffectSource> {
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

    get #feeblemind(): PreCreate<ActiveEffectSource> {
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

    get #fireShield(): PreCreate<ActiveEffectSource> {
        const nestedEffectIds = [
            this.#fireShieldColdResistance,
            this.#fireShieldFireResistance,
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

    get #fireShieldColdResistance(): PreCreate<ActiveEffectSource> {
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

    get #fireShieldFireResistance(): PreCreate<ActiveEffectSource> {
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

    get #findThePath(): PreCreate<ActiveEffectSource> {
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

    get #fly(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Fly.name,
                ),
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

    get #foresight(): PreCreate<ActiveEffectSource> {
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

    get #freedomOfMovement(): PreCreate<ActiveEffectSource> {
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

    get #globeOfInvulnerability(): PreCreate<ActiveEffectSource> {
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

    get #greaterInvisibility(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [this.#invisible]
            .map((effect) => Flags.getCeEffectId(effect))
            .filter(notEmpty);
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.GreaterInvisibility.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.GreaterInvisibility
                        .description,
                ),
                img: "icons/magic/air/fog-gas-smoke-swirling-gray.webp",
                duration: { seconds: SECONDS.IN_ONE_MINUTE },
                statuses: ["invisible"],
            },
            subEffectIds,
        });
    }

    get #guidance(): PreCreate<ActiveEffectSource> {
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

    get #guidingBolt(): PreCreate<ActiveEffectSource> {
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

    get #haste(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Haste.name,
                ),
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

    get #heroesFeast(): PreCreate<ActiveEffectSource> {
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

    get #heroism(): PreCreate<ActiveEffectSource> {
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

    get #hideousLaughter(): PreCreate<ActiveEffectSource> {
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
                    ...(this.#incapacitated.changes ?? []),
                    ...(this.#prone.changes ?? []),
                ],
            },
        });
    }

    get #holdMonster(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [this.#paralyzed]
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

    get #holdPerson(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [this.#paralyzed]
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

    get #holyAura(): PreCreate<ActiveEffectSource> {
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

    get #huntersMark(): PreCreate<ActiveEffectSource> {
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

    get #invisibility(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [this.#invisible]
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

    get #irresistibleDance(): PreCreate<ActiveEffectSource> {
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

    get #jump(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Jump.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Jump.description,
                ),
                img: "icons/magic/control/debuff-energy-hold-blue-yellow.webp",
                duration: { seconds: SECONDS.IN_ONE_MINUTE },
            },
        });
    }

    get #light(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Light.name,
                ),
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

    get #longstrider(): PreCreate<ActiveEffectSource> {
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

    get #mageArmor(): PreCreate<ActiveEffectSource> {
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

    get #mindBlank(): PreCreate<ActiveEffectSource> {
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

    get #mirrorImage(): PreCreate<ActiveEffectSource> {
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

    get #passWithoutTrace(): PreCreate<ActiveEffectSource> {
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

    get #protectionFromEnergy(): PreCreate<ActiveEffectSource> {
        const nestedEffectIds = [
            this.#protectionFromEnergyAcid,
            this.#protectionFromEnergyCold,
            this.#protectionFromEnergyFire,
            this.#protectionFromEnergyLightning,
            this.#protectionFromEnergyThunder,
        ]
            .map((effect) => Flags.getCeEffectId(effect))
            .filter(notEmpty);
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromEnergy.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromEnergy
                        .description,
                ),
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-teal.webp",
            },
            nestedEffectIds,
        });
    }

    get #protectionFromEnergyAcid(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromAcid.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromAcid
                        .description,
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

    get #protectionFromEnergyCold(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromCold.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromCold
                        .description,
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

    get #protectionFromEnergyFire(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromFire.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromFire
                        .description,
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

    get #protectionFromEnergyLightning(): PreCreate<ActiveEffectSource> {
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

    get #protectionFromEnergyThunder(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromThunder.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromThunder
                        .description,
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

    get #protectionFromPoison(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromPoison.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromPoison
                        .description,
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

    get #protectionFromEvilAndGood(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ProtectionFromEvilAndGood
                        .name,
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

    get #rayOfFrost(): PreCreate<ActiveEffectSource> {
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

    get #regenerate(): PreCreate<ActiveEffectSource> {
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

    get #resilientSphere(): PreCreate<ActiveEffectSource> {
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

    get #resistance(): PreCreate<ActiveEffectSource> {
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

    get #shield(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Shield.name,
                ),
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

    get #shieldOfFaith(): PreCreate<ActiveEffectSource> {
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

    get #slow(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Slow.name,
                ),
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

    get #speakWithAnimals(): PreCreate<ActiveEffectSource> {
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

    get #speakWithDead(): PreCreate<ActiveEffectSource> {
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

    get #speakWithPlants(): PreCreate<ActiveEffectSource> {
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

    get #spiderClimb(): PreCreate<ActiveEffectSource> {
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

    get #spiritGuardians(): PreCreate<ActiveEffectSource> {
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

    get #spiritualWeapon(): PreCreate<ActiveEffectSource> {
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

    get #stoneskin(): PreCreate<ActiveEffectSource> {
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

    get #suggestion(): PreCreate<ActiveEffectSource> {
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

    get #telekinesis(): PreCreate<ActiveEffectSource> {
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

    get #trueStrike(): PreCreate<ActiveEffectSource> {
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

    get #viciousMockery(): PreCreate<ActiveEffectSource> {
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

    get #wardingBond(): PreCreate<ActiveEffectSource> {
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

    get #waterBreathing(): PreCreate<ActiveEffectSource> {
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

    get #waterWalk(): PreCreate<ActiveEffectSource> {
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

    get #bardicInspiration(): PreCreate<ActiveEffectSource> {
        const nestedEffectIds = [
            this.#bardicInspirationD6,
            this.#bardicInspirationD8,
            this.#bardicInspirationD10,
            this.#bardicInspirationD12,
        ]
            .map((effect) => Flags.getCeEffectId(effect))
            .filter(notEmpty);
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BardicInspiration.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BardicInspiration.description,
                ),
                img: "icons/skills/melee/unarmed-punch-fist.webp",
                duration: { seconds: SECONDS.IN_TEN_MINUTES },
            },
            nestedEffectIds,
        });
    }

    get #bardicInspirationD6(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BardicInspirationD6.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BardicInspirationD6
                        .description,
                ),
                img: "icons/skills/melee/unarmed-punch-fist.webp",
                duration: { seconds: SECONDS.IN_TEN_MINUTES },
                changes: [
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.label`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "Bardic Inspiration",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d6",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.save.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d6",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.skill.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d6",
                    },
                ],
            },
        });
    }

    get #bardicInspirationD8(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BardicInspirationD8.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BardicInspirationD8
                        .description,
                ),
                img: "icons/skills/melee/unarmed-punch-fist.webp",
                duration: { seconds: SECONDS.IN_TEN_MINUTES },
                changes: [
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.label`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "Bardic Inspiration",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d8",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.save.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d8",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.skill.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d8",
                    },
                ],
            },
        });
    }

    get #bardicInspirationD10(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BardicInspirationD10.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BardicInspirationD10
                        .description,
                ),
                img: "icons/skills/melee/unarmed-punch-fist.webp",
                duration: { seconds: SECONDS.IN_TEN_MINUTES },
                changes: [
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.label`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "Bardic Inspiration",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d10",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.save.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d10",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.skill.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d10",
                    },
                ],
            },
        });
    }

    get #bardicInspirationD12(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BardicInspirationD12.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BardicInspirationD12
                        .description,
                ),
                img: "icons/skills/melee/unarmed-punch-fist.webp",
                duration: { seconds: SECONDS.IN_TEN_MINUTES },
                changes: [
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.label`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "Bardic Inspiration",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d12",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.save.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d12",
                    },
                    {
                        key: `flags.midi-qol.optional.bardic-inspiration.skill.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "+1d12",
                    },
                ],
            },
        });
    }

    get #channelDivinitySacredWeapon(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ChannelDivinitySacredWeapon
                        .name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ChannelDivinitySacredWeapon
                        .description,
                ),
                img: "icons/weapons/swords/sword-gold-holy.webp",
                duration: { seconds: SECONDS.IN_ONE_MINUTE },
                changes: [
                    {
                        key: "system.bonuses.mwak.attack",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+max(1, @abilities.cha.mod)",
                    },
                    {
                        key: "system.bonuses.rwak.attack",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+max(1, @abilities.cha.mod)",
                    },
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
                        value: '{"type": "sunburst", "speed": 2,"intensity": 4}',
                    },
                ],
            },
        });
    }

    get #channelDivinityTurnTheUnholy(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ChannelDivinityTurnTheUnholy
                        .name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ChannelDivinityTurnTheUnholy
                        .description,
                ),
                img: "icons/magic/fire/explosion-embers-evade-silhouette.webp",
                duration: { seconds: SECONDS.IN_ONE_MINUTE },
                flags: { dae: { specialDuration: ["isDamaged"] } },
            },
        });
    }

    get #channelDivinityTurnUndead(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ChannelDivinityTurnUndead
                        .name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.ChannelDivinityTurnUndead
                        .description,
                ),
                img: "icons/magic/fire/flame-burning-creature-skeleton.webp",
                duration: { seconds: SECONDS.IN_ONE_MINUTE },
                flags: { dae: { specialDuration: ["isDamaged"] } },
            },
        });
    }

    get #kiEmptyBody(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.KiEmptyBody.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.KiEmptyBody.description,
                ),
                img: "icons/magic/perception/silhouette-stealth-shadow.webp",
                duration: { seconds: SECONDS.IN_ONE_MINUTE },
                changes: [
                    {
                        key: `flags.midi-qol.advantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.grants.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "physical",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "bludgeoning",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "piercing",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "slashing",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "silver",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "adamant",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "acid",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "cold",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "fire",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "lightning",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "necrotic",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "poison",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "psychic",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "radiant",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "thunder",
                    },
                ],
            },
        });
    }

    get #kiPatientDefense(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.KiPatientDefense.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.KiPatientDefense.description,
                ),
                img: "icons/magic/defensive/shield-barrier-glowing-blue.webp",
                flags: { dae: { specialDuration: ["turnStart"] } },
                changes: [
                    {
                        key: `flags.midi-qol.grants.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.advantage.ability.save.dex`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #rage(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Rage.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Rage.description,
                ),
                img: "icons/creatures/abilities/mouth-teeth-human.webp",
                duration: { seconds: SECONDS.IN_ONE_MINUTE },
                changes: [
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
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "slashing",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "piercing",
                    },
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "bludgeoning",
                    },
                    {
                        key: "system.bonuses.mwak.damage",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+ @scale.barbarian.rage-damage",
                    },
                    {
                        key: "macro.tokenMagic",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "outline",
                    },
                ],
            },
            isDynamic: true,
        });
    }

    get #recklessAttack(): PreCreate<ActiveEffectSource> {
        const subEffectIds = [this.#recklessAttackAdvantage]
            .map((effect) => Flags.getCeEffectId(effect))
            .filter(notEmpty);
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.RecklessAttack.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.RecklessAttack.description,
                ),
                img: "icons/skills/melee/blade-tips-triple-bent-white.webp",
                flags: { dae: { specialDuration: ["turnStart"] } },
                changes: [
                    {
                        key: `flags.midi-qol.grants.advantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
            subEffectIds,
        });
    }

    get #recklessAttackAdvantage(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd
                        .RecklessAttackAdvantageOnAttacks.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd
                        .RecklessAttackAdvantageOnAttacks.description,
                ),
                img: "icons/skills/melee/blade-tips-triple-bent-white.webp",
                duration: { turns: 1 },
                changes: [
                    {
                        key: `flags.midi-qol.advantage.attack.mwak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
            isViewable: false,
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

    get #bonusAction(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BonusAction.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.BonusAction.description,
                ),
                img: "modules/dfreds-convenient-effects/images/bonus-action.svg",
                flags: {
                    dae: {
                        specialDuration: ["turnStart", "shortRest", "longRest"],
                    },
                },
            },
        });
    }

    get #coverHalf(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.CoverHalf.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.CoverHalf.description,
                ),
                img: "modules/dfreds-convenient-effects/images/broken-wall.svg",
                tint: "#dae34f",
                changes: [
                    {
                        key: "system.attributes.ac.cover",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+2",
                    },
                    {
                        key: "system.abilities.dex.bonuses.save",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+2",
                    },
                ],
            },
        });
    }

    get #coverThreeQuarters(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.CoverThreeQuarters.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.CoverThreeQuarters
                        .description,
                ),
                img: "modules/dfreds-convenient-effects/images/brick-wall.svg",
                changes: [
                    {
                        key: "system.attributes.ac.cover",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+5",
                    },
                    {
                        key: "system.abilities.dex.bonuses.save",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+5",
                    },
                ],
            },
        });
    }

    get #coverTotal(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.CoverTotal.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.CoverTotal.description,
                ),
                img: "modules/dfreds-convenient-effects/images/castle.svg",
                changes: [
                    {
                        key: `flags.midi-qol.grants.attack.fail.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #encumbered(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Encumbered.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Encumbered.description,
                ),
                img: "icons/svg/down.svg",
                statuses: ["encumbered"],
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

    get #dodge(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Dodge.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Dodge.description,
                ),
                img: "modules/dfreds-convenient-effects/images/dodging.svg",
                statuses: ["dodging"],
                flags: { dae: { specialDuration: ["turnStart"] } },
                changes: [
                    {
                        key: `flags.midi-qol.grants.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.advantage.ability.save.dex`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: "macro.tokenMagic",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "Evade Stance",
                    },
                ],
            },
        });
    }

    get #flanked(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Flanked.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Flanked.description,
                ),
                img: "modules/dfreds-convenient-effects/images/encirclement.svg",
                changes: [
                    {
                        key: `flags.midi-qol.grants.advantage.attack.mwak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.grants.advantage.attack.msak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #flanking(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Flanking.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Flanking.description,
                ),
                img: "icons/svg/sword.svg",
                changes: [
                    {
                        key: `flags.midi-qol.advantage.attack.mwak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.advantage.attack.msak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #greatWeaponMaster(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.GreatWeaponMaster.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.GreatWeaponMaster.description,
                ),
                img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
                changes: [
                    {
                        key: "system.bonuses.mwak.attack",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "-5",
                    },
                    {
                        key: "system.bonuses.mwak.damage",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+10",
                    },
                ],
            },
        });
    }

    get #heavilyEncumbered(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.HeavilyEncumbered.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.HeavilyEncumbered.description,
                ),
                img: "icons/svg/downgrade.svg",
                statuses: ["heavilyEncumbered"],
                changes: [
                    {
                        key: "system.attributes.movement.all",
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "-20",
                        priority: 25,
                    },
                    {
                        key: `flags.midi-qol.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.save.str`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.save.dex`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.ability.save.con`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #inspiration(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Inspiration.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Inspiration.description,
                ),
                img: "icons/magic/control/buff-luck-fortune-green.webp",
                flags: {
                    dae: {
                        specialDuration: [
                            "1Action",
                            "isSave",
                            "isCheck",
                            "isSkill",
                        ],
                    },
                },
                changes: [
                    {
                        key: `flags.midi-qol.advantage.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #rangedDisadvantage(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.RangedDisadvantage.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.RangedDisadvantage
                        .description,
                ),
                img: "modules/dfreds-convenient-effects/images/broken-arrow.svg",
                changes: [
                    {
                        key: `flags.midi-qol.disadvantage.attack.rwak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                    {
                        key: `flags.midi-qol.disadvantage.attack.rsak`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
        });
    }

    get #reaction(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Reaction.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Reaction.description,
                ),
                img: "modules/dfreds-convenient-effects/images/reaction.svg",
                flags: {
                    dae: {
                        specialDuration: ["turnStart", "shortRest", "longRest"],
                    },
                },
            },
        });
    }

    get #ready(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Ready.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Ready.description,
                ),
                img: "modules/dfreds-convenient-effects/images/ready.svg",
                flags: { dae: { specialDuration: ["turnStart"] } },
            },
        });
    }

    get #sharpshooter(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Sharpshooter.name,
                ),
                description: game.i18n.localize(
                    EN_JSON.ConvenientEffects.Dnd.Sharpshooter.description,
                ),
                img: "icons/weapons/bows/shortbow-recurve-yellow.webp",
                changes: [
                    {
                        key: "system.bonuses.rwak.attack",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "-5",
                    },
                    {
                        key: "system.bonuses.rwak.damage",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+10",
                    },
                ],
            },
        });
    }
}

export { EffectDefinitionDnd5e };
