import Constants from '../constants.js';
import CustomEffectsHandler from './custom-effects-handler.js';
import EffectHelpers from './effect-helpers.js';
import Settings from '../settings.js';

/**
 * Defines all of the effect definitions
 */
export default class EffectDefinitions {
  constructor() {
    this._customEffectsHandler = new CustomEffectsHandler();
    this._effectHelpers = new EffectHelpers();
    this._settings = new Settings();

    this._flagPrefix = 'midi-qol';
    if (game.modules.get('wire')?.active) {
      this._flagPrefix = 'wire';
    }
  }

  initialize() {
    this._conditions = this.conditions;
    this._spells = this.spells;
    this._classFeatures = this.classFeatures;
    this._equipment = this.equipment;
    this._other = this.other;

    this._all = [
      ...this._conditions,
      ...this._spells,
      ...this._classFeatures,
      ...this._equipment,
      ...this._other,
    ];
  }

  /**
   * Get all effects
   *
   * @returns {ActiveEffect[]} all the effects
   */
  get all() {
    const customEffects = this._customEffectsHandler.getCustomEffects();
    return [...customEffects, ...this._all];
  }

  /**
   * Get all the condition effects
   *
   * @returns {ActiveEffect[]} all the condition effects
   */
  get conditions() {
    return (
      this._conditions ?? [
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
      ]
    );
  }

  /**
   * Get all the spell effects
   *
   * @returns {ActiveEffect[]} all the spell effects
   */
  get spells() {
    return (
      this._spells ?? [
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
      ]
    );
  }

  /**
   * Get all the class feature effects
   *
   * @returns {ActiveEffect[]} all the class feature effects
   */
  get classFeatures() {
    return (
      this._classFeatures ?? [
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
      ]
    );
  }

  /**
   * Get all the equipment effects
   *
   * @returns {ActiveEffect[]} all the equipment effects
   */
  get equipment() {
    return (
      this._equipment ?? [
        this._bullseyeLantern,
        this._candle,
        this._hoodedLantern,
        this._lantern,
        this._torch,
      ]
    );
  }

  /**
   * Get all the other effects
   *
   * @returns {ActiveEffect[]} all the other effects
   */
  get other() {
    return (
      this._other ?? [
        this._bonusAction,
        this._coverHalf,
        this._coverThreeQuarters,
        this._coverTotal,
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
      ]
    );
  }

