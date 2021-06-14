import Effect from './effect.js';
import Constants from './constants.js';

export default class EffectDefinitions {
  get all() {
    return [
      ...this.conditions,
      ...this.spells,
      ...this.classFeatures,
      ...this.other,
    ];
  }

  get conditions() {
    return [
      this._blinded,
      this._charmed,
      this._concentrating,
      this._dead,
      this._deafened,
      this._diseased,
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

  get spells() {
    return [
      this._aid, // TODO handle higher levels
      this._bane,
      this._barkskin,
      this._beaconOfHope,
      this._bless,
      this._blur,
      this._darkvision,
      this._enlarge,
      this._enhanceAbilityBearsEndurance,
      this._enhanceAbilityBullsStrength,
      this._enhanceAbilityCatsGrace,
      this._enhanceAbilityEaglesSplendor,
      this._enhanceAbilityFoxsCunning,
      this._enhanceAbilityOwlsWisdom,
      this._faerieFire,
      // this._falseLife, // TODO when we figure out higher level casting
      this._fireShieldColdResistance,
      this._fireShieldFireResistance,
      this._fly,
      this._greaterInvisibility,
      this._guidance,
      this._guidingBolt,
      this._haste,
      // this._heroesFeast, - TODO when the issue with aid increasing current/max hp is fixed
      // this._heroism, TODO how to get the spellcasting modifier of the one casting it
      this._huntersMark,
      this._invisibility,
      this._longstrider,
      this._mageArmor,
      this._mindBlank,
      this._passWithoutTrace,
      this._protectionFromEnergyAcid,
      this._protectionFromEnergyCold,
      this._protectionFromEnergyFire,
      this._protectionFromEnergyLightning,
      this._protectionFromEnergyThunder,
      this._protectionFromPoison,
      this._reduce,
      this._shield,
      this._shieldOfFaith,
      this._slow,
      this._spiderClimb,
      this._stoneskin,
      this._trueStrike,
    ];
  }

  get classFeatures() {
    return [
      this._rage,
      this._recklessAttack,
    ];
  }

  get other() {
    return [
      this._encumbered,
      this._flanked,
      this._flanking,
      this._favoredEnemy,
      this._greaterFavoredEnemy,
      this._greatWeaponMaster,
      this._heavilyEncumbered,
      this._rage,
      this._rangedDisadvantage,
      this._sharpshooter,
    ];
  }

  /* Condition Effects */

  get _dead() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionDead'),
      description: 'No active effects',
      icon: 'modules/dfreds-convenient-effects/images/dead.svg',
      changes: [],
    });
  }

  get _blinded() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionBlinded'),
      description:
        'Disadvantage on attack rolls while granting advantage to all who attack',
      icon: 'modules/dfreds-convenient-effects/images/blinded.svg',
      effects: [
        {
          key: 'flags.midi-qol.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.attributes.senses.darkvision',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.senses.truesight',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'flags.perfect-vision.sightLimit',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
      ],
    });
  }

  get _charmed() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionCharmed'),
      description: 'No active effects',
      icon: 'modules/dfreds-convenient-effects/images/charmed.svg',
    });
  }

  get _concentrating() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionConcentrating'),
      description: 'No active effects',
      icon: 'modules/dfreds-convenient-effects/images/concentrating.svg',
    });
  }

  get _deafened() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionDeafened'),
      description: 'No active effects',
      icon: 'modules/dfreds-convenient-effects/images/deafened.svg',
    });
  }

  get _diseased() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionDiseased'),
      description: 'No active effects',
      icon: 'modules/dfreds-convenient-effects/images/diseased.svg',
    });
  }

  get _exhaustion1() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionExhausted1'),
      description: 'Disadvantage on all ability checks',
      icon: 'modules/dfreds-convenient-effects/images/exhaustion1.svg',
      effects: [
        {
          key: 'flags.midi-qol.disadvantage.ability.check.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _exhaustion2() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionExhausted2'),
      description: 'Disadvantage on all ability checks and half movement',
      icon: 'modules/dfreds-convenient-effects/images/exhaustion2.svg',
      effects: [
        {
          key: 'flags.midi-qol.disadvantage.ability.check.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
      ],
    });
  }

  get _exhaustion3() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionExhausted3'),
      description:
        'Disadvantage on all ability checks, half movement, disadvantage on all attacks, and disadvantage on all saving throws',
      icon: 'modules/dfreds-convenient-effects/images/exhaustion3.svg',
      effects: [
        {
          key: 'flags.midi-qol.disadvantage.ability.check.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'flags.midi-qol.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.ability.save.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _exhaustion4() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionExhausted4'),
      description:
        'Disadvantage on all ability checks, half movement, disadvantage on all attacks, disadvantage on all saving throws, and half HP',
      icon: 'modules/dfreds-convenient-effects/images/exhaustion4.svg',
      effects: [
        {
          key: 'flags.midi-qol.disadvantage.ability.check.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
        {
          key: 'flags.midi-qol.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.ability.save.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.attributes.hp.max',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
      ],
    });
  }

  get _exhaustion5() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionExhausted5'),
      description:
        'Disadvantage on all ability checks, zero movement, disadvantage on all attacks, disadvantage on all saving throws, and half HP',
      icon: 'modules/dfreds-convenient-effects/images/exhaustion5.svg',
      effects: [
        {
          key: 'flags.midi-qol.disadvantage.ability.check.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'flags.midi-qol.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.ability.save.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.attributes.hp.max',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '0.5',
        },
      ],
    });
  }

  get _frightened() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionFrightened'),
      description: 'Disadvantage on all attack rolls and ability checks',
      icon: 'modules/dfreds-convenient-effects/images/frightened.svg',
      effects: [
        {
          key: 'flags.midi-qol.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.ability.check.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _grappled() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionGrappled'),
      description: 'No movement',
      icon: 'modules/dfreds-convenient-effects/images/grappled.svg',
      effects: [
        {
          key: 'data.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
      ],
    });
  }

  get _incapacitated() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionIncapacitated'),
      description: 'No movement',
      icon: 'modules/dfreds-convenient-effects/images/incapacitated.svg',
      effects: [
        {
          key: 'data.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
      ],
    });
  }

  get _invisible() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionInvisible'),
      description:
        'Grants advantage on attack rolls while forcing disadvantage to all who attack',
      icon: 'modules/dfreds-convenient-effects/images/invisible.svg',
      effects: [
        {
          key: 'flags.midi-qol.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _paralyzed() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionParalyzed'),
      description:
        'Fail all dexterity and strength saves, grant advantage to all who attack, and all melee attacks that hit are criticals',
      icon: 'modules/dfreds-convenient-effects/images/paralyzed.svg',
      effects: [
        {
          key: 'flags.midi-qol.fail.ability.save.dex',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.fail.ability.save.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.critical.mwak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.critical.msak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _petrified() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionPetrified'),
      description:
        'Grant advantage to all who attack and add damage resistance to all magical and physical attacks',
      icon: 'modules/dfreds-convenient-effects/images/petrified.svg',
      effects: [
        {
          key: 'flags.midi-qol.grants.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.traits.dr.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'physical',
        },
        {
          key: 'data.traits.dr.all',
          mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
          value: 'magical',
        },
      ],
    });
  }

  get _poisoned() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionPoisoned'),
      description: 'Disadvantage on all attack rolls and ability checks',
      icon: 'modules/dfreds-convenient-effects/images/poisoned.svg',
      effects: [
        {
          key: 'flags.midi-qol.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.ability.check.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _prone() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionProne'),
      description:
        'Grant advantage to all who melee attack and disadvantage to all who range attack',
      icon: 'modules/dfreds-convenient-effects/images/prone.svg',
      effects: [
        {
          key: 'flags.midi-qol.grants.advantage.attack.mwak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.advantage.attack.msak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.disadvantage.attack.rsak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.disadvantage.attack.rsak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _restrained() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionRestrained'),
      description:
        'Disadvantage on dexterity saving throws, disadvantage on all attacks, grant advantage to all who attack, and no movement',
      icon: 'modules/dfreds-convenient-effects/images/restrained.svg',
      effects: [
        {
          key: 'flags.midi-qol.disadvantage.ability.save.dex',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
      ],
    });
  }

  get _stunned() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionStunned'),
      description:
        'Fail all dexterity and strength saves and grant advantage to all who attack',
      icon: 'modules/dfreds-convenient-effects/images/stunned.svg',
      effects: [
        {
          key: 'flags.midi-qol.fail.ability.save.dex',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.fail.ability.save.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _unconscious() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionUnconscious'),
      description: '',
      icon: 'modules/dfreds-convenient-effects/images/unconscious.svg',
      effects: [
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '0',
        },
        {
          key: 'flags.midi-qol.fail.ability.save.str',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '1',
        },
        {
          key: 'flags.midi-qol.fail.ability.save.dex',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
          value: '1',
        },
      ],
    });
  }

  get _wounded() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.conditionWounded'),
      description: 'No active effects',
      icon: 'modules/dfreds-convenient-effects/images/wounded.svg',
    });
  }

  /* Spell Effects */

  get _aid() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellAid'),
      description: 'Add 5 to current and maximum hit points for 8 hours',
      icon: 'systems/dnd5e/icons/spells/heal-sky-1.jpg',
      seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      effects: [
        {
          key: 'data.attributes.hp.tempmax',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '5',
        },
        {
          key: 'data.attributes.hp.temp',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '5',
        },
      ],
    });
  }

  get _bane() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellBane'),
      description:
        'Subtract 1d4 from all saving throws and attack rolls for 1 minute',
      icon: 'systems/dnd5e/icons/spells/rip-magenta-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      effects: [
        {
          key: 'data.bonuses.abilities.save',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
        {
          key: 'data.bonuses.msak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
        {
          key: 'data.bonuses.mwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
        {
          key: 'data.bonuses.rsak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
        {
          key: 'data.bonuses.rwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
      ],
    });
  }

  get _barkskin() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellBarkskin'),
      description: 'Upgrade AC to 16 for 1 hour',
      icon: 'systems/dnd5e/icons/spells/protect-orange-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'data.attributes.ac.value',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: '16',
        },
      ],
    });
  }

  get _beaconOfHope() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellBeaconOfHope'),
      description:
        'Adds advantage to wisdom saving throws and death saving throws for 1 minute',
      icon: 'systems/dnd5e/icons/spells/light-sky-3.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      effects: [
        {
          key: 'flags.midi-qol.advantage.ability.save.wis',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.advantage.deathSave',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _bless() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellBless'),
      description: 'Add 1d4 to all saving throws and attack rolls for 1 minute',
      icon: 'systems/dnd5e/icons/spells/haste-sky-1.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      effects: [
        {
          key: 'data.bonuses.abilities.save',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1d4',
        },
        {
          key: 'data.bonuses.msak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1d4',
        },
        {
          key: 'data.bonuses.mwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1d4',
        },
        {
          key: 'data.bonuses.rsak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1d4',
        },
        {
          key: 'data.bonuses.rwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1d4',
        },
      ],
    });
  }

  get _blur() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellBlur'),
      description: 'Grants disadvantage to all who attack for 1 minute',
      icon: 'systems/dnd5e/icons/spells/air-burst-sky-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      effects: [
        {
          key: 'flags.midi-qol.grants.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _darkvision() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellDarkvision'),
      description: 'Upgrade darkvision to 60 ft. for 8 hours',
      icon: 'systems/dnd5e/icons/spells/evil-eye-red-1.jpg',
      seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      effects: [
        {
          key: 'data.attributes.senses.darkvision',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: '60',
        },
      ],
    });
  }

  get _enlarge() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellEnlarge'),
      description:
        'Add 1d4 to damage and advantage on strength checks and strength saving throws for 1 minute',
      icon: 'systems/dnd5e/icons/spells/link-blue-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      effects: [
        // TODO data.traits.size
        {
          key: 'data.bonuses.weapon.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1d4',
        },
        {
          key: 'flags.midi-qol.advantage.ability.check.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.advantage.ability.save.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _faerieFire() {
    return new Effect({
      name: 'Faerie Fire',
      description: 'Grants advantage to all who attack for 1 minute',
      icon: 'systems/dnd5e/icons/spells/fire-arrows-jade-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      effects: [
        // TODO dim light
        {
          key: 'flags.midi-qol.grants.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _fly() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellFly'),
      description: 'Upgrade flying speed to 60 ft. for 10 minutes',
      icon: 'systems/dnd5e/icons/spells/link-spirit-1.jpg',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      effects: [
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE,
          value: '60',
        },
      ],
    });
  }

  get _fireShieldColdResistance() {
    return new Effect({
      name: 'Fire Shield (Cold Resistance)',
      description: 'Add damage resistance to cold for 10 minutes',
      icon: 'systems/dnd5e/icons/spells/protect-red-3.jpg',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      effects: [
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'cold',
        },
      ],
    });
  }

  get _fireShieldFireResistance() {
    return new Effect({
      name: 'Fire Shield (Fire Resistance)',
      description: 'Add damage resistance to fire for 10 minutes',
      icon: 'systems/dnd5e/icons/spells/protect-red-3.jpg',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      effects: [
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'fire',
        },
      ],
    });
  }

  get _enhanceAbilityBearsEndurance() {
    return new Effect({
      name: "Enhance Ability (Bear's Endurance) for 1 hour",
      description:
        'Advantage on constitution checks and 2d6 temp hit points (rolled automatically)',
      icon: 'systems/dnd5e/icons/spells/haste-royal-2.jpg',
      isDynamic: true,
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'flags.midi-qol.advantage.ability.check.con',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _enhanceAbilityBullsStrength() {
    return new Effect({
      name: "Enhance Ability (Bull's Strength) for 1 hour",
      description:
        'Advantage on strength checks and double maximum carrying capacity',
      icon: 'systems/dnd5e/icons/spells/haste-royal-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'flags.midi-qol.advantage.ability.check.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.attributes.encumbrance.max',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: '2',
        },
      ],
    });
  }

  get _enhanceAbilityCatsGrace() {
    return new Effect({
      name: "Enhance Ability (Cat's Grace) for 1 hour",
      description: 'Advantage on dexterity checks',
      icon: 'systems/dnd5e/icons/spells/haste-royal-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'flags.midi-qol.advantage.ability.check.dex',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _enhanceAbilityEaglesSplendor() {
    return new Effect({
      name: "Enhance Ability (Eagle's Splendor) for 1 hour",
      description: 'Advantage on charisma checks',
      icon: 'systems/dnd5e/icons/spells/haste-royal-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'flags.midi-qol.advantage.ability.check.cha',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _enhanceAbilityFoxsCunning() {
    return new Effect({
      name: "Enhance Ability (Fox's Cunning)",
      description: 'Advantage on intelligence checks for 1 hour',
      icon: 'systems/dnd5e/icons/spells/haste-royal-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'flags.midi-qol.advantage.ability.check.int',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _enhanceAbilityOwlsWisdom() {
    return new Effect({
      name: "Enhance Ability (Owl's Wisdom)",
      description: 'Advantage on wisdom checks for 1 hour',
      icon: 'systems/dnd5e/icons/spells/haste-royal-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'flags.midi-qol.advantage.ability.check.wis',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _greaterInvisibility() {
    return new Effect({
      name: 'Greater Invisibility',
      description:
        'Grants advantage on attack rolls while forcing disadvantage to all who attack for 1 minute',
      icon: 'systems/dnd5e/icons/spells/fog-water-air-3.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      effects: [
        {
          key: 'flags.midi-qol.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _guidance() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellGuidance'),
      description: 'Adds 1d4 to one ability or skill check for 1 minute',
      icon: 'systems/dnd5e/icons/spells/haste-sky-1.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      flags: {
        dae: {
          specialDuration: ['isCheck', 'isSkill'],
        },
      },
      effects: [
        {
          key: 'data.bonuses.abilities.check',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1d4',
        },
      ],
    });
  }

  get _guidingBolt() {
    return new Effect({
      name: 'Guiding Bolt',
      description:
        'Grants advantage to next attacker or until the end of next turn',
      icon: 'systems/dnd5e/icons/spells/fireball-sky-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_ROUND,
      turns: 1,
      flags: {
        dae: {
          specialDuration: ['isAttacked'],
        },
      },
      effects: [
        {
          key: 'flags.midi-qol.grants.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _haste() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellHaste'),
      description:
        'Double speed, add 2 to AC, and advantage on dexterity saving throws for 1 minute',
      icon: 'systems/dnd5e/icons/spells/haste-royal-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      effects: [
        {
          key: 'data.attributes.ac.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '2',
        },
        {
          key: 'flags.midi-qol.advantage.ability.save.dex',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: 2,
        },
        {
          key: 'data.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: 2,
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: 2,
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: 2,
        },
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: 2,
        },
      ],
    });
  }

  get _huntersMark() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellHuntersMark1h'),
      description: 'No active effects',
      icon: 'systems/dnd5e/icons/spells/evil-eye-red-1.jpg',
    });
  }

  get _invisibility() {
    return new Effect({
      name: 'Invisibility',
      description:
        'Grants advantage on attack rolls while forcing disadvantage to all who attack for 1 hour',
      icon: 'systems/dnd5e/icons/spells/fog-sky-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'flags.midi-qol.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _longstrider() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellLongstrider'),
      description: 'Increase all movement by 10 ft. for 1 hour',
      icon: 'systems/dnd5e/icons/spells/wind-sky-1.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '10',
        },
        {
          key: 'data.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '10',
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '10',
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '10',
        },
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '10',
        },
      ],
    });
  }

  get _mageArmor() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellMageArmor'),
      description: 'Upgrades armor to 13 + dex modifier for 8 hours',
      icon: 'systems/dnd5e/icons/spells/protect-blue-1.jpg',
      seconds: Constants.SECONDS.IN_EIGHT_HOURS,
      isDynamic: true,
    });
  }

  get _mindBlank() {
    return new Effect({
      name: 'Mind Blank',
      description: 'Adds immunity to psychic damage for 24 hours',
      icon: 'systems/dnd5e/icons/spells/air-burst-sky-3.jpg',
      seconds: Constants.SECONDS.IN_ONE_DAY,
      effects: [
        {
          key: 'data.traits.di.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'psychic',
        },
      ],
    });
  }

  get _passWithoutTrace() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellPassWithoutTrace'),
      description: 'Add 10 to stealth checks for 1 hour',
      icon: 'systems/dnd5e/icons/spells/fog-air-1.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'data.skills.ste.mod',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '10',
        },
      ],
    });
  }

  get _protectionFromEnergyAcid() {
    return new Effect({
      name: 'Protection from Energy (Acid)',
      description: 'Adds damage resistance to acid for 1 hour',
      icon: 'systems/dnd5e/icons/spells/protect-jade-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'acid',
        },
      ],
    });
  }

  get _protectionFromEnergyCold() {
    return new Effect({
      name: 'Protection from Energy (Cold)',
      description: 'Adds damage resistance to cold for 1 hour',
      icon: 'systems/dnd5e/icons/spells/protect-jade-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'cold',
        },
      ],
    });
  }

  get _protectionFromEnergyFire() {
    return new Effect({
      name: 'Protection from Energy (Fire)',
      description: 'Adds damage resistance to fire for 1 hour',
      icon: 'systems/dnd5e/icons/spells/protect-jade-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'fire',
        },
      ],
    });
  }

  get _protectionFromEnergyLightning() {
    return new Effect({
      name: 'Protection from Energy (Lightning)',
      description: 'Adds damage resistance to lightning for 1 hour',
      icon: 'systems/dnd5e/icons/spells/protect-jade-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'lightning',
        },
      ],
    });
  }

  get _protectionFromEnergyThunder() {
    return new Effect({
      name: 'Protection from Energy (Thunder)',
      description: 'Adds damage resistance to thunder for 1 hour',
      icon: 'systems/dnd5e/icons/spells/protect-jade-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'thunder',
        },
      ],
    });
  }

  get _protectionFromPoison() {
    return new Effect({
      name: 'Protection from Poison',
      description:
        'Adds resistance to poison for 1 hour (does not grant automatic advantage on saving throws against poison)',
      icon: 'systems/dnd5e/icons/spells/protect-acid-1.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          /* TODO */ value: 'poison',
        },
      ],
    });
  }

  get _reduce() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellReduce'),
      description:
        'Subtract 1d4 from damage and disadvantage on strength checks and strength saving throws for 1 minute',
      icon: 'systems/dnd5e/icons/spells/link-blue-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      effects: [
        // TODO data.traits.size
        {
          key: 'data.bonuses.weapon.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-1d4',
        },
        {
          key: 'flags.midi-qol.disadvantage.ability.check.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.ability.save.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _shield() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellShield'),
      description: 'Add 5 to AC until next turn',
      icon: 'systems/dnd5e/icons/spells/protect-magenta-1.jpg',
      seconds: Constants.SECONDS.IN_ONE_ROUND,
      flags: {
        dae: {
          specialDuration: ['turnStart'],
        },
      },
      effects: [
        {
          key: 'data.attributes.ac.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '5',
        },
      ],
    });
  }

  get _shieldOfFaith() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellShieldOfFaith'),
      description: 'Adds 2 to the AC for 10 minutes',
      icon: 'systems/dnd5e/icons/spells/protect-sky-2.jpg',
      seconds: Constants.SECONDS.IN_TEN_MINUTES,
      effects: [
        {
          key: 'data.attributes.ac.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '2',
        },
      ],
    });
  }

  get _slow() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.spellSlow'),
      description:
        'Halves speed and and subtract 2 from AC and dexterity saving throws for 1 minute',
      icon: 'systems/dnd5e/icons/spells/fog-magenta-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      effects: [
        {
          key: 'data.attributes.ac.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-2',
        },
        {
          key: 'data.abilities.dex.save',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-2',
        },
        {
          key: 'data.attributes.movement.burrow',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: 0.5,
        },
        {
          key: 'data.attributes.movement.climb',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: 0.5,
        },
        {
          key: 'data.attributes.movement.fly',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: 0.5,
        },
        {
          key: 'data.attributes.movement.swim',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: 0.5,
        },
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.MULTIPLY,
          value: 0.5,
        },
      ],
    });
  }

  get _spiderClimb() {
    return new Effect({
      name: 'Spider Climb',
      description: 'Grants climbing speed equal to walking speed for 1 hour',
      icon: 'systems/dnd5e/icons/spells/shielding-spirit-1.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      isDynamic: true,
    });
  }

  get _stoneskin() {
    return new Effect({
      name: 'Stoneskin',
      description: 'Adds resistance to non-magical physical damage for 1 hour',
      icon: 'systems/dnd5e/icons/spells/protect-orange-2.jpg',
      seconds: Constants.SECONDS.IN_ONE_HOUR,
      effects: [
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          /* TODO */ value: 'physical',
        },
      ],
    });
  }

  get _trueStrike() {
    return new Effect({
      name: 'True Strike',
      description:
        'Grants advantage on next attack or until the end of next turn',
      icon: 'systems/dnd5e/icons/spells/enchant-sky-1.jpg',
      seconds: Constants.SECONDS.IN_ONE_ROUND,
      turns: 1,
      flags: {
        dae: {
          specialDuration: ['1Attack'],
        },
      },
      effects: [
        {
          key: 'flags.midi-qol.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  /** Class specific */
  get _rage() {
    return new Effect({
      name: 'Rage',
      description:
        'Advantage on strength checks and strength saving throws, a variable bonus to melee damage based on barbarian level, and resistance to piercing, bludgeoning, and slashing damage for 1 minute. Also handles Path of the Totem Warrior resistances.',
      icon: 'systems/dnd5e/icons/skills/red_10.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      isDynamic: true,
      effects: [
        {
          key: 'flags.midi-qol.advantage.ability.check.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.advantage.ability.save.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'slashing',
        },
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'piercing',
        },
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'bludgeoning',
        },
      ],
    });
  }

  get _recklessAttack() {
    return new Effect({
      name: 'Reckless Attack',
      description: 'Advantage on melee attacks and grants advantage to those who attack for 1 turn',
      icon: 'systems/dnd5e/icons/skills/weapon_34.jpg',
      seconds: Constants.SECONDS.IN_ONE_ROUND,
      effects: [
        {
          key: 'flags.midi-qol.advantage.attack.mwak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.advantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  /* Other effects */
  get _encumbered() {
    return new Effect({
      name: 'Encumbered',
      description: 'Lowers movement by 10 ft.',
      icon: 'icons/svg/down.svg',
      effects: [
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-10',
        },
      ],
    });
  }

  get _flanked() {
    return new Effect({
      name: 'Flanked',
      description: 'Grants advantage to all who melee attack',
      icon: 'modules/dfreds-convenient-effects/images/encirclement.svg',
      effects: [
        {
          key: 'flags.midi-qol.grants.advantage.attack.mwak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.grants.advantage.attack.msak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _flanking() {
    return new Effect({
      name: 'Flanking',
      description: 'Grants advantage on melee attack rolls',
      icon: 'icons/svg/sword.svg',
      effects: [
        {
          key: 'flags.midi-qol.advantage.attack.mwak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.advantage.attack.msak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _greatWeaponMaster() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.featureGreatWeaponMaster'),
      description: 'Subtracts 5 from melee attacks but adds 10 to melee damage',
      icon: 'systems/dnd5e/icons/skills/red_05.jpg',
      effects: [
        {
          key: 'data.bonuses.mwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-5',
        },
        {
          key: 'data.bonuses.mwak.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+10',
        },
      ],
    });
  }

  get _heavilyEncumbered() {
    return new Effect({
      name: 'Heavily Encumbered',
      description:
        'Lowers movement by 20 ft., disadvantage on all attack rolls, and disadvantage on strength, dexterity, and constitution saves',
      icon: 'icons/svg/downgrade.svg',
      effects: [
        {
          key: 'data.attributes.movement.walk',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-20',
        },
        {
          key: 'flags.midi-qol.disadvantage.attack.all',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.ability.save.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.ability.save.dex',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.ability.save.con',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _rage() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.featureRage'),
      description:
        'Advantage on strength checks and strength saving throws, a variable bonus to melee damage based on barbarian level, and resistance to piercing, bludgeoning, and slashing damage for 1 minute. Also handles Path of the Totem Warrior resistances.',
      icon: 'systems/dnd5e/icons/skills/red_10.jpg',
      seconds: Constants.SECONDS.IN_ONE_MINUTE,
      isDynamic: true,
      effects: [
        {
          key: 'flags.midi-qol.advantage.ability.check.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.advantage.ability.save.str',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'slashing',
        },
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'piercing',
        },
        {
          key: 'data.traits.dr.value',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: 'bludgeoning',
        },
      ],
    });
  }

  get _rangedDisadvantage() {
    return new Effect({
      name: 'Ranged Disadvantage',
      description: 'Disadvantage on ranged attack rolls',
      icon: 'modules/dfreds-convenient-effects/images/broken-arrow.svg',
      effects: [
        {
          key: 'flags.midi-qol.disadvantage.attack.rwak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
        {
          key: 'flags.midi-qol.disadvantage.attack.rsak',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '1',
        },
      ],
    });
  }

  get _sharpshooter() {
    return new Effect({
      name: game.i18n.localize('dfreds-convenient-effects.featureSharpshooter'),
      description:
        'Subtracts 5 from ranged attacks but adds 10 to ranged damage',
      icon: 'systems/dnd5e/icons/skills/green_01.jpg',
      effects: [
        {
          key: 'data.bonuses.rwak.attack',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '-5',
        },
        {
          key: 'data.bonuses.rwak.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '+10',
        },
      ],
    });
  }

  get _favoredEnemy() {
    return {
      name: game.i18n.localize('dfreds-convenient-effects.featureFavoredEnemy'),
      description: 'Adds 2 to ranged and melee damage rolls',
      icon: 'systems/dnd5e/icons/skills/red_01.jpg',
      changes: [
        { 
          key: 'data.bonuses.mwak.damage', 
          mode: CONST.ACTIVE_EFFECT_MODES.ADD, 
          value: '2' 
        },
        { 
          key: 'data.bonuses.rwak.damage', 
          mode: CONST.ACTIVE_EFFECT_MODES.ADD,
          value: '2' 
        },
      ],
    };
  }

  get _greaterFavoredEnemy() {
    return {
      name: game.i18n.localize('dfreds-convenient-effects.featureGreaterFavoredEnemy'),
      description: 'Adds 4 to ranged and melee damage rolls',
      icon: 'systems/dnd5e/icons/skills/red_02.jpg',
      changes: [
        { 
          key: 'data.bonuses.mwak.damage', 
          mode: CONST.ACTIVE_EFFECT_MODES.ADD, 
          value: '4' 
        },
        { 
          key: 'data.bonuses.rwak.damage',
          mode: CONST.ACTIVE_EFFECT_MODES.ADD, 
          value: '4' 
        },
      ],
    };
  }
}
