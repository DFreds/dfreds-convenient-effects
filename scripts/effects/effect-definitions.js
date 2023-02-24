import Constants from '../constants.js';
import Settings from '../settings.js';
import CustomEffectsHandler from './custom-effects-handler.js';
import { createActiveEffect } from './effect-helpers.js';

/**
 * Defines all of the effect definitions
 */
export default class EffectDefinitions {
  constructor() {
    this._customEffectsHandler = new CustomEffectsHandler();
    this._settings = new Settings();

    this._flagPrefix = 'midi-qol';
    if (game.modules.get('wire')?.active) {
      this._flagPrefix = 'wire';
    }
  }

  /**
   * Get all effects
   *
   * @returns {ActiveEffect[]} all the effects
   */
  get all() {
    return [
      ...this.conditions,
      ...this.customEffects,
      ...this.spells,
      ...this.classFeatures,
      ...this.equipment,
      ...this.other,
    ];
  }

  /**
   * Get all the condition effects
   *
   * @returns {ActiveEffect[]} all the condition effects
   */
  get conditions() {
    return [
      this._blinded,
      this._charmed,
      this._concentrating,
      this._dead,
      this._deafened,
      this._exhaustion1,
      this._exhaustion2,
      this._exhaustion3,
      this._exhaustion4,
      this._exhaustion5,
      this._frightened,
      this._grappled,
      this._incapacitated,
      this._invisible,
      this._paralyzed,
      this._petrified,
      this._poisoned,
      this._prone,
      this._restrained,
      this._stunned,
      this._unconscious,
      this._wounded,
    ];
  }

  /**
   * Get all the custom effects
   *
   * @returns {ActiveEffect[]} all the custom effects
   */
  get customEffects() {
    return this._customEffectsHandler.getCustomEffects();
  }

  /**
   * Get all the spell effects
   *
   * @returns {ActiveEffect[]} all the spell effects
   */
  get spells() {
    return [
      this._acidArrow,
      this._aid,
      this._alterSelf,
      this._antilifeShell,
      this._arcaneHand,
      this._bane,
      this._barkskin,
      this._beaconOfHope,
      this._blackTentacles,
      this._bless,
      this._blindnessDeafness,
      this._blindnessDeafnessBlindness,
      this._blindnessDeafnessDeafness,
      this._blur,
      this._charmPerson,
      this._command,
      this._comprehendLanguages,
      this._contagion,
      this._contagionBlindingSickness,
      this._contagionFilthFever,
      this._contagionFleshRot,
      this._contagionMindfire,
      this._contagionSeizure,
      this._contagionSlimyDoom,
      this._darkvision,
      this._disguiseSelf,
      this._divineFavor,
      this._divineWord,
      this._enlargeReduce,
      this._enlargeReduceEnlarge,
      this._enlargeReduceReduce,
      this._enhanceAbility,
      this._enhanceAbilityBearsEndurance,
      this._enhanceAbilityBullsStrength,
      this._enhanceAbilityCatsGrace,
      this._enhanceAbilityEaglesSplendor,
      this._enhanceAbilityFoxsCunning,
      this._enhanceAbilityOwlsWisdom,
      this._faerieFire,
      this._falseLife,
      this._featherFall,
      this._feeblemind,
      this._fireShield,
      this._fireShieldColdResistance,
      this._fireShieldFireResistance,
      this._findThePath,
      this._fly,
      this._foresight,
      this._freedomOfMovement,
      this._globeOfInvulnerability,
      this._greaterInvisibility,
      this._guidance,
      this._guidingBolt,
      this._haste,
      this._heroesFeast,
      this._heroism,
      this._hideousLaughter,
      this._holdMonster,
      this._holdPerson,
      this._holyAura,
      this._huntersMark,
      this._invisibility,
      this._irresistibleDance,
      this._jump,
      this._light,
      this._longstrider,
      this._mageArmor,
      this._mindBlank,
      this._mirrorImage,
      this._passWithoutTrace,
      this._protectionFromEnergy,
      this._protectionFromEnergyAcid,
      this._protectionFromEnergyCold,
      this._protectionFromEnergyFire,
      this._protectionFromEnergyLightning,
      this._protectionFromEnergyThunder,
      this._protectionFromPoison,
      this._protectionFromEvilAndGood,
      this._rayOfFrost,
      this._regenerate,
      this._resilientSphere,
      this._resistance,
      this._shield,
      this._shieldOfFaith,
      this._slow,
      this._speakWithAnimals,
      this._speakWithDead,
      this._speakWithPlants,
      this._spiderClimb,
      this._spiritGuardians,
      this._spiritualWeapon,
      this._stoneskin,
      this._suggestion,
      this._telekinesis,
      this._trueStrike,
      this._viciousMockery,
      this._wardingBond,
      this._waterBreathing,
      this._waterWalk,
    ];
  }

  /**
   * Get all the class feature effects
   *
   * @returns {ActiveEffect[]} all the class feature effects
   */
  get classFeatures() {
    return [
      this._bardicInspiration,
      this._bardicInspirationD6,
      this._bardicInspirationD8,
      this._bardicInspirationD10,
      this._bardicInspirationD12,
      this._channelDivinitySacredWeapon,
      this._channelDivinityTurnTheUnholy,
      this._channelDivinityTurnUndead,
      this._kiEmptyBody,
      this._kiPatientDefense,
      this._rage,
      this._recklessAttack,
    ];
  }

  /**
   * Get all the equipment effects
   *
   * @returns {ActiveEffect[]} all the equipment effects
   */
  get equipment() {
    return [
      this._bullseyeLantern,
      this._candle,
      this._hoodedLantern,
      this._lantern,
      this._torch,
    ];
  }

  /**
   * Get all the other effects
   *
   * @returns {ActiveEffect[]} all the other effects
   */
  get other() {
    return [
      this._bonusAction,
      this._coverHalf,
      this._coverThreeQuarters,
      this._encumbered,
      this._dodge,
      this._flanked,
      this._flanking,
      this._greatWeaponMaster,
      this._heavilyEncumbered,
      this._inspiration,
      this._rangedDisadvantage,
      this._reaction,
      this._ready,
      this._sharpshooter,
    ];
  }

