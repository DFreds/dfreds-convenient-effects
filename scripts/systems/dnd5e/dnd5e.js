import EffectDefinitionsDnd5e from './effect-definitions-dnd5e.js';

export default {
  DEFAULT_EFFECT_DEFINITIONS: new EffectDefinitionsDnd5e(),
  // TODO integration with 18n later based on this pr https://github.com/DFreds/dfreds-convenient-effects/pull/228
  DEFAULT_STATUS_EFFECT_NAMES: [
    'Blinded',
    'Charmed',
    'Concentrating',
    'Dead',
    'Deafened',
    'Exhaustion 1',
    'Exhaustion 2',
    'Exhaustion 3',
    'Exhaustion 4',
    'Exhaustion 5',
    'Frightened',
    'Grappled',
    'Incapacitated',
    'Invisible',
    'Paralyzed',
    'Petrified',
    'Poisoned',
    'Prone',
    'Restrained',
    'Stunned',
    'Unconscious',
    'Wounded',
  ],
};
