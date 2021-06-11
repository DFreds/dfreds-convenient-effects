import Controls from './controls.js';
import EffectDefinitions from './effect-definitions.js';
import Helper from './helper-lang.js';
import Settings from './settings.js';

Hooks.once('init', () => {
  new Settings().registerSettings();

  game.dfreds = game.dfreds || {};
});

Hooks.once('ready', function() {
  // Do anything once the module is ready
  Helper.initLangEffect();
  game.dfreds.effects = new EffectDefinitions();
});

Hooks.on('getSceneControlButtons', controls => {
  new Controls().initializeControls(controls);
});