  /* Condition Effects */
  get _blinded() {
    return createActiveEffect({
      label: 'Blinded',
      description:
        "- A blinded creature can't see and automatically fails any ability check that requires sight.<br/>- Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.",
      icon: 'modules/dfreds-convenient-effects/images/blinded.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _charmed() {
    return createActiveEffect({
      label: 'Charmed',
      description:
        "- A charmed creature can't attack the charmer or target the charmer with harmful abilities or magical effects.<br/>- The charmer has advantage on any ability check to interact socially with the creature.",
      icon: 'modules/dfreds-convenient-effects/images/charmed.svg',
    });
  }

  get _concentrating() {
    return createActiveEffect({
      label: 'Concentrating',
      description:
        'Some Spells require you to maintain Concentration in order to keep their magic active. If you lose Concentration, such a spell ends.',
      icon: 'modules/dfreds-convenient-effects/images/concentrating.svg',
    });
  }

  get _dead() {
    return createActiveEffect({
      label: 'Dead',
      description: 'No active effects',
      icon: 'icons/svg/skull.svg',
    });
  }

  get _deafened() {
    return createActiveEffect({
      label: 'Deafened',
      description:
        "- A deafened creature can't hear and automatically fails any ability check that requires hearing.",
      icon: 'modules/dfreds-convenient-effects/images/deafened.svg',
    });
  }

  get _exhaustion1() {
    return createActiveEffect({
      label: 'Exhaustion 1',
      description: 'Disadvantage on ability checks',
      icon: 'modules/dfreds-convenient-effects/images/exhaustion1.svg',
      changes: [
        {
          key: 'system.attributes.exhaustion',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'flags.dnd5e.initiativeDisadv',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _exhaustion2() {
    return createActiveEffect({
      label: 'Exhaustion 2',
      description: 'Disadvantage on ability checks and speed halved',
      icon: 'modules/dfreds-convenient-effects/images/exhaustion2.svg',
      changes: [
        {
          key: 'system.attributes.exhaustion',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '2',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'flags.dnd5e.initiativeDisadv',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '*0.5',
          priority: 25,
        },
      ],
    });
  }

  get _exhaustion3() {
    return createActiveEffect({
      label: 'Exhaustion 3',
      description:
        'Disadvantage on ability checks, speed halved, and disadvantage on attacks and saving throws',
      icon: 'modules/dfreds-convenient-effects/images/exhaustion3.svg',
      changes: [
        {
          key: 'system.attributes.exhaustion',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '3',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'flags.dnd5e.initiativeDisadv',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '*0.5',
          priority: 25,
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _exhaustion4() {
    return createActiveEffect({
      label: 'Exhaustion 4',
      description:
        'Disadvantage on ability checks, speed halved, disadvantage on attacks and saving throws, and hit point maximum halved',
      icon: 'modules/dfreds-convenient-effects/images/exhaustion4.svg',
      changes: [
        {
          key: 'system.attributes.exhaustion',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '4',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'flags.dnd5e.initiativeDisadv',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '*0.5',
          priority: 25,
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.attributes.hp.max',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
          priority: 5,
        },
      ],
    });
  }

  get _exhaustion5() {
    return createActiveEffect({
      label: 'Exhaustion 5',
      description:
        'Disadvantage on ability checks, speed reduced to 0, disadvantage on attacks and saving throws, and hit point maximum halved',
      icon: 'modules/dfreds-convenient-effects/images/exhaustion5.svg',
      changes: [
        {
          key: 'system.attributes.exhaustion',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '5',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'flags.dnd5e.initiativeDisadv',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '0',
          priority: 25,
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.attributes.hp.max',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
          priority: 5,
        },
      ],
    });
  }

  get _frightened() {
    return createActiveEffect({
      label: 'Frightened',
      description:
        "- A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.<br/>- The creature can't willingly move closer to the source of its fear.",
      icon: 'modules/dfreds-convenient-effects/images/frightened.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _grappled() {
    return createActiveEffect({
      label: 'Grappled',
      description:
        "- A grappled creature's speed becomes 0, and it can't benefit from any bonus to its speed.<br/>- The condition ends if the grappler is incapacitated.<br/>- The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect.",
      icon: 'modules/dfreds-convenient-effects/images/grappled.svg',
      changes: [
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '0',
          priority: 25,
        },
      ],
    });
  }

  get _incapacitated() {
    return createActiveEffect({
      label: 'Incapacitated',
      description:
        "- An incapacitated creature can't take actions or reactions",
      icon: 'modules/dfreds-convenient-effects/images/incapacitated.svg',
    });
  }

  get _invisible() {
    return createActiveEffect({
      label: 'Invisible',
      description:
        "- An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured. The creature's location can be detected by any noise it makes or any tracks it leaves.<br/>- Attack rolls against the creature have disadvantage, and the creature's attack rolls have advantage.",
      icon: 'modules/dfreds-convenient-effects/images/invisible.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _paralyzed() {
    return createActiveEffect({
      label: 'Paralyzed',
      description:
        "- A paralyzed creature is incapacitated (see the condition) and can't move or speak.<br/>- The creature automatically fails Strength and Dexterity saving throws. Attack rolls against the creature have advantage.<br/>- Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.",
      icon: 'modules/dfreds-convenient-effects/images/paralyzed.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.fail.ability.save.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.fail.ability.save.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.critical.range`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '5',
        },
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '0',
          priority: 25,
        },
      ],
    });
  }

  get _petrified() {
    return createActiveEffect({
      label: 'Petrified',
      description:
        "- A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.<br/>- The creature is incapacitated (see the condition), can't move or speak, and is unaware of its surroundings.<br/>- Attack rolls against the creature have advantage.<br/>- The creature automatically fails Strength and Dexterity saving throws.<br/>- The creature has resistance to all damage.<br/>- The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized. Remove all movement, grant advantage to all who attack, and add damage resistance to all magical and physical attacks",
      icon: 'modules/dfreds-convenient-effects/images/petrified.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.fail.ability.save.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.fail.ability.save.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.traits.di.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'poison',
        },
        {
          key: 'system.traits.dr.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'physical',
        },
        {
          key: 'system.traits.dr.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'magical',
        },
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '0',
          priority: 25,
        },
      ],
    });
  }

  get _poisoned() {
    return createActiveEffect({
      label: 'Poisoned',
      description:
        '- A poisoned creature has disadvantage on attack rolls and ability checks.',
      icon: 'modules/dfreds-convenient-effects/images/poisoned.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _prone() {
    return createActiveEffect({
      label: 'Prone',
      description:
        "- A prone creature's only movement option is to crawl, unless it stands up and thereby ends the condition.<br/>- The creature has disadvantage on attack rolls.<br/>- An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.",
      icon: 'modules/dfreds-convenient-effects/images/prone.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.mwak`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.msak`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.rwak`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.rsak`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '*0.5',
          priority: 25,
        },
      ],
    });
  }

  get _restrained() {
    return createActiveEffect({
      label: 'Restrained',
      description:
        "- A restrained creature's speed becomes 0, and it can't benefit from any bonus to its speed.<br/>- Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.<br/>- The creature has disadvantage on Dexterity saving throws.",
      icon: 'modules/dfreds-convenient-effects/images/restrained.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '0',
          priority: 25,
        },
      ],
    });
  }

  get _stunned() {
    return createActiveEffect({
      label: 'Stunned',
      description:
        "- A stunned creature is incapacitated (see the condition), can't move, and can speak only falteringly.<br/>- The creature automatically fails Strength and Dexterity saving throws.<br/>- Attack rolls against the creature have advantage.",
      icon: 'modules/dfreds-convenient-effects/images/stunned.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.fail.ability.save.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.fail.ability.save.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _unconscious() {
    return createActiveEffect({
      label: 'Unconscious',
      description:
        "- An unconscious creature is incapacitated (See the condition) can't move or speak, and is unaware of its surroundings.<br/>- The creature drops whatever its holding and falls prone (See the condition).<br/>- The creature automatically fails Strength and Dexterity saving throws.<br/>- Attack rolls against the creature have advantage.<br/>- Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.",
      icon: 'icons/svg/unconscious.svg',
      changes: [...this._paralyzed.changes],
    });
  }

  get _wounded() {
    return createActiveEffect({
      label: 'Wounded',
      description: 'No active effects',
      icon: 'modules/dfreds-convenient-effects/images/wounded.svg',
    });
  }

  /* Spell Effects */
  get _acidArrow() {
    return createActiveEffect({
      label: 'Acid Arrow',
      description: 'Causes 2d4 acid damage at the end of next turn',
      icon: 'icons/magic/acid/projectile-bolts-salvo-green.webp',
      changes: [
        {
          key: `flags.${this._flagPrefix}.OverTime`,
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value:
            'turn=end,removeCondition=true,damageRoll=2d4,damageType=acid,label=Acid Arrow',
        },
      ],
    });
  }

  get _aid() {
    return createActiveEffect({
      label: 'Aid',
      description: 'Add to current and maximum hit points for 8 hours',
      icon: 'icons/magic/life/heart-cross-blue.webp',
      seconds: Constants.SECONDS.IN_EIGHT_HOURS,
    });
  }

  get _alterSelf() {
    return createActiveEffect({
      label: 'Alter Self',
      description: 'No active effects and lasts for 1 hour',
      icon: 'icons/magic/control/debuff-energy-hold-green.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  get _antilifeShell() {
    return createActiveEffect({
      label: 'Antilife Shell',
      description: 'No active effects and lasts for 1 hour',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-teal.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  get _arcaneHand() {
    return createActiveEffect({
      label: 'Arcane Hand',
      description: 'No active effects and lasts for 1 minute',
      icon: 'icons/magic/fire/projectile-fireball-smoke-strong-teal.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
    });
  }

  get _bane() {
    return createActiveEffect({
      label: 'Bane',
      description:
        'Subtract 1d4 from all saving throws and attack rolls for 1 minute',
      icon: 'icons/magic/unholy/strike-beam-blood-red-purple.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.bonuses.abilities.save',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
        {
          key: 'system.bonuses.msak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
        {
          key: 'system.bonuses.mwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
        {
          key: 'system.bonuses.rsak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
        {
          key: 'system.bonuses.rwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
      ],
    });
  }

  get _barkskin() {
    // TODO token magic effects
    return createActiveEffect({
      label: 'Barkskin',
      description: 'Upgrade AC to 16 for 1 hour',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.attributes.ac.value',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: '16',
          priority: 5,
        },
      ],
    });
  }

  get _beaconOfHope() {
    return createActiveEffect({
      label: 'Beacon of Hope',
      description:
        'Adds advantage to wisdom saving throws and death saving throws for 1 minute',
      icon: 'icons/magic/light/explosion-star-large-blue-yellow.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.ability.save.wis`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.deathSave`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _blackTentacles() {
    return createActiveEffect({
      label: 'Black Tentacles',
      description: 'Apply the effects of the restrained condition for 1 minute',
      icon: 'icons/magic/nature/vines-thorned-curled-glow-teal-purple.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [...this._restrained.changes],
    });
  }

  get _bless() {
    return createActiveEffect({
      label: 'Bless',
      description: 'Add 1d4 to all saving throws and attack rolls for 1 minute',
      icon: 'icons/magic/control/buff-flight-wings-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.bonuses.abilities.save',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+1d4',
        },
        {
          key: 'system.bonuses.msak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+1d4',
        },
        {
          key: 'system.bonuses.mwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+1d4',
        },
        {
          key: 'system.bonuses.rsak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+1d4',
        },
        {
          key: 'system.bonuses.rwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+1d4',
        },
      ],
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'bloom',
        },
      ],
    });
  }

  get _blindnessDeafness() {
    return createActiveEffect({
      label: 'Blindness/Deafness',
      description: 'Choose between blindness or deafness',
      icon: 'icons/magic/perception/eye-ringed-glow-angry-red.webp',
      nestedEffects: [
        this._blindnessDeafnessBlindness.label,
        this._blindnessDeafnessDeafness.label,
      ],
    });
  }

  get _blindnessDeafnessBlindness() {
    return createActiveEffect({
      label: 'Blindness',
      description:
        'Disadvantage on attack rolls while granting advantage to all who attack for 1 minute',
      icon: 'icons/magic/perception/eye-ringed-glow-angry-red.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [...this._blinded.changes],
    });
  }

  get _blindnessDeafnessDeafness() {
    return createActiveEffect({
      label: 'Deafness',
      description: 'No active effects and lasts for 1 minute',
      icon: 'icons/magic/perception/eye-ringed-glow-angry-red.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [...this._deafened.changes],
    });
  }

  get _blur() {
    return createActiveEffect({
      label: 'Blur',
      description: 'Grants disadvantage to all who attack for 1 minute',
      icon: 'icons/magic/air/air-burst-spiral-blue-gray.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'blur',
        },
      ],
    });
  }

  get _charmPerson() {
    return createActiveEffect({
      label: 'Charm Person',
      description: 'No active effects and lasts for 1 hour',
      icon: 'icons/magic/fire/explosion-fireball-medium-purple-pink.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [...this._charmed.changes],
    });
  }

  get _command() {
    return createActiveEffect({
      label: 'Command',
      description: 'No active effects and lasts until the end of next turn',
      icon: 'icons/magic/fire/explosion-fireball-small-purple.webp',
      seconds: CONFIG.time.roundTime,
      turns: 1,
    });
  }

  get _comprehendLanguages() {
    return createActiveEffect({
      label: 'Comprehend Languages',
      description: 'Adds all languages for 1 hour',
      icon: 'icons/magic/symbols/runes-triangle-orange-purple.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.traits.languages.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _contagion() {
    return createActiveEffect({
      label: 'Contagion',
      description:
        'Choose between blinding sickness, filth fever, flesh rot, mindfire, seizure, or slimy doom',
      icon: 'icons/magic/unholy/strike-beam-blood-large-red-purple.webp',
      nestedEffects: [
        this._contagionBlindingSickness.label,
        this._contagionFilthFever.label,
        this._contagionFleshRot.label,
        this._contagionMindfire.label,
        this._contagionSeizure.label,
        this._contagionSlimyDoom.label,
      ],
    });
  }

  get _contagionBlindingSickness() {
    return createActiveEffect({
      label: 'Blinding Sickness',
      description:
        'Disadvantage on wisdom checks and wisdom saving throws for 7 days',
      icon: 'icons/magic/unholy/strike-beam-blood-large-red-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_WEEK,
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.wis`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.wis`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        ...this._blinded.changes,
      ],
    });
  }

  get _contagionFilthFever() {
    return createActiveEffect({
      label: 'Filth Fever',
      description:
        'Disadvantage on strength checks strength saving throws, and attacks that use strength for 7 days',
      icon: 'icons/magic/unholy/strike-beam-blood-large-red-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_WEEK,
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _contagionFleshRot() {
    return createActiveEffect({
      label: 'Flesh Rot',
      description:
        'Disadvantage on charisma checks and vulnerability to all damage',
      icon: 'icons/magic/unholy/strike-beam-blood-large-red-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_WEEK,
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.cha`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.traits.dv.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _contagionMindfire() {
    return createActiveEffect({
      label: 'Mindfire',
      description:
        'Disadvantage on intelligence checks and intelligence saving throws for 7 days',
      icon: 'icons/magic/unholy/strike-beam-blood-large-red-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_WEEK,
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.int`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.int`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _contagionSeizure() {
    return createActiveEffect({
      label: 'Seizure',
      description:
        'Disadvantage on dexterity checks, dexterity saving throws, and attacks that use dexterity for 7 days',
      icon: 'icons/magic/unholy/strike-beam-blood-large-red-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_WEEK,
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _contagionSlimyDoom() {
    return createActiveEffect({
      label: 'Slimy Doom',
      description:
        'Disadvantage on constitution checks and constitution saving throws for 7 days',
      icon: 'icons/magic/unholy/strike-beam-blood-large-red-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_WEEK,
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.con`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.con`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _darkvision() {
    return createActiveEffect({
      label: 'Darkvision',
      description: 'Upgrade darkvision to 60 ft. for 8 hours',
      icon: 'icons/magic/perception/eye-ringed-glow-angry-small-red.webp',
      seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      changes: [
        {
          key: 'system.attributes.senses.darkvision',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: '60',
          priority: 5,
        },
      ],
      atlChanges: [
        {
          key: 'ATL.sight.range',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: '60',
          priority: 5,
        },
        {
          key: 'ATL.sight.visionMode',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 'darkvision',
          priority: 5,
        },
      ],
    });
  }

  get _disguiseSelf() {
    return createActiveEffect({
      label: 'Disguise Self',
      description: 'No active effects and lasts for 1 hour',
      icon: 'icons/magic/control/debuff-energy-hold-teal-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  get _divineFavor() {
    return createActiveEffect({
      label: 'Divine Favor',
      description: 'Add 1d4 radiant damage to weapon attacks for 1 minute',
      icon: 'icons/magic/fire/dagger-rune-enchant-flame-blue-yellow.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.bonuses.weapon.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+1d4[radiant]',
        },
      ],
    });
  }

  get _divineWord() {
    return createActiveEffect({
      label: 'Divine Word',
      description: 'Adds various effects based on the remaining hit points',
      icon: 'icons/magic/light/explosion-star-large-orange-purple.webp',
      isDynamic: true,
    });
  }

  get _enhanceAbility() {
    return createActiveEffect({
      label: 'Enhance Ability',
      description:
        "Choose between Bear's Endurance, Bull's Strength, Cat's Grace, Eagle's Splendor, Fox's Cunning, or Owl's Wisdom",
      icon: 'icons/magic/control/buff-flight-wings-runes-purple.webp',
      nestedEffects: [
        this._enhanceAbilityBearsEndurance.label,
        this._enhanceAbilityBullsStrength.label,
        this._enhanceAbilityCatsGrace.label,
        this._enhanceAbilityEaglesSplendor.label,
        this._enhanceAbilityFoxsCunning.label,
        this._enhanceAbilityOwlsWisdom.label,
      ],
    });
  }

  get _enhanceAbilityBearsEndurance() {
    return createActiveEffect({
      label: "Bear's Endurance",
      description:
        'Advantage on constitution checks and 2d6 temp hit points for 1 hour',
      icon: 'icons/magic/control/buff-flight-wings-runes-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.ability.check.con`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _enhanceAbilityBullsStrength() {
    return createActiveEffect({
      label: "Bull's Strength",
      description:
        'Advantage on strength checks and double maximum carrying capacity for 1 hour',
      icon: 'icons/magic/control/buff-flight-wings-runes-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.ability.check.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.attributes.encumbrance.max',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '2',
          priority: 5,
        },
      ],
    });
  }

  get _enhanceAbilityCatsGrace() {
    return createActiveEffect({
      label: "Cat's Grace",
      description: 'Advantage on dexterity checks for 1 hour',
      icon: 'icons/magic/control/buff-flight-wings-runes-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.ability.check.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _enhanceAbilityEaglesSplendor() {
    return createActiveEffect({
      label: "Eagle's Splendor",
      description: 'Advantage on charisma checks for 1 hour',
      icon: 'icons/magic/control/buff-flight-wings-runes-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.ability.check.cha`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _enhanceAbilityFoxsCunning() {
    return createActiveEffect({
      label: "Fox's Cunning",
      description: 'Advantage on intelligence checks for 1 hour',
      icon: 'icons/magic/control/buff-flight-wings-runes-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.ability.check.int`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _enhanceAbilityOwlsWisdom() {
    return createActiveEffect({
      label: "Owl's Wisdom",
      description: 'Advantage on wisdom checks for 1 hour',
      icon: 'icons/magic/control/buff-flight-wings-runes-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.ability.check.wis`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _enlargeReduce() {
    return createActiveEffect({
      label: 'Enlarge/Reduce',
      description: 'Choose between Enlarge or Reduce',
      icon: 'icons/magic/control/energy-stream-link-large-blue.webp',
      nestedEffects: [
        this._enlargeReduceEnlarge.label,
        this._enlargeReduceReduce.label,
      ],
    });
  }

  get _enlargeReduceEnlarge() {
    return createActiveEffect({
      label: 'Enlarge',
      description:
        'Add 1d4 to damage and advantage on strength checks and strength saving throws for 1 minute',
      icon: 'icons/magic/control/energy-stream-link-large-blue.webp',
      isDynamic: true,
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.bonuses.weapon.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+1d4',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.ability.check.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.ability.save.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _enlargeReduceReduce() {
    return createActiveEffect({
      label: 'Reduce',
      description:
        'Subtract 1d4 from damage and disadvantage on strength checks and strength saving throws for 1 minute',
      icon: 'icons/magic/control/energy-stream-link-large-blue.webp',
      isDynamic: true,
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.bonuses.weapon.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.check.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _faerieFire() {
    return createActiveEffect({
      label: 'Faerie Fire',
      description: 'Grants advantage to all who attack for 1 minute',
      icon: 'icons/magic/fire/projectile-meteor-salvo-strong-teal.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
      atlChanges: [
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '10',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.WHITE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.25,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "pulse","speed": 1,"intensity": 1}',
        },
      ],
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'glow',
        },
      ],
    });
  }

  get _falseLife() {
    return createActiveEffect({
      label: 'False Life',
      description: 'Add temporary hit points 1 hour',
      icon: 'icons/magic/life/heart-cross-purple-orange.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  get _featherFall() {
    return createActiveEffect({
      label: 'Feather Fall',
      description: 'No active effects and lasts for 1 minute',
      icon: 'icons/magic/air/wind-swirl-pink-purple.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
    });
  }

  get _feeblemind() {
    return createActiveEffect({
      label: 'Feeblemind',
      description: 'Set intelligence and charisma scores to 1 until removed',
      icon: 'icons/magic/light/explosion-star-large-teal-purple.webp',
      changes: [
        {
          key: 'system.abilities.int.value',
          mode: CONST.ACTIVE_EFFECT_MODES.DOWNGRADE,
          value: '1',
          priority: 25,
        },
        {
          key: 'system.abilities.cha.value',
          mode: CONST.ACTIVE_EFFECT_MODES.DOWNGRADE,
          value: '1',
          priority: 25,
        },
      ],
    });
  }

  get _fireShield() {
    return createActiveEffect({
      label: 'Fire Shield',
      description: 'Choose between cold or fire resistance',
      icon: 'icons/magic/defensive/shield-barrier-flaming-pentagon-red.webp',
      nestedEffects: [
        this._fireShieldColdResistance.label,
        this._fireShieldFireResistance.label,
      ],
    });
  }

  get _fireShieldColdResistance() {
    return createActiveEffect({
      label: 'Fire Shield (Cold Resistance)',
      description: 'Add damage resistance to cold for 10 minutes',
      icon: 'icons/magic/defensive/shield-barrier-flaming-pentagon-red.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      changes: [
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'cold',
        },
      ],
      atlChanges: [
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '20',
        },
        {
          key: 'ATL.light.bright',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '10',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.FIRE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.25,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "torch", "speed": 3, "intensity": 1}',
        },
      ],
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'fire',
        },
      ],
    });
  }

  get _fireShieldFireResistance() {
    return createActiveEffect({
      label: 'Fire Shield (Fire Resistance)',
      description: 'Add damage resistance to fire for 10 minutes',
      icon: 'icons/magic/defensive/shield-barrier-flaming-pentagon-blue.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      changes: [
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'fire',
        },
      ],
      atlChanges: [
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '20',
        },
        {
          key: 'ATL.light.bright',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '10',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.COLD_FIRE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.25,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "torch", "speed": 3, "intensity": 1}',
        },
      ],
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'Fire v2 (coldfire)',
        },
      ],
    });
  }

  get _findThePath() {
    return createActiveEffect({
      label: 'Find the Path',
      description: 'No active effects and lasts for 1 day',
      icon: 'icons/magic/light/explosion-star-teal.webp',
      seconds: Constants.SECONDS.IN_ONE_DAY,
    });
  }

  get _fly() {
    return createActiveEffect({
      label: 'Fly',
      description: 'Upgrade flying speed to 60 ft. for 10 minutes',
      icon: 'icons/magic/control/energy-stream-link-white.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      changes: [
        {
          key: 'system.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: '60',
          priority: 25,
        },
      ],
    });
  }

  get _foresight() {
    return createActiveEffect({
      label: 'Foresight',
      description:
        'Grants advantage on attack rolls, ability checks, and saving throws while granting disadvantage to all who attack for 8 hours',
      icon: 'icons/magic/perception/eye-ringed-glow-angry-large-teal.webp',
      seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.ability.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.ability.save.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'flags.dnd5e.initiativeAdv',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _freedomOfMovement() {
    return createActiveEffect({
      label: 'Freedom of Movement',
      description: 'No active effects and lasts for 1 hour',
      icon: 'icons/skills/melee/strike-blade-knife-white-red.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  get _globeOfInvulnerability() {
    return createActiveEffect({
      label: 'Globe of Invulnerability',
      description: 'No active effects and lasts for 1 minute',
      icon: 'icons/magic/defensive/shield-barrier-flaming-pentagon-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'warp-field',
        },
      ],
    });
  }

  get _greaterInvisibility() {
    return createActiveEffect({
      label: 'Greater Invisibility',
      description:
        'Grants advantage on attack rolls while forcing disadvantage to all who attack for 1 minute',
      icon: 'icons/magic/air/fog-gas-smoke-swirling-gray.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
      subEffects: [this._invisible],
    });
  }

  get _guidance() {
    return createActiveEffect({
      label: 'Guidance',
      description: 'Adds 1d4 to one ability or skill check for 1 minute',
      icon: 'icons/magic/control/buff-flight-wings-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: `flags.${this._flagPrefix}.optional.guidance.label`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'Guidance',
        },
        {
          key: `flags.${this._flagPrefix}.optional.guidance.check.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '+1d4',
        },
        {
          key: `flags.${this._flagPrefix}.optional.guidance.skill.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '+1d4',
        },
      ],
    });
  }

  get _guidingBolt() {
    return createActiveEffect({
      label: 'Guiding Bolt',
      description:
        'Grants advantage to next attacker or until the end of next turn',
      icon: 'icons/magic/fire/projectile-fireball-smoke-large-blue.webp',
      seconds: CONFIG.time.roundTime,
      turns: 1,
      flags: {
        dae: {
          specialDuration: ['isAttacked'],
        },
      },
      changes: [
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _haste() {
    return createActiveEffect({
      label: 'Haste',
      description:
        'Double speed, add 2 to AC, and advantage on dexterity saving throws for 1 minute',
      icon: 'icons/magic/control/buff-flight-wings-runes-purple.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.attributes.ac.bonus',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+2',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.ability.save.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '*2',
          priority: 25,
        },
      ],
    });
  }

  get _heroesFeast() {
    return createActiveEffect({
      label: "Heroes' Feast",
      description:
        'Immunity to poison and frightened, make all wisdom saving throws with advantage, and hit point maximum increases by 2d10 for 24 hours',
      icon: 'icons/magic/life/heart-cross-strong-flame-purple-orange.webp',
      seconds: Constants.SECONDS.IN_ONE_DAY,
      changes: [
        {
          key: 'system.traits.di.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'poison',
        },
        {
          key: 'system.traits.ci.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'frightened',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.ability.save.wis`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _heroism() {
    return createActiveEffect({
      label: 'Heroism',
      description: 'Immunity to frightened for 1 minute',
      icon: 'icons/magic/life/heart-cross-strong-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.traits.ci.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'frightened',
        },
      ],
    });
  }

  get _hideousLaughter() {
    return createActiveEffect({
      label: 'Hideous Laughter',
      description:
        'Apply the effects of the prone and incapacitated conditions for 1 minute',
      icon: 'icons/magic/fire/explosion-fireball-medium-purple-pink.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [...this._incapacitated.changes, ...this._prone.changes],
    });
  }

  get _holdMonster() {
    return createActiveEffect({
      label: 'Hold Monster',
      description: 'Apply the effects of the paralyzed condition for 1 minute',
      icon: 'icons/magic/control/debuff-chains-ropes-red.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [...this._paralyzed.changes],
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'mantle-of-madness',
        },
      ],
    });
  }

  // TODO: potentially use overtime here if find a good way to do it
  // flags.${this._flagPrefix}.OverTime
  // turn=end,
  // saveAbility=wis,
  // saveDC=30,
  // label=Hold Person
  get _holdPerson() {
    return createActiveEffect({
      label: 'Hold Person',
      description: 'Apply the effects of the paralyzed condition for 1 minute',
      icon: 'icons/magic/control/debuff-chains-ropes-purple.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [...this._paralyzed.changes],
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'mantle-of-madness',
        },
      ],
    });
  }

  get _holyAura() {
    return createActiveEffect({
      label: 'Holy Aura',
      description:
        'Advantage on saving throws, grant disadvantage to all who attack, and emit dim light in 5 radius (requires ATL) for 1 minute',
      icon: 'icons/magic/control/buff-flight-wings-runes-blue-white.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.ability.save.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
      atlChanges: [
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '5',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.WHITE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.25,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "sunburst", "speed": 2,"intensity": 4}',
        },
      ],
    });
  }

  get _huntersMark() {
    return createActiveEffect({
      label: "Hunter's Mark",
      description: 'No active effects and lasts until removed (for now)',
      icon: 'icons/magic/perception/eye-ringed-glow-angry-small-red.webp',
    });
  }

  get _invisibility() {
    return createActiveEffect({
      label: 'Invisibility',
      description:
        'Grants advantage on next attack roll while forcing disadvantage to all who attack for 1 hour. Expires after 1 attack.',
      icon: 'icons/magic/air/fog-gas-smoke-dense-gray.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      flags: {
        dae: {
          specialDuration: ['1Attack', '1Spell'],
        },
      },
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
      subEffects: [this._invisible],
    });
  }

  get _irresistibleDance() {
    return createActiveEffect({
      label: 'Irresistible Dance',
      description:
        'Zero movement, disadvantage on dexterity saving throws, disadvantage on attack rolls, and grants advantage to all who attack for 1 minute',
      icon: 'icons/magic/control/energy-stream-link-large-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '0',
          priority: 25,
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _jump() {
    return createActiveEffect({
      label: 'Jump',
      description: 'No active effects and lasts for 1 minute',
      icon: 'icons/magic/control/debuff-energy-hold-blue-yellow.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
    });
  }

  get _light() {
    return createActiveEffect({
      label: 'Light',
      description: 'Emits 20/40 light for 1 hour (requires ATL)',
      icon: 'icons/magic/light/explosion-star-small-blue-yellow.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      atlChanges: [
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '40',
        },
        {
          key: 'ATL.light.bright',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '20',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.WHITE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.25,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "pulse", "speed": 3,"intensity": 1}',
        },
      ],
    });
  }

  get _longstrider() {
    return createActiveEffect({
      label: 'Longstrider',
      description: 'Increase all movement by 10 ft. for 1 hour',
      icon: 'icons/magic/air/wind-stream-blue-gray.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '+10',
          priority: 25,
        },
      ],
    });
  }

  get _mageArmor() {
    return createActiveEffect({
      label: 'Mage Armor',
      description: 'Upgrades armor to 13 + dex modifier for 8 hours',
      icon: 'icons/magic/defensive/shield-barrier-glowing-triangle-blue.webp',
      seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      changes: [
        {
          key: 'system.attributes.ac.calc',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 'mage',
          priority: 5,
        },
      ],
    });
  }

  get _mindBlank() {
    return createActiveEffect({
      label: 'Mind Blank',
      description: 'Adds immunity to psychic damage for 24 hours',
      icon: 'icons/magic/air/air-burst-spiral-large-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_DAY,
      changes: [
        {
          key: 'system.traits.di.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'psychic',
        },
      ],
    });
  }

  get _mirrorImage() {
    return createActiveEffect({
      label: 'Mirror Image',
      description: 'No active effects and lasts for 1 minute',
      icon: 'icons/magic/control/debuff-energy-hold-levitate-pink.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'images',
        },
      ],
    });
  }

  get _passWithoutTrace() {
    // TODO token magic effects
    return createActiveEffect({
      label: 'Pass without Trace',
      description: 'Add 10 to stealth checks for 1 hour',
      icon: 'icons/magic/air/fog-gas-smoke-brown.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.skills.ste.bonuses.check',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+10',
        },
      ],
    });
  }

  get _protectionFromEnergy() {
    return createActiveEffect({
      label: 'Protection from Energy',
      description:
        'Choose between acid, cold, fire, lightning, or thunder resistance',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-teal.webp',
      nestedEffects: [
        this._protectionFromEnergyAcid.label,
        this._protectionFromEnergyCold.label,
        this._protectionFromEnergyFire.label,
        this._protectionFromEnergyLightning.label,
        this._protectionFromEnergyThunder.label,
      ],
    });
  }

  get _protectionFromEnergyAcid() {
    // TODO token magic effects
    return createActiveEffect({
      label: 'Protection from Acid',
      description: 'Adds damage resistance to acid for 1 hour',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-acid.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'acid',
        },
      ],
    });
  }

  get _protectionFromEnergyCold() {
    // TODO token magic effects
    return createActiveEffect({
      label: 'Protection from Cold',
      description: 'Adds damage resistance to cold for 1 hour',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-blue.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'cold',
        },
      ],
    });
  }

  get _protectionFromEnergyFire() {
    // TODO token magic effects
    return createActiveEffect({
      label: 'Protection from Fire',
      description: 'Adds damage resistance to fire for 1 hour',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-red.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'fire',
        },
      ],
    });
  }

