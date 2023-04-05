import Constants from '../constants.js';
import Settings from '../settings.js';

export default class EffectHelpers {
  constructor() {
    this._settings = new Settings();
  }

  createActiveEffect({
    label,
    description = '',
    icon = 'icons/svg/aura.svg',
    duration = {},
    tint = null,
    seconds = null,
    rounds = null,
    turns = null,
    isDynamic = false,
    isViewable = true,
    flags = {},
    origin = null,
    changes = [],
    atlChanges = [],
    tokenMagicChanges = [],
    nestedEffects = [],
    subEffects = [],
  }) {
    if (this._settings.integrateWithAte) {
      changes.push(...atlChanges);
    }

    if (this._settings.integrateWithTokenMagic) {
      changes.push(...tokenMagicChanges);
    }

    let ceFlags = {
      core: {
        statusId: `Convenient Effect: ${label}`,
      },
    };

    ceFlags[Constants.MODULE_ID] = {};
    ceFlags[Constants.MODULE_ID][Constants.FLAGS.DESCRIPTION] = description;
    ceFlags[Constants.MODULE_ID][Constants.FLAGS.IS_CONVENIENT] = true;
    ceFlags[Constants.MODULE_ID][Constants.FLAGS.IS_DYNAMIC] = isDynamic;
    ceFlags[Constants.MODULE_ID][Constants.FLAGS.IS_VIEWABLE] = isViewable;
    ceFlags[Constants.MODULE_ID][Constants.FLAGS.NESTED_EFFECTS] =
      nestedEffects;
    ceFlags[Constants.MODULE_ID][Constants.FLAGS.SUB_EFFECTS] = subEffects;

    let effectDuration = isEmpty(duration)
      ? {
          rounds,
          seconds,
          startRound: game.combat?.round,
          startTime: game.time.worldTime,
          startTurn: game.combat?.turn,
          turns,
        }
      : duration;

    let effect = new CONFIG.ActiveEffect.documentClass({
      changes,
      disabled: false,
      duration: effectDuration,
      flags: foundry.utils.mergeObject(ceFlags, flags),
      icon,
      label,
      origin,
      tint,
      transfer: false,
    });

    return effect;
  }

  /**
   * Gets the description attached to the active effect
   *
   * @param {ActiveEffect} activeEffect - the active effect
   * @returns {string} The description for the effect
   */
  getDescription(activeEffect) {
    const description = activeEffect.getFlag(
      Constants.MODULE_ID,
      Constants.FLAGS.DESCRIPTION
    );

    return description ?? activeEffect.flags.convenientDescription;
  }

  /**
   * Gets the `isConvenient` flag on the active effect if it exists
   *
   * @param {ActiveEffect} activeEffect - the active effect
   * @returns {boolean} true if it is a convenient effect and false otherweise
   */
  isConvenient(activeEffect) {
    const isConvenient =
      activeEffect.getFlag(
        Constants.MODULE_ID,
        Constants.FLAGS.IS_CONVENIENT
      ) ?? false;

    const isOldConvenient = activeEffect.flags.isConvenient;
    const isOldCustomConvenient = activeEffect.flags.isCustomConvenient;

    return isConvenient || isOldConvenient || isOldCustomConvenient;
  }
}
