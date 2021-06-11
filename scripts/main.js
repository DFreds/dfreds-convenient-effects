import Controls from './controls.js';
import EffectDefinitions from './effect-definitions.js';
import toggleEffect from './toggle-effect.js';
import Settings from './settings.js';

Hooks.once('init', () => {
  new Settings().registerSettings();

  game.dfreds = game.dfreds || {};
  game.dfreds.effects = new EffectDefinitions();
  game.dfreds.toggleEffect = toggleEffect;
});

Hooks.on('getSceneControlButtons', (controls) => {
  new Controls().initializeControls(controls);
});