  get _protectionFromEnergyLightning() {
    // TODO token magic effects
    return createActiveEffect({
      label: 'Protection from Lightning',
      description: 'Adds damage resistance to lightning for 1 hour',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'lightning',
        },
      ],
    });
  }

  get _protectionFromEnergyThunder() {
    // TODO token magic effects
    return createActiveEffect({
      label: 'Protection from Thunder',
      description: 'Adds damage resistance to thunder for 1 hour',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-teal-purple.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'thunder',
        },
      ],
    });
  }

  get _protectionFromPoison() {
    // TODO token magic effects
    return createActiveEffect({
      label: 'Protection from Poison',
      description:
        'Adds resistance to poison for 1 hour (does not grant automatic advantage on saving throws against poison)',
      icon: 'icons/magic/defensive/shield-barrier-glowing-triangle-green.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'poison',
        },
      ],
    });
  }

  get _protectionFromEvilAndGood() {
    return createActiveEffect({
      label: 'Protection from Evil and Good',
      description: 'No active effects and lasts for 10 minutes',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _rayOfFrost() {
    return createActiveEffect({
      label: 'Ray of Frost',
      description: 'Lowers movement by 10 ft',
      icon: 'icons/magic/light/beam-rays-blue-small.webp',
      seconds: CONFIG.time.roundTime,
      changes: [
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '-10',
          priority: 25,
        },
      ],
    });
  }

  get _regenerate() {
    return createActiveEffect({
      label: 'Regenerate',
      description: 'Regain 1 hit point at the start of each turn for 1 hour',
      icon: 'icons/magic/life/heart-cross-strong-flame-green.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: `flags.${this._flagPrefix}.OverTime.regenerate`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value:
            'label=Regenerate,turn=start,damageRoll=1,damageType=healing,condition=@attributes.hp.value > 0 && @attributes.hp.value < @attributes.hp.max',
        },
      ],
    });
  }

  get _resilientSphere() {
    return createActiveEffect({
      label: 'Resilient Sphere',
      description: 'Adds total immunity to all damage and half movement',
      icon: 'icons/magic/light/explosion-star-large-pink.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '*0.5',
          priority: 25,
        },
        {
          key: 'system.traits.di.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _resistance() {
    return createActiveEffect({
      label: 'Resistance',
      description: 'Add 1d4 to a single saving throw in the next minute',
      icon: 'icons/magic/defensive/shield-barrier-glowing-triangle-orange.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: `flags.${this._flagPrefix}.optional.resistance.label`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'Resistance',
        },
        {
          key: `flags.${this._flagPrefix}.optional.resistance.save.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '+1d4',
        },
      ],
    });
  }

  get _shield() {
    return createActiveEffect({
      label: 'Shield',
      description: 'Add 5 to AC until next turn',
      icon: 'icons/magic/defensive/shield-barrier-glowing-triangle-magenta.webp',
      seconds: CONFIG.time.roundTime,
      flags: {
        dae: {
          specialDuration: ['turnStart'],
        },
      },
      changes: [
        {
          key: 'system.attributes.ac.bonus',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+5',
          priority: 5,
        },
      ],
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'water-field',
        },
      ],
    });
  }

  get _shieldOfFaith() {
    return createActiveEffect({
      label: 'Shield of Faith',
      description: 'Adds 2 to the AC for 10 minutes',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      changes: [
        {
          key: 'system.attributes.ac.bonus',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+2',
        },
      ],
      tokenMagicChanges: [
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'bloom',
        },
      ],
    });
  }

  get _slow() {
    return createActiveEffect({
      label: 'Slow',
      description:
        'Halves movement and and subtract 2 from AC and dexterity saving throws for 1 minute',
      icon: 'icons/magic/air/fog-gas-smoke-dense-pink.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.attributes.ac.bonus',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-2',
        },
        {
          key: 'system.abilities.dex.bonuses.save',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-2',
        },
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '*0.5',
          priority: 25,
        },
      ],
    });
  }

  get _speakWithAnimals() {
    return createActiveEffect({
      label: 'Speak with Animals',
      description: 'No active effects and lasts for 10 minutes',
      icon: 'icons/magic/nature/wolf-paw-glow-small-teal-blue.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _speakWithDead() {
    return createActiveEffect({
      label: 'Speak with Dead',
      description: 'No active effects and lasts for 10 minutes',
      icon: 'icons/magic/control/fear-fright-shadow-monster-green.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _speakWithPlants() {
    return createActiveEffect({
      label: 'Speak with Plants',
      description: 'No active effects and lasts for 10 minutes',
      icon: 'icons/magic/nature/leaf-glow-teal.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _spiderClimb() {
    return createActiveEffect({
      label: 'Spider Climb',
      description: 'Grants climbing speed equal to walking speed for 1 hour',
      icon: 'icons/magic/control/debuff-chains-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: '@attributes.movement.walk',
          priority: 25,
        },
      ],
    });
  }

  get _spiritGuardians() {
    return createActiveEffect({
      label: 'Spirit Guardians',
      description: 'No active effects and lasts for 10 minutes',
      icon: 'icons/magic/light/projectile-bolts-salvo-white.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _spiritualWeapon() {
    return createActiveEffect({
      label: 'Spiritual Weapon',
      description: 'No active effects and lasts for 1 minute',
      icon: 'icons/magic/fire/dagger-rune-enchant-flame-purple.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
    });
  }

  get _stoneskin() {
    // TODO token magic effects
    return createActiveEffect({
      label: 'Stoneskin',
      description: 'Adds resistance to non-magical physical damage for 1 hour',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-orange.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'physical',
        },
      ],
    });
  }

  get _suggestion() {
    return createActiveEffect({
      label: 'Suggestion',
      description: 'No active effects and lasts for 8 hours',
      icon: 'icons/magic/air/air-burst-spiral-pink.webp',
      seconds: Constants.SECONDS.IN_EIGHT_HOURS,
    });
  }

  get _telekinesis() {
    return createActiveEffect({
      label: 'Telekinesis',
      description: 'No active effects and lasts for 10 minutes',
      icon: 'icons/magic/control/debuff-energy-hold-levitate-yellow.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _trueStrike() {
    return createActiveEffect({
      label: 'True Strike',
      description:
        'Grants advantage on next attack or until the end of next turn',
      icon: 'icons/magic/fire/dagger-rune-enchant-blue-gray.webp',
      seconds: CONFIG.time.roundTime,
      turns: 1,
      flags: {
        dae: {
          specialDuration: ['1Attack'],
        },
      },
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _viciousMockery() {
    return createActiveEffect({
      label: 'Vicious Mockery',
      description:
        'Grants disadvantage on next attack or until the end of next turn',
      icon: 'icons/skills/toxins/cup-goblet-poisoned-spilled.webp',
      seconds: CONFIG.time.roundTime,
      turns: 1,
      flags: {
        dae: {
          specialDuration: ['1Attack'],
        },
      },
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _wardingBond() {
    return createActiveEffect({
      label: 'Warding Bond',
      description:
        'Adds 1 to AC and saving throws and grants resistance to all damage for 1 hour',
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [
        {
          key: 'system.attributes.ac.bonus',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+1',
        },
        {
          key: 'system.bonuses.abilities.save',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+1',
        },
        {
          key: 'system.traits.dr.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'physical',
        },
        {
          key: 'system.traits.dr.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'magical',
        },
      ],
    });
  }

  get _waterBreathing() {
    return createActiveEffect({
      label: 'Water Breathing',
      description: 'No active effects and lasts for 24 hours',
      icon: 'icons/magic/water/pseudopod-swirl-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_DAY,
    });
  }

  get _waterWalk() {
    return createActiveEffect({
      label: 'Water Walk',
      description: 'No active effects and lasts for 1 hour',
      icon: 'icons/creatures/slimes/slime-movement-swirling-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  /** Class specific */
  get _bardicInspiration() {
    return createActiveEffect({
      label: 'Bardic Inspiration',
      description:
        'Add a dice to a single ability check, attack roll, or saving throw in the next 10 minutes',
      icon: 'icons/skills/melee/unarmed-punch-fist.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      nestedEffects: [
        this._bardicInspirationD6.label,
        this._bardicInspirationD8.label,
        this._bardicInspirationD10.label,
        this._bardicInspirationD12.label,
      ],
    });
  }

  get _bardicInspirationD6() {
    return createActiveEffect({
      label: 'Bardic Inspiration (d6)',
      description: 'For bards from level 1 to level 4',
      icon: 'icons/skills/melee/unarmed-punch-fist.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      changes: [
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.label`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 'Bardic Inspiration',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d6',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.save.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d6',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.skill.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d6',
        },
      ],
    });
  }

  get _bardicInspirationD8() {
    return createActiveEffect({
      label: 'Bardic Inspiration (d8)',
      description: 'For bards from level 5 to level 9',
      icon: 'icons/skills/melee/unarmed-punch-fist.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      changes: [
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.label`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 'Bardic Inspiration',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d8',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.save.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d8',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.skill.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d8',
        },
      ],
    });
  }

  get _bardicInspirationD10() {
    return createActiveEffect({
      label: 'Bardic Inspiration (d10)',
      description: 'For bards from level 10 to level 14',
      icon: 'icons/skills/melee/unarmed-punch-fist.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      changes: [
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.label`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 'Bardic Inspiration',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d10',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.save.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d10',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.skill.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d10',
        },
      ],
    });
  }

  get _bardicInspirationD12() {
    return createActiveEffect({
      label: 'Bardic Inspiration (d12)',
      description: 'For bards from level 15 to level 20',
      icon: 'icons/skills/melee/unarmed-punch-fist.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      changes: [
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.label`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 'Bardic Inspiration',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d12',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.save.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d12',
        },
        {
          key: `flags.${this._flagPrefix}.optional.bardic-inspiration.skill.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '+1d12',
        },
      ],
    });
  }

  get _channelDivinitySacredWeapon() {
    return createActiveEffect({
      label: 'Channel Divinity: Sacred Weapon',
      description:
        'Add charisma modifier (minimum +1) to all weapon attack rolls and emits 20/40 light for 1 minute (requires ATL)',
      icon: 'icons/weapons/swords/sword-gold-holy.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: 'system.bonuses.mwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+max(1, @abilities.cha.mod)',
        },
        {
          key: 'system.bonuses.rwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+max(1, @abilities.cha.mod)',
        },
      ],
      atlChanges: [
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '40',
        },
        {
          key: 'ATL.light.bright',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '20',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.WHITE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.25,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "sunburst", "speed": 2,"intensity": 4}',
        },
      ],
    });
  }

  get _channelDivinityTurnTheUnholy() {
    return createActiveEffect({
      label: 'Channel Divinity: Turn the Unholy',
      description:
        'No active effects and lasts for 1 minute. Expires on taking damage.',
      icon: 'icons/magic/fire/explosion-embers-evade-silhouette.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      flags: {
        dae: {
          specialDuration: ['isDamaged'],
        },
      },
    });
  }

  get _channelDivinityTurnUndead() {
    return createActiveEffect({
      label: 'Channel Divinity: Turn Undead',
      description:
        'No active effects and lasts for 1 minute. Expires on taking damage.',
      icon: 'icons/magic/fire/flame-burning-creature-skeleton.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      flags: {
        dae: {
          specialDuration: ['isDamaged'],
        },
      },
    });
  }

  get _kiEmptyBody() {
    return createActiveEffect({
      label: 'Ki: Empty Body',
      description:
        'Grants advantage on attack rolls, forces disadvantage to all who attack, and grants resistance to all damage except force for 1 minute',
      icon: 'icons/magic/perception/silhouette-stealth-shadow.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'physical',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'bludgeoning',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'piercing',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'slashing',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'silver',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'adamant',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'acid',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'cold',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'fire',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'lightning',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'necrotic',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'poison',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'psychic',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'radiant',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'thunder',
        },
      ],
    });
  }

  get _kiPatientDefense() {
    return createActiveEffect({
      label: 'Ki: Patient Defense',
      description:
        'Grants disadvantage to all who attack and advantage on all dexterity saving throws until next turn',
      icon: 'icons/magic/defensive/shield-barrier-glowing-blue.webp',
      flags: {
        dae: {
          specialDuration: ['turnStart'],
        },
      },
      changes: [
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.ability.save.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _rage() {
    return createActiveEffect({
      label: 'Rage',
      description:
        'Advantage on strength checks and strength saving throws, a variable bonus to melee damage based on barbarian level, and resistance to piercing, bludgeoning, and slashing damage for 1 minute. Also handles Path of the Totem Warrior resistances.',
      icon: 'icons/creatures/abilities/mouth-teeth-human.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      isDynamic: true,
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.ability.check.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.ability.save.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'slashing',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'piercing',
        },
        {
          key: 'system.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'bludgeoning',
        },
        {
          key: 'system.bonuses.mwak.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+ @scale.barbarian.rage-damage',
        },
        {
          key: 'macro.tokenMagic',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'outline',
        },
      ],
    });
  }

  get _recklessAttack() {
    return createActiveEffect({
      label: 'Reckless Attack',
      description:
        'Advantage on melee attacks for a turn and grants advantage to those who attack for 1 round',
      icon: 'icons/skills/melee/blade-tips-triple-bent-white.webp',
      seconds: CONFIG.time.roundTime,
      subEffects: [
        createActiveEffect({
          label: 'Reckless Attack (advantage on attacks)',
          description: 'Advantage on melee attacks until end of turn',
          icon: 'icons/skills/melee/blade-tips-triple-bent-white.webp',
          turns: 1,
          changes: [
            {
              key: `flags.${this._flagPrefix}.advantage.attack.mwak`,
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: '1',
            },
          ],
        }),
        createActiveEffect({
          label: 'Reckless Attack (grant advantage to those who attack)',
          description: 'Grant advantage to those who attack until next turn',
          icon: 'icons/skills/melee/blade-tips-triple-bent-white.webp',
          changes: [
            {
              key: `flags.${this._flagPrefix}.grants.advantage.attack.all`,
              mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
              value: '1',
            },
          ],
        }),
      ],
    });
  }

  /* Equipment effects */
  get _bullseyeLantern() {
    return createActiveEffect({
      label: 'Bullseye Lantern',
      description:
        'Adds lantern light in a 60 degree cone for 6 hours (requires ATL)',
      icon: 'icons/sundries/lights/lantern-iron-yellow.webp',
      seconds: Constants.SECONDS.IN_SIX_HOURS,
      atlChanges: [
        {
          key: 'ATL.light.angle',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '60',
        },
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '120',
        },
        {
          key: 'ATL.light.bright',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '60',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.FIRE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.4,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "torch","speed": 1,"intensity": 1}',
        },
      ],
    });
  }

  get _candle() {
    return createActiveEffect({
      label: 'Candle',
      description: 'Adds candle light for 1 hour (requires ATL)',
      icon: 'icons/sundries/lights/candle-unlit-white.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      atlChanges: [
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '10',
        },
        {
          key: 'ATL.light.bright',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '5',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.FIRE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.2,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "torch","speed": 1,"intensity": 1}',
        },
      ],
    });
  }

  get _hoodedLantern() {
    return createActiveEffect({
      label: 'Hooded Lantern',
      description: 'Adds hooded lantern light for 6 hours (requires ATL)',
      icon: 'icons/sundries/lights/lantern-iron-yellow.webp',
      seconds: Constants.SECONDS.IN_SIX_HOURS,
      atlChanges: [
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '5',
        },
        {
          key: 'ATL.light.bright',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.FIRE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.4,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "torch","speed": 1,"intensity": 1}',
        },
      ],
    });
  }

  get _lantern() {
    return createActiveEffect({
      label: 'Lantern',
      description: 'Adds lantern light for 6 hours (requires ATL)',
      icon: 'icons/sundries/lights/lantern-iron-yellow.webp',
      seconds: Constants.SECONDS.IN_SIX_HOURS,
      atlChanges: [
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '60',
        },
        {
          key: 'ATL.light.bright',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '30',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.FIRE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.4,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "torch","speed": 1,"intensity": 1}',
        },
      ],
    });
  }

  get _torch() {
    return createActiveEffect({
      label: 'Torch',
      description: 'Adds torch light for 1 hour (requires ATL)',
      icon: 'icons/sundries/lights/torch-black.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      atlChanges: [
        {
          key: 'ATL.light.dim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '40',
        },
        {
          key: 'ATL.light.bright',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '20',
        },
        {
          key: 'ATL.light.color',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: Constants.COLORS.FIRE,
        },
        {
          key: 'ATL.light.alpha',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: 0.4,
        },
        {
          key: 'ATL.light.animation',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '{"type": "torch","speed": 1,"intensity": 1}',
        },
      ],
    });
  }

  /* Other effects */
  get _bonusAction() {
    return createActiveEffect({
      label: 'Bonus Action',
      description: 'No active effects and expires on turn start',
      icon: 'modules/dfreds-convenient-effects/images/bonus-action.svg',
      flags: {
        dae: {
          specialDuration: ['turnStart', 'shortRest', 'longRest'],
        },
      },
    });
  }

  get _coverHalf() {
    return createActiveEffect({
      label: 'Cover (Half)',
      description: 'Adds 2 to AC and dexterity saving throws',
      icon: 'modules/dfreds-convenient-effects/images/broken-wall.svg',
      changes: [
        {
          key: 'system.attributes.ac.cover',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+2',
        },
        {
          key: 'system.abilities.dex.bonuses.save',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+2',
        },
      ],
    });
  }

  get _coverThreeQuarters() {
    return createActiveEffect({
      label: 'Cover (Three-Quarters)',
      description: 'Adds 5 to AC and dexterity saving throws',
      icon: 'modules/dfreds-convenient-effects/images/brick-wall.svg',
      changes: [
        {
          key: 'system.attributes.ac.cover',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+5',
        },
        {
          key: 'system.abilities.dex.bonuses.save',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+5',
        },
      ],
    });
  }

  get _encumbered() {
    return createActiveEffect({
      label: 'Encumbered',
      description: 'Lowers movement by 10 ft.',
      icon: 'icons/svg/down.svg',
      changes: [
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '-10',
          priority: 25,
        },
      ],
    });
  }

  get _dodge() {
    return createActiveEffect({
      label: 'Dodge',
      description:
        'Grants disadvantage to all who attack and advantage on all dexterity saving throws until next turn',
      icon: 'modules/dfreds-convenient-effects/images/dodging.svg',
      flags: {
        dae: {
          specialDuration: ['turnStart'],
        },
      },
      changes: [
        {
          key: `flags.${this._flagPrefix}.grants.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.ability.save.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _flanked() {
    return createActiveEffect({
      label: 'Flanked',
      description: 'Grants advantage to all who melee attack',
      icon: 'modules/dfreds-convenient-effects/images/encirclement.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.mwak`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.msak`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _flanking() {
    return createActiveEffect({
      label: 'Flanking',
      description: 'Grants advantage on melee attack rolls',
      icon: 'icons/svg/sword.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.attack.mwak`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.advantage.attack.msak`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _greatWeaponMaster() {
    return createActiveEffect({
      label: 'Great Weapon Master',
      description: 'Subtracts 5 from melee attacks but adds 10 to melee damage',
      icon: 'icons/skills/melee/hand-grip-staff-yellow-brown.webp',
      changes: [
        {
          key: 'system.bonuses.mwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-5',
        },
        {
          key: 'system.bonuses.mwak.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+10',
        },
      ],
    });
  }

  get _heavilyEncumbered() {
    return createActiveEffect({
      label: 'Heavily Encumbered',
      description:
        'Lowers movement by 20 ft., disadvantage on all attack rolls, and disadvantage on strength, dexterity, and constitution saves',
      icon: 'icons/svg/downgrade.svg',
      changes: [
        {
          key: 'system.attributes.movement.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '-20',
          priority: 25,
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.str`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.dex`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.ability.save.con`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _inspiration() {
    return createActiveEffect({
      label: 'Inspiration',
      description:
        'Advantage on everything and expires after any action, save, check, or skill roll',
      icon: 'icons/magic/control/buff-luck-fortune-green.webp',
      flags: {
        dae: {
          specialDuration: ['1Action', 'isSave', 'isCheck', 'isSkill'],
        },
      },
      changes: [
        {
          key: `flags.${this._flagPrefix}.advantage.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '1',
        },
      ],
    });
  }

  get _rangedDisadvantage() {
    return createActiveEffect({
      label: 'Ranged Disadvantage',
      description: 'Disadvantage on ranged attack rolls',
      icon: 'modules/dfreds-convenient-effects/images/broken-arrow.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.rwak`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
        {
          key: `flags.${this._flagPrefix}.disadvantage.attack.rsak`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _reaction() {
    return createActiveEffect({
      label: 'Reaction',
      description: 'No active effects and expires on turn start',
      icon: 'modules/dfreds-convenient-effects/images/reaction.svg',
      flags: {
        dae: {
          specialDuration: ['turnStart', 'shortRest', 'longRest'],
        },
      },
    });
  }

  get _ready() {
    return createActiveEffect({
      label: 'Ready',
      description: 'No active effects and expires on turn start',
      icon: 'modules/dfreds-convenient-effects/images/ready.svg',
      flags: {
        dae: {
          specialDuration: ['turnStart'],
        },
      },
    });
  }

  get _sharpshooter() {
    return createActiveEffect({
      label: 'Sharpshooter',
      description:
        'Subtracts 5 from ranged attacks but adds 10 to ranged damage',
      icon: 'icons/weapons/bows/shortbow-recurve-yellow.webp',
      changes: [
        {
          key: 'system.bonuses.rwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-5',
        },
        {
          key: 'system.bonuses.rwak.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+10',
        },
      ],
    });
  }
}
