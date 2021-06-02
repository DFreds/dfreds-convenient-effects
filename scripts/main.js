import Controls from './controls.js';
import EffectDefinitions from './effect-definitions.js';
import Settings from './settings.js';

Hooks.once('init', () => {
  new Settings().registerSettings();

  game.dfreds = game.dfreds || {};
  game.dfreds.effects = new EffectDefinitions();
});

Hooks.on('getSceneControlButtons', (controls) => {
  new Controls().initializeControls(controls);
});
