import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import {
    EffectDefinition,
    ItemEffects,
    MigrationType,
} from "../effect-definition.ts";
import { log } from "../../logger.ts";
import { createConvenientEffect } from "../../helpers.ts";
import { COLORS, SECONDS } from "src/ts/constants.ts";

// TODO special: unconscious should apply prone with otherEffects
// TODO special: what to do with exhaustion?
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
        return [
            {
                key: "2024-07-15-sample-migration",
                date: new Date("2024-07-15"),
                func: async () => {
                    // const settings = new Settings();
                    // const itemIds = settings.effectItemIds;
                    // const backupItemIds = game.items
                    //     .filter((item) => {
                    //         const backupItemId = item.getFlag(
                    //             MODULE_ID,
                    //             FLAGS.BACKUP_ID,
                    //         ) as string | undefined;

                    //         return backupItemId !== undefined;
                    //     })
                    //     .map((backupItem) => backupItem.id);
                    log("Sample migration running");
                },
            },
        ];
    }

    get #conditions(): ItemEffects {
        return {
            itemData: {
                name: "Conditions",
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
                name: "Spells",
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
                name: "Class Features",
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
            ],
        };
    }

    get #equipment(): ItemEffects {
        return {
            itemData: {
                name: "Equipment",
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
                name: "Other",
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
                name: "Blinded",
                description:
                    "- A blinded creature can't see and automatically fails any ability check that requires sight.<br/>- Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.",
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
                name: "Charmed",
                statuses: ["charmed"],
                description:
                    "- A charmed creature can't attack the charmer or target the charmer with harmful abilities or magical effects.<br/>- The charmer has advantage on any ability check to interact socially with the creature.",
                img: "modules/dfreds-convenient-effects/images/charmed.svg",
            },
        });
    }

    get #concentrating(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Concentrating",
                statuses: ["concentrating"],
                description:
                    "Some Spells require you to maintain Concentration in order to keep their magic active. If you lose Concentration, such a spell ends.",
                img: "modules/dfreds-convenient-effects/images/concentrating.svg",
            },
        });
    }

    get #dead(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Dead",
                statuses: ["dead"],
                description: "No active effects",
                img: "icons/svg/skull.svg",
            },
        });
    }

    get #deafened(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Deafened",
                statuses: ["deafened"],
                description:
                    "- A deafened creature can't hear and automatically fails any ability check that requires hearing.",
                img: "modules/dfreds-convenient-effects/images/deafened.svg",
            },
        });
    }

    get #exhaustion1(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Exhaustion 1",
                statuses: ["exhaustion"],
                description: "Disadvantage on ability checks",
                img: "modules/dfreds-convenient-effects/images/exhaustion1.svg",
                flags: {
                    dnd5e: {
                        exhaustionLevel: 1,
                    },
                },
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
                name: "Exhaustion 2",
                statuses: ["exhaustion"],
                description: "Disadvantage on ability checks and speed halved",
                img: "modules/dfreds-convenient-effects/images/exhaustion2.svg",
                flags: {
                    dnd5e: {
                        exhaustionLevel: 2,
                    },
                },
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
                name: "Exhaustion 3",
                statuses: ["exhaustion"],
                description:
                    "Disadvantage on ability checks, speed halved, and disadvantage on attacks and saving throws",
                img: "modules/dfreds-convenient-effects/images/exhaustion3.svg",
                flags: {
                    dnd5e: {
                        exhaustionLevel: 3,
                    },
                },
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
                name: "Exhaustion 4",
                statuses: ["exhaustion"],
                description:
                    "Disadvantage on ability checks, speed halved, disadvantage on attacks and saving throws, and hit point maximum halved",
                img: "modules/dfreds-convenient-effects/images/exhaustion4.svg",
                flags: {
                    dnd5e: {
                        exhaustionLevel: 4,
                    },
                },
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
                name: "Exhaustion 5",
                statuses: ["exhaustion"],
                description:
                    "Disadvantage on ability checks, speed reduced to 0, disadvantage on attacks and saving throws, and hit point maximum halved",
                img: "modules/dfreds-convenient-effects/images/exhaustion5.svg",
                flags: {
                    dnd5e: {
                        exhaustionLevel: 5,
                    },
                },
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
                name: "Frightened",
                statuses: ["frightened"],
                description:
                    "- A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.<br/>- The creature can't willingly move closer to the source of its fear.",
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
                name: "Grappled",
                statuses: ["grappled"],
                description:
                    "- A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed.<br/>- The condition ends if the grappler is incapacitated.<br/>- The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect.",
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
                name: "Incapacitated",
                statuses: ["incapacitated"],
                description:
                    "- An incapacitated creature can't take actions or reactions",
                img: "modules/dfreds-convenient-effects/images/incapacitated.svg",
            },
        });
    }

    get #invisible(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Invisible",
                statuses: ["invisible"],
                description:
                    "- An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured. The creature's location can be detected by any noise it makes or any tracks it leaves.<br/>- Attack rolls against the creature have disadvantage, and the creature's attack rolls have advantage.",
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
        return createConvenientEffect({
            effect: {
                name: "Paralyzed",
                description:
                    "- A paralyzed creature is incapacitated (see the condition) and can't move or speak.<br/>- The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage.<br/>- Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.",
                img: "modules/dfreds-convenient-effects/images/paralyzed.svg",
                statuses: ["paralyzed", "incapacitated"],
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
                    ...(this.#incapacitated.changes ?? []),
                ],
            },
        });
    }

    get #petrified(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Petrified",
                statuses: ["petrified", "incapacitated"],
                description:
                    "- A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.<br/>- The creature is incapacitated (see the condition), can't move or speak, and is unaware of its surroundings.<br/>- Attack rolls against the creature have advantage.<br/>- The creature automatically fails Strength and Dexterity saving throws.<br/>- The creature has resistance to all damage.<br/>- The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized. Remove all movement, grant advantage to all who attack, and add damage resistance to all magical and physical attacks",
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
                    ...(this.#incapacitated.changes ?? []),
                ],
            },
        });
    }

    get #poisoned(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Poisoned",
                statuses: ["poisoned"],
                description:
                    "- A poisoned creature has disadvantage on attack rolls and ability checks.",
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
                name: "Prone",
                statuses: ["prone"],
                description:
                    "- A prone creature's only movement option is to crawl, unless it stands up and thereby ends the condition.<br/>- The creature has disadvantage on attack rolls.<br/>- An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.",
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
                name: "Restrained",
                statuses: ["restrained"],
                description:
                    "- A restrained creature's speed becomes 0, and it can't benefit from any bonus to its speed.<br/>- Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.<br/>- The creature has disadvantage on Dexterity saving throws.",
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
        return createConvenientEffect({
            effect: {
                name: "Stunned",
                statuses: ["stunned", "incapacitated"],
                description:
                    "- A stunned creature is incapacitated (see the condition), can't move, and can speak only falteringly.<br/>- The creature automatically fails Strength and Dexterity saving throws.<br/>- Attack rolls against the creature have advantage.",
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
                    ...(this.#incapacitated.changes ?? []),
                ],
            },
        });
    }

    get #unconscious(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                statuses: ["unconscious", "incapacitated", "prone"],
                name: "Unconscious",
                description:
                    "- An unconscious creature is incapacitated (See the condition) can't move or speak, and is unaware of its surroundings.<br/>- The creature drops whatever its holding and falls prone (See the condition).<br/>- The creature automatically fails Strength and Dexterity saving throws.<br/>- Attack rolls against the creature have advantage.<br/>- Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.",
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
                    ...(this.#incapacitated.changes ?? []),
                    ...(this.#prone.changes ?? []),
                ],
            },
        });
    }

    get #wounded(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Wounded",
                description: "No active effects",
                img: "modules/dfreds-convenient-effects/images/wounded.svg",
            },
        });
    }

    get #acidArrow(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Acid Arrow",
                description: "Causes 2d4 acid damage at the end of next turn",
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
                name: "Aid",
                description:
                    "Add to current and maximum hit points for 8 hours",
                img: "icons/magic/life/heart-cross-blue.webp",
                duration: {
                    seconds: SECONDS.IN_EIGHT_HOURS,
                },
            },
        });
    }

    get #alterSelf(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Alter Self",
                description: "No active effects and lasts for 1 hour",
                img: "icons/magic/control/debuff-energy-hold-green.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
            },
        });
    }

    get #antilifeShell(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Antilife Shell",
                description: "No active effects and lasts for 1 hour",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-teal.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
            },
        });
    }

    get #arcaneHand(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Arcane Hand",
                description: "No active effects and lasts for 1 minute",
                img: "icons/magic/fire/projectile-fireball-smoke-strong-teal.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
            },
        });
    }

    get #bane(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Bane",
                description:
                    "Subtract 1d4 from all saving throws and attack rolls for 1 minute",
                img: "icons/magic/unholy/strike-beam-blood-red-purple.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
        // TODO seems to not work in dnd 3.0.0
        return createConvenientEffect({
            effect: {
                name: "Barkskin",
                description: "Upgrade AC to 16 for 1 hour",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                changes: [
                    {
                        key: "system.attributes.ac.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
                        value: "16",
                        priority: 5,
                    },
                ],
            },
        });
    }

    get #beaconOfHope(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Beacon of Hope",
                description:
                    "Adds advantage to wisdom saving throws and death saving throws for 1 minute",
                img: "icons/magic/light/explosion-star-large-blue-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                name: "Black Tentacles",
                description:
                    "Apply the effects of the restrained condition for 1 minute",
                img: "icons/magic/nature/vines-thorned-curled-glow-teal-purple.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
                changes: this.#restrained.changes,
            },
        });
    }

    get #bless(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Bless",
                description:
                    "Add 1d4 to all saving throws and attack rolls for 1 minute",
                img: "icons/magic/control/buff-flight-wings-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                ],
            },
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "bloom",
                },
            ],
        });
    }

    get #blindnessDeafness(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Blindness/Deafness",
                description: "Choose between blindness or deafness",
                img: "icons/magic/perception/eye-ringed-glow-angry-red.webp",
            },
            nestedEffects: [
                this.#blindnessDeafnessBlindness,
                this.#blindnessDeafnessDeafness,
            ],
        });
    }

    get #blindnessDeafnessBlindness(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Blindness",
                description:
                    "Disadvantage on attack rolls while granting advantage to all who attack for 1 minute",
                img: "icons/magic/perception/eye-ringed-glow-angry-red.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
            },
            // isViewable: this._settings.showNestedEffects,
            subEffects: [this.#blinded],
        });
    }

    get #blindnessDeafnessDeafness(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Deafness",
                description: "No active effects and lasts for 1 minute",
                img: "icons/magic/perception/eye-ringed-glow-angry-red.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
            },
            // isViewable: this._settings.showNestedEffects,
            subEffects: [this.#deafened],
        });
    }

    get #blur(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Blur",
                description:
                    "Grants disadvantage to all who attack for 1 minute",
                img: "icons/magic/air/air-burst-spiral-blue-gray.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
                changes: [
                    {
                        key: `flags.midi-qol.grants.disadvantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "blur",
                },
            ],
        });
    }

    get #charmPerson(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Charm Person",
                description: "No active effects and lasts for 1 hour",
                img: "icons/magic/fire/explosion-fireball-medium-purple-pink.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                changes: this.#charmed.changes,
            },
        });
    }

    get #command(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Command",
                description:
                    "No active effects and lasts until the end of next turn",
                img: "icons/magic/fire/explosion-fireball-small-purple.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_ROUND_DND5E,
                    turns: 1,
                },
            },
        });
    }

    get #comprehendLanguages(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Comprehend Languages",
                description: "Adds all languages for 1 hour",
                img: "icons/magic/symbols/runes-triangle-orange-purple.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
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
        return createConvenientEffect({
            effect: {
                name: "Contagion",
                description:
                    "Choose between blinding sickness, filth fever, flesh rot, mindfire, seizure, or slimy doom",
                img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
            },
            nestedEffects: [
                this.#contagionBlindingSickness,
                this.#contagionFilthFever,
                this.#contagionFleshRot,
                this.#contagionMindfire,
                this.#contagionSeizure,
                this.#contagionSlimyDoom,
            ],
        });
    }

    get #contagionBlindingSickness(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Blinding Sickness",
                description:
                    "Disadvantage on wisdom checks and wisdom saving throws for 7 days",
                img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_WEEK,
                },
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
                name: "Filth Fever",
                description:
                    "Disadvantage on strength checks strength saving throws, and attacks that use strength for 7 days",
                img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_WEEK,
                },
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
                name: "Flesh Rot",
                description:
                    "Disadvantage on charisma checks and vulnerability to all damage",
                img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_WEEK,
                },
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
                name: "Mindfire",
                description:
                    "Disadvantage on intelligence checks and intelligence saving throws for 7 days",
                img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_WEEK,
                },
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
                name: "Seizure",
                description:
                    "Disadvantage on dexterity checks, dexterity saving throws, and attacks that use dexterity for 7 days",
                img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_WEEK,
                },
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
                name: "Slimy Doom",
                description:
                    "Disadvantage on constitution checks and constitution saving throws for 7 days",
                img: "icons/magic/unholy/strike-beam-blood-large-red-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_WEEK,
                },
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
                name: "Darkvision",
                description: "Upgrade darkvision to 60 ft. for 8 hours",
                img: "icons/magic/perception/eye-ringed-glow-angry-small-red.webp",
                duration: {
                    seconds: SECONDS.IN_EIGHT_HOURS,
                },
                changes: [
                    {
                        key: "system.attributes.senses.darkvision",
                        mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
                        value: "60",
                        priority: 5,
                    },
                ],
            },
            atlChanges: [
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
        });
    }

    get #disguiseSelf(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Disguise Self",
                description: "No active effects and lasts for 1 hour",
                img: "icons/magic/control/debuff-energy-hold-teal-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
            },
        });
    }

    get #divineFavor(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Divine Favor",
                description:
                    "Add 1d4 radiant damage to weapon attacks for 1 minute",
                img: "icons/magic/fire/dagger-rune-enchant-flame-blue-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                name: "Divine Word",
                description:
                    "Adds various effects based on the remaining hit points",
                img: "icons/magic/light/explosion-star-large-orange-purple.webp",
            },
            isDynamic: true,
        });
    }

    get #enhanceAbility(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Enhance Ability",
                description:
                    "Choose between Bear's Endurance, Bull's Strength, Cat's Grace, Eagle's Splendor, Fox's Cunning, or Owl's Wisdom",
                img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
            },
            nestedEffects: [
                this.#enhanceAbilityBearsEndurance,
                this.#enhanceAbilityBullsStrength,
                this.#enhanceAbilityCatsGrace,
                this.#enhanceAbilityEaglesSplendor,
                this.#enhanceAbilityFoxsCunning,
                this.#enhanceAbilityOwlsWisdom,
            ],
        });
    }

    get #enhanceAbilityBearsEndurance(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Bear's Endurance",
                description:
                    "Advantage on constitution checks and 2d6 temp hit points for 1 hour",
                img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
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
                name: "Bull's Strength",
                description:
                    "Advantage on strength checks and double maximum carrying capacity for 1 hour",
                img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
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
                name: "Cat's Grace",
                description: "Advantage on dexterity checks for 1 hour",
                img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
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
                name: "Eagle's Splendor",
                description: "Advantage on charisma checks for 1 hour",
                img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
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
                name: "Fox's Cunning",
                description: "Advantage on intelligence checks for 1 hour",
                img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
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
                name: "Owl's Wisdom",
                description: "Advantage on wisdom checks for 1 hour",
                img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
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
        return createConvenientEffect({
            effect: {
                name: "Enlarge/Reduce",
                description: "Choose between Enlarge or Reduce",
                img: "icons/magic/control/energy-stream-link-large-blue.webp",
            },
            nestedEffects: [
                this.#enlargeReduceEnlarge,
                this.#enlargeReduceReduce,
            ],
        });
    }

    get #enlargeReduceEnlarge(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Enlarge",
                description:
                    "Add 1d4 to damage and advantage on strength checks and strength saving throws for 1 minute",
                img: "icons/magic/control/energy-stream-link-large-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
            // isViewable: this.#settings.showNestedEffects,
        });
    }

    get #enlargeReduceReduce(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Reduce",
                description:
                    "Subtract 1d4 from damage and disadvantage on strength checks and strength saving throws for 1 minute",
                img: "icons/magic/control/energy-stream-link-large-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
            // isViewable: this._settings.showNestedEffects,
        });
    }

    get #faerieFire(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Faerie Fire",
                description: "Grants advantage to all who attack for 1 minute",
                img: "icons/magic/fire/projectile-meteor-salvo-strong-teal.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
                changes: [
                    {
                        key: `flags.midi-qol.grants.advantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
            atlChanges: [
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
            ],
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "glow",
                },
            ],
        });
    }

    get #falseLife(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "False Life",
                description: "Add temporary hit points 1 hour",
                img: "icons/magic/life/heart-cross-purple-orange.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
            },
        });
    }

    get #featherFall(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Feather Fall",
                description: "No active effects and lasts for 1 minute",
                img: "icons/magic/air/wind-swirl-pink-purple.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
            },
        });
    }

    get #feeblemind(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Feeblemind",
                description:
                    "Set intelligence and charisma scores to 1 until removed",
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
        return createConvenientEffect({
            effect: {
                name: "Fire Shield",
                description: "Choose between cold or fire resistance",
                img: "icons/magic/defensive/shield-barrier-flaming-pentagon-red.webp",
            },
            nestedEffects: [
                this.#fireShieldColdResistance,
                this.#fireShieldFireResistance,
            ],
        });
    }

    get #fireShieldColdResistance(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Fire Shield (Cold Resistance)",
                description: "Add damage resistance to cold for 10 minutes",
                img: "icons/magic/defensive/shield-barrier-flaming-pentagon-red.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "cold",
                    },
                ],
            },
            atlChanges: [
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
            ],
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "fire",
                },
            ],
        });
    }

    get #fireShieldFireResistance(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Fire Shield (Fire Resistance)",
                description: "Add damage resistance to fire for 10 minutes",
                img: "icons/magic/defensive/shield-barrier-flaming-pentagon-blue.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "fire",
                    },
                ],
            },
            atlChanges: [
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
            ],
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "Fire v2 (coldfire)",
                },
            ],
        });
    }

    get #findThePath(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Find the Path",
                description: "No active effects and lasts for 1 day",
                img: "icons/magic/light/explosion-star-teal.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_DAY,
                },
            },
        });
    }

    get #fly(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Fly",
                description: "Upgrade flying speed to 60 ft. for 10 minutes",
                img: "icons/magic/control/energy-stream-link-white.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
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
                name: "Foresight",
                description:
                    "Grants advantage on attack rolls, ability checks, and saving throws while granting disadvantage to all who attack for 8 hours",
                img: "icons/magic/perception/eye-ringed-glow-angry-large-teal.webp",
                duration: {
                    seconds: SECONDS.IN_EIGHT_HOURS,
                },
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
                name: "Freedom of Movement",
                description: "No active effects and lasts for 1 hour",
                img: "icons/skills/melee/strike-blade-knife-white-red.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
            },
        });
    }

    get #globeOfInvulnerability(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Globe of Invulnerability",
                description: "No active effects and lasts for 1 minute",
                img: "icons/magic/defensive/shield-barrier-flaming-pentagon-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
            },
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "warp-field",
                },
            ],
        });
    }

    get #greaterInvisibility(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Greater Invisibility",
                description:
                    "Grants advantage on attack rolls while forcing disadvantage to all who attack for 1 minute",
                img: "icons/magic/air/fog-gas-smoke-swirling-gray.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
                statuses: ["invisible"],
            },
            subEffects: [this.#invisible],
        });
    }

    get #guidance(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Guidance",
                description:
                    "Adds 1d4 to one ability or skill check for 1 minute",
                img: "icons/magic/control/buff-flight-wings-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                name: "Guiding Bolt",
                description:
                    "Grants advantage to next attacker or until the end of next turn",
                img: "icons/magic/fire/projectile-fireball-smoke-large-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_ROUND_DND5E,
                    turns: 1,
                },
                flags: {
                    dae: {
                        specialDuration: ["isAttacked"],
                    },
                },
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
                name: "Haste",
                description:
                    "Double speed, add 2 to AC, and advantage on dexterity saving throws for 1 minute",
                img: "icons/magic/control/buff-flight-wings-runes-purple.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                name: "Heroes' Feast",
                description:
                    "Immunity to poison and frightened, make all wisdom saving throws with advantage, and hit point maximum increases by 2d10 for 24 hours",
                img: "icons/magic/life/heart-cross-strong-flame-purple-orange.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_DAY,
                },
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
                name: "Heroism",
                description: "Immunity to frightened for 1 minute",
                img: "icons/magic/life/heart-cross-strong-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                name: "Hideous Laughter",
                description:
                    "Apply the effects of the prone and incapacitated conditions for 1 minute",
                img: "icons/magic/fire/explosion-fireball-medium-purple-pink.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
                changes: [
                    ...(this.#incapacitated.changes ?? []),
                    ...(this.#prone.changes ?? []),
                ],
            },
        });
    }

    get #holdMonster(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Hold Monster",
                description:
                    "Apply the effects of the paralyzed condition for 1 minute",
                img: "icons/magic/control/debuff-chains-ropes-red.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
                changes: this.#paralyzed.changes,
            },
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "mantle-of-madness",
                },
            ],
        });
    }

    // TODO: potentially use overtime here if find a good way to do it
    // flags.midi-qol.OverTime
    // turn=end,
    // saveAbility=wis,
    // saveDC=30,
    // label=Hold Person
    get #holdPerson(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Hold Person",
                description:
                    "Apply the effects of the paralyzed condition for 1 minute",
                img: "icons/magic/control/debuff-chains-ropes-purple.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
                changes: this.#paralyzed.changes,
            },
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "mantle-of-madness",
                },
            ],
        });
    }

    get #holyAura(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Holy Aura",
                description:
                    "Advantage on saving throws, grant disadvantage to all who attack, and emit dim light in 5 radius (requires ATL) for 1 minute",
                img: "icons/magic/control/buff-flight-wings-runes-blue-white.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                ],
            },
            atlChanges: [
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
        });
    }

    get #huntersMark(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Hunter's Mark",
                description:
                    "No active effects and lasts until removed (for now)",
                img: "icons/magic/perception/eye-ringed-glow-angry-small-red.webp",
            },
        });
    }

    get #invisibility(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Invisibility",
                description:
                    "Grants advantage on next attack roll while forcing disadvantage to all who attack for 1 hour. Expires after 1 attack.",
                img: "icons/magic/air/fog-gas-smoke-dense-gray.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                flags: {
                    dae: {
                        specialDuration: ["1Attack", "1Spell"],
                    },
                },
                statuses: ["invisible"],
            },
            subEffects: [this.#invisible],
        });
    }

    get #irresistibleDance(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Irresistible Dance",
                description:
                    "Zero movement, disadvantage on dexterity saving throws, disadvantage on attack rolls, and grants advantage to all who attack for 1 minute",
                img: "icons/magic/control/energy-stream-link-large-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                name: "Jump",
                description: "No active effects and lasts for 1 minute",
                img: "icons/magic/control/debuff-energy-hold-blue-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
            },
        });
    }

    get #light(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Light",
                description: "Emits 20/40 light for 1 hour (requires ATL)",
                img: "icons/magic/light/explosion-star-small-blue-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
            },
            atlChanges: [
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
        });
    }

    get #longstrider(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Longstrider",
                description: "Increase all movement by 10 ft. for 1 hour",
                img: "icons/magic/air/wind-stream-blue-gray.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
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
                name: "Mage Armor",
                description: "Upgrades armor to 13 + dex modifier for 8 hours",
                img: "icons/magic/defensive/shield-barrier-glowing-triangle-blue.webp",
                duration: {
                    seconds: SECONDS.IN_EIGHT_HOURS,
                },
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
                name: "Mind Blank",
                description: "Adds immunity to psychic damage for 24 hours",
                img: "icons/magic/air/air-burst-spiral-large-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_DAY,
                },
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
                name: "Mirror Image",
                description: "No active effects and lasts for 1 minute",
                img: "icons/magic/control/debuff-energy-hold-levitate-pink.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
            },
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "images",
                },
            ],
        });
    }

    get #passWithoutTrace(): PreCreate<ActiveEffectSource> {
        // TODO token magic effects
        return createConvenientEffect({
            effect: {
                name: "Pass without Trace",
                description: "Add 10 to stealth checks for 1 hour",
                img: "icons/magic/air/fog-gas-smoke-brown.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                changes: [
                    {
                        key: "system.skills.ste.bonuses.check",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+10",
                    },
                ],
            },
        });
    }

    get #protectionFromEnergy(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Protection from Energy",
                description:
                    "Choose between acid, cold, fire, lightning, or thunder resistance",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-teal.webp",
            },
            nestedEffects: [
                this.#protectionFromEnergyAcid,
                this.#protectionFromEnergyCold,
                this.#protectionFromEnergyFire,
                this.#protectionFromEnergyLightning,
                this.#protectionFromEnergyThunder,
            ],
        });
    }

    get #protectionFromEnergyAcid(): PreCreate<ActiveEffectSource> {
        // TODO token magic effects
        return createConvenientEffect({
            effect: {
                name: "Protection from Acid",
                description: "Adds damage resistance to acid for 1 hour",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-acid.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "acid",
                    },
                ],
            },
        });
    }

    get #protectionFromEnergyCold(): PreCreate<ActiveEffectSource> {
        // TODO token magic effects
        return createConvenientEffect({
            effect: {
                name: "Protection from Cold",
                description: "Adds damage resistance to cold for 1 hour",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "cold",
                    },
                ],
            },
        });
    }

    get #protectionFromEnergyFire(): PreCreate<ActiveEffectSource> {
        // TODO token magic effects
        return createConvenientEffect({
            effect: {
                name: "Protection from Fire",
                description: "Adds damage resistance to fire for 1 hour",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-red.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "fire",
                    },
                ],
            },
        });
    }

    get #protectionFromEnergyLightning(): PreCreate<ActiveEffectSource> {
        // TODO token magic effects
        return createConvenientEffect({
            effect: {
                name: "Protection from Lightning",
                description: "Adds damage resistance to lightning for 1 hour",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "lightning",
                    },
                ],
            },
        });
    }

    get #protectionFromEnergyThunder(): PreCreate<ActiveEffectSource> {
        // TODO token magic effects
        return createConvenientEffect({
            effect: {
                name: "Protection from Thunder",
                description: "Adds damage resistance to thunder for 1 hour",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-teal-purple.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "thunder",
                    },
                ],
            },
        });
    }

    get #protectionFromPoison(): PreCreate<ActiveEffectSource> {
        // TODO token magic effects
        return createConvenientEffect({
            effect: {
                name: "Protection from Poison",
                description:
                    "Adds resistance to poison for 1 hour (does not grant automatic advantage on saving throws against poison)",
                img: "icons/magic/defensive/shield-barrier-glowing-triangle-green.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "poison",
                    },
                ],
            },
        });
    }

    get #protectionFromEvilAndGood(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Protection from Evil and Good",
                description: "No active effects and lasts for 10 minutes",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
            },
        });
    }

    get #rayOfFrost(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Ray of Frost",
                description: "Lowers movement by 10 ft",
                img: "icons/magic/light/beam-rays-blue-small.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_ROUND_DND5E,
                },
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
                name: "Regenerate",
                description:
                    "Regain 1 hit point at the start of each turn for 1 hour",
                img: "icons/magic/life/heart-cross-strong-flame-green.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
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
                name: "Resilient Sphere",
                description:
                    "Adds total immunity to all damage and half movement for 1 minute",
                img: "icons/magic/light/explosion-star-large-pink.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                name: "Resistance",
                description:
                    "Add 1d4 to a single saving throw in the next minute",
                img: "icons/magic/defensive/shield-barrier-glowing-triangle-orange.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                name: "Shield",
                description: "Add 5 to AC until next turn",
                img: "icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_ROUND_DND5E,
                },
                flags: {
                    dae: {
                        specialDuration: ["turnStart"],
                    },
                },
                changes: [
                    {
                        key: "system.attributes.ac.bonus",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+5",
                        priority: 5,
                    },
                ],
            },
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "water-field",
                },
            ],
        });
    }

    get #shieldOfFaith(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Shield of Faith",
                description: "Adds 2 to the AC for 10 minutes",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
                changes: [
                    {
                        key: "system.attributes.ac.bonus",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "+2",
                    },
                ],
            },
            tokenMagicChanges: [
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "bloom",
                },
            ],
        });
    }

    get #slow(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Slow",
                description:
                    "Halves movement and and subtract 2 from AC and dexterity saving throws for 1 minute",
                img: "icons/magic/air/fog-gas-smoke-dense-pink.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                name: "Speak with Animals",
                description: "No active effects and lasts for 10 minutes",
                img: "icons/magic/nature/wolf-paw-glow-small-teal-blue.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
            },
        });
    }

    get #speakWithDead(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Speak with Dead",
                description: "No active effects and lasts for 10 minutes",
                img: "icons/magic/control/fear-fright-shadow-monster-green.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
            },
        });
    }

    get #speakWithPlants(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Speak with Plants",
                description: "No active effects and lasts for 10 minutes",
                img: "icons/magic/nature/leaf-glow-teal.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
            },
        });
    }

    get #spiderClimb(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Spider Climb",
                description:
                    "Grants climbing speed equal to walking speed for 1 hour",
                img: "icons/magic/control/debuff-chains-blue.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
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
                name: "Spirit Guardians",
                description: "No active effects and lasts for 10 minutes",
                img: "icons/magic/light/projectile-bolts-salvo-white.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
            },
        });
    }

    get #spiritualWeapon(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Spiritual Weapon",
                description: "No active effects and lasts for 1 minute",
                img: "icons/magic/fire/dagger-rune-enchant-flame-purple.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
            },
        });
    }

    get #stoneskin(): PreCreate<ActiveEffectSource> {
        // TODO token magic effects
        return createConvenientEffect({
            effect: {
                name: "Stoneskin",
                description:
                    "Adds resistance to non-magical physical damage for 1 hour",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
                changes: [
                    {
                        key: "system.traits.dr.value",
                        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                        value: "physical",
                    },
                ],
            },
        });
    }

    get #suggestion(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Suggestion",
                description: "No active effects and lasts for 8 hours",
                img: "icons/magic/air/air-burst-spiral-pink.webp",
                duration: {
                    seconds: SECONDS.IN_EIGHT_HOURS,
                },
            },
        });
    }

    get #telekinesis(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Telekinesis",
                description: "No active effects and lasts for 10 minutes",
                img: "icons/magic/control/debuff-energy-hold-levitate-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
            },
        });
    }

    get #trueStrike(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "True Strike",
                description:
                    "Grants advantage on next attack or until the end of next turn",
                img: "icons/magic/fire/dagger-rune-enchant-blue-gray.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_ROUND_DND5E,
                    turns: 1,
                },
                flags: {
                    dae: {
                        specialDuration: ["1Attack"],
                    },
                },
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
                name: "Vicious Mockery",
                description:
                    "Grants disadvantage on next attack or until the end of next turn",
                img: "icons/skills/toxins/cup-goblet-poisoned-spilled.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_ROUND_DND5E,
                    turns: 1,
                },
                flags: {
                    dae: {
                        specialDuration: ["1Attack"],
                    },
                },
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
                name: "Warding Bond",
                description:
                    "Adds 1 to AC and saving throws and grants resistance to all damage for 1 hour",
                img: "icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
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
                name: "Water Breathing",
                description: "No active effects and lasts for 24 hours",
                img: "icons/magic/water/pseudopod-swirl-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_DAY,
                },
            },
        });
    }

    get #waterWalk(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Water Walk",
                description: "No active effects and lasts for 1 hour",
                img: "icons/creatures/slimes/slime-movement-swirling-blue.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
            },
        });
    }

    get #bardicInspiration(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Bardic Inspiration",
                description:
                    "Add a dice to a single ability check, attack roll, or saving throw in the next 10 minutes",
                img: "icons/skills/melee/unarmed-punch-fist.webp",
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
            },
            nestedEffects: [
                this.#bardicInspirationD6,
                this.#bardicInspirationD8,
                this.#bardicInspirationD10,
                this.#bardicInspirationD12,
            ],
        });
    }

    get #bardicInspirationD6(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Bardic Inspiration (d6)",
                description: "For bards from level 1 to level 4",
                img: "icons/skills/melee/unarmed-punch-fist.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
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
                name: "Bardic Inspiration (d8)",
                description: "For bards from level 5 to level 9",
                img: "icons/skills/melee/unarmed-punch-fist.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
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
                name: "Bardic Inspiration (d10)",
                description: "For bards from level 10 to level 14",
                img: "icons/skills/melee/unarmed-punch-fist.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
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
                name: "Bardic Inspiration (d12)",
                description: "For bards from level 15 to level 20",
                img: "icons/skills/melee/unarmed-punch-fist.webp",
                // isViewable: this._settings.showNestedEffects,
                duration: {
                    seconds: SECONDS.IN_TEN_MINUTES,
                },
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
                name: "Channel Divinity: Sacred Weapon",
                description:
                    "Add charisma modifier (minimum +1) to all weapon attack rolls and emits 20/40 light for 1 minute (requires ATL)",
                img: "icons/weapons/swords/sword-gold-holy.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                ],
            },
            atlChanges: [
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
        });
    }

    get #channelDivinityTurnTheUnholy(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Channel Divinity: Turn the Unholy",
                description:
                    "No active effects and lasts for 1 minute. Expires on taking damage.",
                img: "icons/magic/fire/explosion-embers-evade-silhouette.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
                flags: {
                    dae: {
                        specialDuration: ["isDamaged"],
                    },
                },
            },
        });
    }

    get #channelDivinityTurnUndead(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Channel Divinity: Turn Undead",
                description:
                    "No active effects and lasts for 1 minute. Expires on taking damage.",
                img: "icons/magic/fire/flame-burning-creature-skeleton.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
                flags: {
                    dae: {
                        specialDuration: ["isDamaged"],
                    },
                },
            },
        });
    }

    get #kiEmptyBody(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Ki: Empty Body",
                description:
                    "Grants advantage on attack rolls, forces disadvantage to all who attack, and grants resistance to all damage except force for 1 minute",
                img: "icons/magic/perception/silhouette-stealth-shadow.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
                name: "Ki: Patient Defense",
                description:
                    "Grants disadvantage to all who attack and advantage on all dexterity saving throws until next turn",
                img: "icons/magic/defensive/shield-barrier-glowing-blue.webp",
                flags: {
                    dae: {
                        specialDuration: ["turnStart"],
                    },
                },
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
                name: "Rage",
                description:
                    "Advantage on strength checks and strength saving throws, a variable bonus to melee damage based on barbarian level, and resistance to piercing, bludgeoning, and slashing damage for 1 minute. Also handles Path of the Totem Warrior resistances.",
                img: "icons/creatures/abilities/mouth-teeth-human.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_MINUTE,
                },
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
        return createConvenientEffect({
            effect: {
                name: "Reckless Attack",
                description:
                    "Advantage on melee attacks for a turn and grants advantage to those who attack for 1 round",
                img: "icons/skills/melee/blade-tips-triple-bent-white.webp",
                flags: {
                    dae: {
                        specialDuration: ["turnStart"],
                    },
                },
                changes: [
                    {
                        key: `flags.midi-qol.grants.advantage.attack.all`,
                        mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                        value: "1",
                    },
                ],
            },
            subEffects: [
                createConvenientEffect({
                    effect: {
                        name: "Reckless Attack (advantage on attacks)",
                        description:
                            "Advantage on melee attacks until end of turn",
                        img: "icons/skills/melee/blade-tips-triple-bent-white.webp",
                        duration: {
                            turns: 1,
                        },
                        changes: [
                            {
                                key: `flags.midi-qol.advantage.attack.mwak`,
                                mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                                value: "1",
                            },
                        ],
                    },
                }),
            ],
        });
    }

    get #bullseyeLantern(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Bullseye Lantern",
                description:
                    "Adds lantern light in a 60 degree cone for 6 hours (requires ATL)",
                img: "icons/sundries/lights/lantern-iron-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_SIX_HOURS,
                },
            },
            atlChanges: [
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
        });
    }

    get #candle(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Candle",
                description: "Adds candle light for 1 hour (requires ATL)",
                img: "icons/sundries/lights/candle-unlit-white.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
            },
            atlChanges: [
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
        });
    }

    get #hoodedLantern(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Hooded Lantern",
                description:
                    "Adds hooded lantern light for 6 hours (requires ATL)",
                img: "icons/sundries/lights/lantern-iron-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_SIX_HOURS,
                },
            },
            atlChanges: [
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
        });
    }

    get #lantern(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Lantern",
                description: "Adds lantern light for 6 hours (requires ATL)",
                img: "icons/sundries/lights/lantern-iron-yellow.webp",
                duration: {
                    seconds: SECONDS.IN_SIX_HOURS,
                },
            },
            atlChanges: [
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
        });
    }

    get #torch(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Torch",
                description: "Adds torch light for 1 hour (requires ATL)",
                img: "icons/sundries/lights/torch-black.webp",
                duration: {
                    seconds: SECONDS.IN_ONE_HOUR,
                },
            },
            atlChanges: [
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
        });
    }

    get #bonusAction(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Bonus Action",
                description: "No active effects and expires on turn start",
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
                name: "Cover (Half)",
                description: "Adds 2 to AC and dexterity saving throws",
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
                name: "Cover (Three-Quarters)",
                description: "Adds 5 to AC and dexterity saving throws",
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
                name: "Cover (Total)",
                description: "Causes all attacks to fail automatically",
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
                name: "Encumbered",
                description: "Lowers movement by 10 ft.",
                img: "icons/svg/down.svg",
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
                name: "Dodge",
                description:
                    "Grants disadvantage to all who attack and advantage on all dexterity saving throws until next turn",
                img: "modules/dfreds-convenient-effects/images/dodging.svg",
                flags: {
                    dae: {
                        specialDuration: ["turnStart"],
                    },
                },
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

    get #flanked(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Flanked",
                description: "Grants advantage to all who melee attack",
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
                name: "Flanking",
                description: "Grants advantage on melee attack rolls",
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
                name: "Great Weapon Master",
                description:
                    "Subtracts 5 from melee attacks but adds 10 to melee damage",
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
                name: "Heavily Encumbered",
                description:
                    "Lowers movement by 20 ft., disadvantage on all attack rolls, and disadvantage on strength, dexterity, and constitution saves",
                img: "icons/svg/downgrade.svg",
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
                name: "Inspiration",
                description:
                    "Advantage on everything and expires after any action, save, check, or skill roll",
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
                name: "Ranged Disadvantage",
                description: "Disadvantage on ranged attack rolls",
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
                name: "Reaction",
                description: "No active effects and expires on turn start",
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
                name: "Ready",
                description: "No active effects and expires on turn start",
                img: "modules/dfreds-convenient-effects/images/ready.svg",
                flags: {
                    dae: {
                        specialDuration: ["turnStart"],
                    },
                },
            },
        });
    }

    get #sharpshooter(): PreCreate<ActiveEffectSource> {
        return createConvenientEffect({
            effect: {
                name: "Sharpshooter",
                description:
                    "Subtracts 5 from ranged attacks but adds 10 to ranged damage",
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