  /* Condition Effects */
  get _blinded() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Blinded"),
      description: game.i18n.localize("Effects.BlindedDescription"),
      icon: 'modules/dfreds-convenient-effects/images/blinded.svg',
      statuses: ['blind'],
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Charmed"),
      description: game.i18n.localize("Effects.CharmedDescription"),
      icon: 'modules/dfreds-convenient-effects/images/charmed.svg',
    });
  }

  get _concentrating() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Concentrating"),
      description: game.i18n.localize("Effects.ConcentratingDescription"),
      icon: 'modules/dfreds-convenient-effects/images/concentrating.svg',
    });
  }

  get _dead() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Dead"),
      description: game.i18n.localize("Effects.DeadDescription"),
      icon: 'icons/svg/skull.svg',
    });
  }

  get _deafened() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Deafened"),
      description: game.i18n.localize("Effects.DeafenedDescription"),
      icon: 'modules/dfreds-convenient-effects/images/deafened.svg',
      statuses: ['deaf'],
    });
  }

  get _exhaustion1() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Exhaustion1"),
      description: game.i18n.localize("Effects.Exhaustion1Descrtiption"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Exhaustion2"),
      description: game.i18n.localize("Effects.Exhaustion2Description"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Exhaustion3"),
      description: game.i18n.localize("Effects.Exhaustion3Description"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Exhaustion4"),
      description: game.i18n.localize("Effects.Exhaustion4Description"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Exhaustion5"),
      description: game.i18n.localize("Effects.Exhaustion5Description"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Frightened"),
      description: game.i18n.localize("Effects.FrightenedDescription"),
      icon: 'modules/dfreds-convenient-effects/images/frightened.svg',
      statuses: ['fear'],
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Grappled"),
      description: game.i18n.localize("Effects.GrappledDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Incapacitated"),
      description: game.i18n.localize("Effects.IncapacitatedDescription"),
      icon: 'modules/dfreds-convenient-effects/images/incapacitated.svg',
    });
  }

  get _invisible() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Invisible"),
      description: game.i18n.localize("Effects.InvisibleDescription"),
      icon: 'modules/dfreds-convenient-effects/images/invisible.svg',
      statuses: ['invisible'],
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Paralyzed"),
      description: game.i18n.localize("Effects.ParalyzedDescription"),
      icon: 'modules/dfreds-convenient-effects/images/paralyzed.svg',
      statuses: ['paralysis'],
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Petrified"),
      description: game.i18n.localize("Effects.PetrifiedDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Poisoned"),
      description: game.i18n.localize("Effects.PoisonedDescription"),
      icon: 'modules/dfreds-convenient-effects/images/poisoned.svg',
      statuses: ['poison'],
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Prone"),
      description: game.i18n.localize("Effects.Prone"),
      icon: 'modules/dfreds-convenient-effects/images/prone.svg',
      statuses: ['prone'],
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Restrained"),
      description: game.i18n.localize("Effects.RestrainedDescription"),
      icon: 'modules/dfreds-convenient-effects/images/restrained.svg',
      statuses: ['restrain'],
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Stunned"),
      description: game.i18n.localize("Effects.StunnedDescription"),
      icon: 'modules/dfreds-convenient-effects/images/stunned.svg',
      statuses: ['stun'],
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Unconscious"),
      description: game.i18n.localize("Effects.UnconsciousDescription"),
      icon: 'icons/svg/unconscious.svg',
      statuses: ['unconscious'],
      changes: [...this._paralyzed.changes],
    });
  }

  get _wounded() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Wounded"),
      description: game.i18n.localize("Effects.WoundedDescription"),
      icon: 'modules/dfreds-convenient-effects/images/wounded.svg',
    });
  }

  /* Spell Effects */
  get _acidArrow() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.AcidArrow"),
      description: game.i18n.localize("Effects.AcidArrowDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Aid"),
      description: game.i18n.localize("Effects.AidDescription"),
      icon: 'icons/magic/life/heart-cross-blue.webp',
      seconds: Constants.SECONDS.IN_EIGHT_HOURS,
    });
  }

  get _alterSelf() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.AlterSelf"),
      description: game.i18n.localize("Effects.AlterSelfDescription"),
      icon: 'icons/magic/control/debuff-energy-hold-green.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  get _antilifeShell() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.AntilifeShell"),
      description: game.i18n.localize("Effects.AntilifeShellDescription"),
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-teal.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  get _arcaneHand() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ArcaneHand"),
      description: game.i18n.localize("Effects.ArcaneHandDescription"),
      icon: 'icons/magic/fire/projectile-fireball-smoke-strong-teal.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
    });
  }

  get _bane() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Bane"),
      description: game.i18n.localize("Effects.BaneDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Barkskin"),
      description: game.i18n.localize("Effects.BarkskinDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BeaconofHope"),
      description: game.i18n.localize("Effects.BeaconofHopeDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BlackTentacles"),
      description: game.i18n.localize("Effects.BlackTentaclesDescription"),
      icon: 'icons/magic/nature/vines-thorned-curled-glow-teal-purple.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [...this._restrained.changes],
    });
  }

  get _bless() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Bless"),
      description: game.i18n.localize("Effects.BlessDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BlindnessDeafness"),
      description: game.i18n.localize("Effects.BlindnessDeafnessDescription"),
      icon: 'icons/magic/perception/eye-ringed-glow-angry-red.webp',
      nestedEffects: [
        this._blindnessDeafnessBlindness.name,
        this._blindnessDeafnessDeafness.name,
      ],
    });
  }

  get _blindnessDeafnessBlindness() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Blindness"),
      description: game.i18n.localize("Effects.BlindnessDescription"),
      icon: 'icons/magic/perception/eye-ringed-glow-angry-red.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      subEffects: [this._blinded],
    });
  }

  get _blindnessDeafnessDeafness() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Deafness"),
      description: game.i18n.localize("Effects.DeafnessDescription"),
      icon: 'icons/magic/perception/eye-ringed-glow-angry-red.webp',
      isViewable: this._settings.showNestedEffects,
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      subEffects: [this._deafened],
    });
  }

  get _blur() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Blur"),
      description: game.i18n.localize("Effects.BlurDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.CharmPerson"),
      description: game.i18n.localize("Effects.CharmPersonDescription"),
      icon: 'icons/magic/fire/explosion-fireball-medium-purple-pink.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      changes: [...this._charmed.changes],
    });
  }

  get _command() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Command"),
      description: game.i18n.localize("Effects.CommandDescription"),
      icon: 'icons/magic/fire/explosion-fireball-small-purple.webp',
      seconds: CONFIG.time.roundTime,
      turns: 1,
    });
  }

  get _comprehendLanguages() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ComprehendLanguages"),
      description: game.i18n.localize("Effects.ComprehendLanguagesDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Contagion"),
      description: game.i18n.localize("Effects.ContagionDescription"),
      icon: 'icons/magic/unholy/strike-beam-blood-large-red-purple.webp',
      nestedEffects: [
        this._contagionBlindingSickness.name,
        this._contagionFilthFever.name,
        this._contagionFleshRot.name,
        this._contagionMindfire.name,
        this._contagionSeizure.name,
        this._contagionSlimyDoom.name,
      ],
    });
  }

  get _contagionBlindingSickness() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BlindingSickness"),
      description: game.i18n.localize("Effects.BlindingSicknessDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FilthFever"),
      description: game.i18n.localize("Effects.FilthFeverDescriptrion"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FleshRot"),
      description: game.i18n.localize("Effects.FleshRotDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Mindfire"),
      description: game.i18n.localize("Effects.MindfireDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Seizure"),
      description: game.i18n.localize("Effects.SeizureDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.SlimyDoom"),
      description: game.i18n.localize("Effects.SlimyDoomDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Darkvision"),
      description: game.i18n.localize("Effects.DarkvisionDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.DisguiseSelf"),
      description: game.i18n.localize("Effects.DisguiseSelfDescription"),
      icon: 'icons/magic/control/debuff-energy-hold-teal-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  get _divineFavor() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.DivineFavor"),
      description: game.i18n.localize("Effects.DivineFavorDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.DivineWord"),
      description: game.i18n.localize("Effects.DivineWordDescription"),
      icon: 'icons/magic/light/explosion-star-large-orange-purple.webp',
      isDynamic: true,
    });
  }

  get _enhanceAbility() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.EnhanceAbility"),
      description: game.i18n.localize("Effects.EnhanceAbilityDescription"),
      icon: 'icons/magic/control/buff-flight-wings-runes-purple.webp',
      nestedEffects: [
        this._enhanceAbilityBearsEndurance.name,
        this._enhanceAbilityBullsStrength.name,
        this._enhanceAbilityCatsGrace.name,
        this._enhanceAbilityEaglesSplendor.name,
        this._enhanceAbilityFoxsCunning.name,
        this._enhanceAbilityOwlsWisdom.name,
      ],
    });
  }

  get _enhanceAbilityBearsEndurance() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BearsEndurance"),
      description: game.i18n.localize("Effects.BearsEnduranceDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BullsStrength"),
      description: game.i18n.localize("Effects.BullsStrengthDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.CatsGrace"),
      description: game.i18n.localize("Effects.CatsGraceDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.EaglesSplendor"),
      description: game.i18n.localize("Effects.EaglesSplenderoDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FoxsCunning"),
      description: game.i18n.localize("Effects.FoxsCunningDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.OwlsWisdom"),
      description: game.i18n.localize("Effects.OwlsWisdomDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.EnlargeReduce"),
      description: game.i18n.localize("Effects.EnlargeReduceDescription"),
      icon: 'icons/magic/control/energy-stream-link-large-blue.webp',
      nestedEffects: [
        this._enlargeReduceEnlarge.name,
        this._enlargeReduceReduce.name,
      ],
    });
  }

  get _enlargeReduceEnlarge() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Enlarge"),
      description: game.i18n.localize("Effects.EnlargeDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Reduce"),
      description: game.i18n.localize("Effects.ReduceDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FaerieFire"),
      description: game.i18n.localize("Effects.FaerieFireDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FalseLife"),
      description: game.i18n.localize("Effects.FalseLifeDescription"),
      icon: 'icons/magic/life/heart-cross-purple-orange.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  get _featherFall() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FeatherFall"),
      description: game.i18n.localize("Effects.FeatherFallDescription"),
      icon: 'icons/magic/air/wind-swirl-pink-purple.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
    });
  }

  get _feeblemind() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Feeblemind"),
      description: game.i18n.localize("Effects.FeeblemindDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FireShield"),
      description: game.i18n.localize("Effects.FireShieldDescription"),
      icon: 'icons/magic/defensive/shield-barrier-flaming-pentagon-red.webp',
      nestedEffects: [
        this._fireShieldColdResistance.name,
        this._fireShieldFireResistance.name,
      ],
    });
  }

  get _fireShieldColdResistance() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FireShieldColdResistance"),
      description: game.i18n.localize("Effects.FireShieldColdResistanceDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FireShieldFireResistance"),
      description: game.i18n.localize("Effects.FireShieldFireResistanceDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FindthePath"),
      description: game.i18n.localize("Effects.FindthePathDescription"),
      icon: 'icons/magic/light/explosion-star-teal.webp',
      seconds: Constants.SECONDS.IN_ONE_DAY,
    });
  }

  get _fly() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Fly"),
      description: game.i18n.localize("Effects.FlyDescription"),
      icon: 'icons/magic/control/energy-stream-link-white.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      statuses: ['fly'],
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Foresight"),
      description: game.i18n.localize("Effects.ForesightDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.FreedomofMovement"),
      description: game.i18n.localize("Effects.FreedomofMovementDescription"),
      icon: 'icons/skills/melee/strike-blade-knife-white-red.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  get _globeOfInvulnerability() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.GlobeofInvulnerability"),
      description: game.i18n.localize("Effects.GlobeofInvulnerabilityDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.GreaterInvisibility"),
      description: game.i18n.localize("Effects.GreaterInvisibilityDescription"),
      icon: 'icons/magic/air/fog-gas-smoke-swirling-gray.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      statuses: ['invisible'],
      subEffects: [this._invisible],
    });
  }

  get _guidance() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Guidance"),
      description: game.i18n.localize("Effects.GuidanceDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.GuidingBolt"),
      description: game.i18n.localize("Effects.GuidingBoltDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Haste"),
      description: game.i18n.localize("Effects.HasteDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.HeroesFeast"),
      description: game.i18n.localize("Effects.HeroesFeastDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Heroism"),
      description: game.i18n.localize("Effects.HeroismDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.HideousLaughter"),
      description: game.i18n.localize("Effects.HideousLaughterDescription"),
      icon: 'icons/magic/fire/explosion-fireball-medium-purple-pink.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      changes: [...this._incapacitated.changes, ...this._prone.changes],
    });
  }

  get _holdMonster() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.HoldMonster"),
      description: game.i18n.localize("Effects.HoldMonsterDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.HoldPerson"),
      description: game.i18n.localize("Effects.HoldPersonDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.HolyAura"),
      description: game.i18n.localize("Effects.HolyAuraDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.HuntersMark"),
      description: game.i18n.localize("Effects.HuntersMarkDescription"),
      icon: 'icons/magic/perception/eye-ringed-glow-angry-small-red.webp',
    });
  }

  get _invisibility() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Invisibility"),
      description: game.i18n.localize("Effects.InvisibilityDescription"),
      icon: 'icons/magic/air/fog-gas-smoke-dense-gray.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      flags: {
        dae: {
          specialDuration: ['1Attack', '1Spell'],
        },
      },
      statuses: ['invisible'],
      subEffects: [this._invisible],
    });
  }

  get _irresistibleDance() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.IrresistibleDance"),
      description: game.i18n.localize("Effects.IrresistibleDanceDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Jump"),
      description: game.i18n.localize("Effects.JumpDescription"),
      icon: 'icons/magic/control/debuff-energy-hold-blue-yellow.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
    });
  }

  get _light() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Light"),
      description: game.i18n.localize("Effects.LightDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Longstrider"),
      description: game.i18n.localize("Effects.LongstriderDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.MageArmor"),
      description: game.i18n.localize("Effects.MageArmorDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.MindBlank"),
      description: game.i18n.localize("Effects.MindBlankDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.MirrorImage"),
      description: game.i18n.localize("Effects.MirrorImageDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.PasswithoutTrace"),
      description: game.i18n.localize("Effects.PasswithoutTraceDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ProtectionfromEnergy"),
      description: game.i18n.localize("Effects.ProtectionfromEnergyDescription"),
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-teal.webp',
      nestedEffects: [
        this._protectionFromEnergyAcid.name,
        this._protectionFromEnergyCold.name,
        this._protectionFromEnergyFire.name,
        this._protectionFromEnergyLightning.name,
        this._protectionFromEnergyThunder.name,
      ],
    });
  }

  get _protectionFromEnergyAcid() {
    // TODO token magic effects
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ProtectionfromAcid"),
      description: game.i18n.localize("Effects.ProtectionfromAcidDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Protection from Cold"),
      description: game.i18n.localize("Effects.ProtectionfromColdDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ProtectionfromFire"),
      description: game.i18n.localize("Effects.ProtectionfromFireDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ProtectionfromLightning"),
      description: game.i18n.localize("Effects.ProtectionfromLightningDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ProtectionfromThunder"),
      description: game.i18n.localize("Effects.ProtectionfromThunderDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ProtectionfromPoison"),
      description: game.i18n.localize("Effects.ProtectionfromPoisonDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ProtectionfromEvilandGood"),
      description: game.i18n.localize("Effects.ProtectionfromEvilandGoodDescription"),
      icon: 'icons/magic/defensive/shield-barrier-flaming-diamond-blue-yellow.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _rayOfFrost() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.RayofFrost"),
      description: game.i18n.localize("Effects.RayofFrostDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Regenerate"),
      description: game.i18n.localize("Effects.RegenerateDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ResilientSphere"),
      description:  game.i18n.localize("Effects.ResilientSphereDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Resistance"),
      description: game.i18n.localize("Effects.ResistanceDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Shield"),
      description: game.i18n.localize("Effects.ShieldDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ShieldofFaith"),
      description: game.i18n.localize("Effects.ShieldofFaithDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Slow"),
      description: game.i18n.localize("Effects.SlowDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.SpeakwithAnimals"),
      description: game.i18n.localize("Effects.SpeakwithAnimalsDescription"),
      icon: 'icons/magic/nature/wolf-paw-glow-small-teal-blue.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _speakWithDead() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.SpeakwithDead"),
      description: game.i18n.localize("Effects.SpeakwithDeadDescription"),
      icon: 'icons/magic/control/fear-fright-shadow-monster-green.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _speakWithPlants() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.SpeakwithPlants"),
      description: game.i18n.localize("Effects.SpeakwithPlantsDescription"),
      icon: 'icons/magic/nature/leaf-glow-teal.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _spiderClimb() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.SpiderClimb"),
      description: game.i18n.localize("Effects.SpiderClimbDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.SpiritGuardians"),
      description: game.i18n.localize("Effects.SpiritGuardiansDescription"),
      icon: 'icons/magic/light/projectile-bolts-salvo-white.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _spiritualWeapon() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.SpiritualWeapon"),
      description: game.i18n.localize("Effects.SpiritualWeaponDescription"),
      icon: 'icons/magic/fire/dagger-rune-enchant-flame-purple.webp',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
    });
  }

  get _stoneskin() {
    // TODO token magic effects
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Stoneskin"),
      description: game.i18n.localize("Effects.StoneskinDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Suggestion"),
      description: game.i18n.localize("Effects.SuggestionDescription"),
      icon: 'icons/magic/air/air-burst-spiral-pink.webp',
      seconds: Constants.SECONDS.IN_EIGHT_HOURS,
    });
  }

  get _telekinesis() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Telekinesis"),
      description: game.i18n.localize("Effects.TelekinesisDescription"),
      icon: 'icons/magic/control/debuff-energy-hold-levitate-yellow.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
    });
  }

  get _trueStrike() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.TrueStrike"),
      description: game.i18n.localize("Effects.TrueStrikeDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ViciousMockery"),
      description: game.i18n.localize("Effects.ViciousMockeryDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.WardingBond"),
      description: game.i18n.localize("Effects.WardingBondDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.WaterBreathing"),
      description: game.i18n.localize("Effects.WaterBreathingDescription"),
      icon: 'icons/magic/water/pseudopod-swirl-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_DAY,
    });
  }

  get _waterWalk() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.WaterWalk"),
      description: game.i18n.localize("Effects.WaterWalkDescription"),
      icon: 'icons/creatures/slimes/slime-movement-swirling-blue.webp',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
    });
  }

  /** Class specific */
  get _bardicInspiration() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BardicInspiration"),
      description: game.i18n.localize("Effects.BardicInspirationDescription"),
      icon: 'icons/skills/melee/unarmed-punch-fist.webp',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      nestedEffects: [
        this._bardicInspirationD6.name,
        this._bardicInspirationD8.name,
        this._bardicInspirationD10.name,
        this._bardicInspirationD12.name,
      ],
    });
  }

  get _bardicInspirationD6() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BardicInspirationD6"),
      description: game.i18n.localize("Effects.BardicInspirationD6Description"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BardicInspirationD8"),
      description: game.i18n.localize("Effects.BardicInspirationD8Description"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BardicInspirationD10"),
      description: game.i18n.localize("Effects.BardicInspirationD10Description"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BardicInspirationD12"),
      description: game.i18n.localize("Effects.BardicInspirationD12Description"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ChannelDivinitySacredWeapon"),
      description: game.i18n.localize("Effects.ChannelDivinitySacredWeaponDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ChannelDivinityTurntheUnholy"),
      description: game.i18n.localize("Effects.ChannelDivinityTurntheUnholyDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.ChannelDivinityTurnUndead"),
      description: game.i18n.localize("Effects.ChannelDivinityTurnUndeadDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.KiEmptyBody"),
      description: game.i18n.localize("Effects.KiEmptyBodyDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.PatientDefense"),
      description: game.i18n.localize("Effects.PatientDefenseDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Rage"),
      description: game.i18n.localize("Effects.RageDescription"),
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
          value: '+ @scale.barbarian.rage',
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.RecklessAttack"),
      description: game.i18n.localize("Effects.RecklessAttackDescription"),
      icon: 'icons/skills/melee/blade-tips-triple-bent-white.webp',
      flags: {
        dae: {
          specialDuration: ['turnStart'],
        },
      },
      changes: [
        {
          key: `flags.${this._flagPrefix}.grants.advantage.attack.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
      subEffects: [
        this._effectHelpers.createActiveEffect({
          name: game.i18n.localize("Effects.RecklessAttackAdvantageOnAttacks"),
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
      ],
    });
  }

  /* Equipment effects */
  get _bullseyeLantern() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BullseyeLantern"),
      description: game.i18n.localize("Effects.BullseyeLanternDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Candle"),
      description: game.i18n.localize("Effects.CandleDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.HoodedLantern"),
      description: game.i18n.localize("Effects.HoodedLanternDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Lantern"),
      description: game.i18n.localize("Effects.LanternDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Torch"),
      description: game.i18n.localize("Effects.TorchDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.BonusAction"),
      description: game.i18n.localize("Effects.BonusActionDescription"),
      icon: 'modules/dfreds-convenient-effects/images/bonus-action.svg',
      flags: {
        dae: {
          specialDuration: ['turnStart', 'shortRest', 'longRest'],
        },
      },
    });
  }

  get _coverHalf() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.CoverHalf"),
      description:  game.i18n.localize("Effects.CoverHalfDescription"),
      icon: 'modules/dfreds-convenient-effects/images/broken-wall.svg',
      tint: '#dae34f',
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.CoverThreeQuarters"),
      description: game.i18n.localize("Effects.CoverThreeQuartersDescription"),
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

  get _coverTotal() {
    return this._effectHelpers.createActiveEffect({
      name: 'Cover (Total)',
      description: 'Causes all attacks to fail automatically',
      icon: 'modules/dfreds-convenient-effects/images/castle.svg',
      changes: [
        {
          key: `flags.${this._flagPrefix}.grants.attack.fail.all`,
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: '1',
        },
      ],
    });
  }

  get _encumbered() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Encumbered"),
      description: game.i18n.localize("Effects.EncumberedDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Dodge"),
      description: game.i18n.localize("Effects.DodgeDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Flanked"),
      description: game.i18n.localize("Effects.FlankedDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Flanking"),
      description: game.i18n.localize("Effects.FlankingDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.GreatWeaponMaster"),
      description: game.i18n.localize("Effects.GreatWeaponMasterDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.HeavilyEncumbered"),
      description: game.i18n.localize("Effects.HeavilyEncumberedDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Inspiration"),
      description: game.i18n.localize("Effects.InspirationDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.RangedDisadvantage"),
      description: game.i18n.localize("Effects.RangedDisadvantageDescription"),
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
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Reaction"),
      description: game.i18n.localize("Effects.ReactionDescription"),
      icon: 'modules/dfreds-convenient-effects/images/reaction.svg',
      flags: {
        dae: {
          specialDuration: ['turnStart', 'shortRest', 'longRest'],
        },
      },
    });
  }

  get _ready() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Ready"),
      description: game.i18n.localize("Effects.ReadyDescription"),
      icon: 'modules/dfreds-convenient-effects/images/ready.svg',
      flags: {
        dae: {
          specialDuration: ['turnStart'],
        },
      },
    });
  }

  get _sharpshooter() {
    return this._effectHelpers.createActiveEffect({
      name: game.i18n.localize("Effects.Sharpshooter"),
      description: game.i18n.localize("Effects.SharpshooterDescription"),
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
