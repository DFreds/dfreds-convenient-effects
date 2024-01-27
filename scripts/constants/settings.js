import { SYSTEMS } from '../systems.js';
import { applySystemSpecificStyles } from '../settings.js';

const SETTINGS = {
  // Client settings

  // Module Settings

  // Style settings

  // System Settings
  DEFAULT_EFFECT_DEFINITIONS: 'defaultEffectDefinitions',
  DEFAULT_STATUS_EFFECT_NAMES: 'defaultStatusEffectNames',

  // Hidden settings
  SYSTEM_FOUND: 'systemFound',
  SYSTEM_NOT_FOUND_WARNING_SHOWN: 'systemNotFoundWarningShown',
  SYSTEM_VERSION: 'systemVersion',

  GET_DEFAULT() {
    return foundry.utils.deepClone(SETTINGS.DEFAULTS());
  },

  GET_SYSTEM_DEFAULTS() {
    return Object.fromEntries(
      Object.entries(SETTINGS.GET_DEFAULT()).filter((entry) => {
        return entry[1].system;
      })
    );
  },

  DEFAULTS: () => ({
    [SETTINGS.DEFAULT_EFFECT_DEFINITIONS]: {
      scope: 'world',
      config: false,
      system: true,
      type: Object,
      default: SYSTEMS.DATA.DEFAULT_EFFECT_DEFINITIONS,
    },
    [SETTINGS.DEFAULT_STATUS_EFFECT_NAMES]: {
      scope: 'world',
      config: false,
      system: true,
      type: Array,
      default: SYSTEMS.DATA.DEFAULT_STATUS_EFFECT_NAMES,
    },
  }),
};

export default SETTINGS;
