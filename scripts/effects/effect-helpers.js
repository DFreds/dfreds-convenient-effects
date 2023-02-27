import Constants from '../constants.js';
import Settings from '../settings.js';

export function isConvenient(activeEffect) {
  const isConvenient =
    activeEffect.getFlag(Constants.MODULE_ID, Constants.FLAGS.IS_CONVENIENT) ??
    false;

  const isOldConvenient = activeEffect.flags.isConvenient;
  const isOldCustomConvenient = activeEffect.flags.isCustomConvenient;

  return isConvenient || isOldConvenient || isOldCustomConvenient;
}

export function getDescription(activeEffect) {
  const description = activeEffect.getFlag(
    Constants.MODULE_ID,
    Constants.FLAGS.DESCRIPTION
  );

  return description ?? activeEffect.flags.convenientDescription;
}

export function createActiveEffect({
  label,
  description = '',
  icon = 'icons/svg/aura.svg',
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
  const settings = new Settings();

  if (settings.integrateWithAte) {
    changes.push(...atlChanges);
  }

  if (settings.integrateWithTokenMagic) {
    changes.push(...tokenMagicChanges);
  }

  if (!flags.core) {
    flags.core = {};
  }
  flags.core.statusId = `Convenient Effect: ${label}`;

  flags[Constants.MODULE_ID] = {};
  flags[Constants.MODULE_ID][Constants.FLAGS.DESCRIPTION] = description;
  flags[Constants.MODULE_ID][Constants.FLAGS.IS_CONVENIENT] = true;
  flags[Constants.MODULE_ID][Constants.FLAGS.IS_DYNAMIC] = isDynamic;
  flags[Constants.MODULE_ID][Constants.FLAGS.IS_VIEWABLE] = isViewable;
  flags[Constants.MODULE_ID][Constants.FLAGS.NESTED_EFFECTS] = nestedEffects;
  flags[Constants.MODULE_ID][Constants.FLAGS.SUB_EFFECTS] = subEffects;

  let duration = {
    rounds: rounds ?? seconds / CONFIG.time.roundTime,
    seconds,
    startRound: game.combat?.round,
    startTime: game.time.worldTime,
    startTurn: game.combat?.turn,
    turns,
  };
  let effect = new CONFIG.ActiveEffect.documentClass({
    changes,
    disabled: false,
    duration,
    flags,
    icon,
    label,
    origin,
    transfer: false,
  });

  return effect;
}
