import Constants from '../constants.js';
import Settings from '../settings.js';

export default class EffectHelpers {
  constructor() {
    this._settings = new Settings();
  }

  createActiveEffect({
    name,
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
    statuses = [],
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

    let ceFlags = {};

    ceFlags[Constants.MODULE_ID] = {};
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
          turns,
        }
      : duration;

    // Fixes an issue where statuses would be a set instead of an array
    let statusesArray = Array.from(statuses);
    statusesArray.unshift(this.getId(name));

    let effect = new CONFIG.ActiveEffect.documentClass({
      changes,
      description,
      disabled: false,
      duration: effectDuration,
      flags: foundry.utils.mergeObject(ceFlags, flags),
      icon,
      name,
      origin,
      tint,
      transfer: false,
      statuses: statusesArray,
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
    const effectDescription = activeEffect.description;
    const flagDescription = activeEffect.getFlag(
      Constants.MODULE_ID,
      Constants.FLAGS.DESCRIPTION
    );
    const legacyDescription = activeEffect.flags.convenientDescription;

    return effectDescription || flagDescription || legacyDescription;
  }

  /**
   * Gets the ID for a convenient effect using its name
   *
   * @param {string} name - the name of the effect
   * @returns The ID for the effect
   */
  getId(name) {
    return `Convenient Effect: ${name}`;
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

  /**
   * Updates the convenient effect status ID with the value of the active
   * effect name
   *
   * @param {ActiveEffect} activeEffect - the active effect
   */
  async updateStatusId(activeEffect) {
    const statusId = this.getId(activeEffect.name);
    let statusesSet = activeEffect.statuses;

    if (statusesSet.has(statusId)) {
      return;
    }

    let statusesArray = Array.from(statusesSet).filter(
      (status) => !status.startsWith('Convenient Effect: ')
    );

    statusesArray.unshift(statusId);
    let newStatusesSet = new Set(statusesArray);

    return activeEffect.update({ statuses: statusesArray });
  }
}
