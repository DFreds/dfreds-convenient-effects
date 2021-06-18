import Controls from './controls.js';
import EffectDefinitions from './effects/effect-definitions.js';
import EffectHandler from './effects/effect-handler.js';
import toggleEffect from './effects/toggle-effect.js';
import Settings from './settings.js';

Hooks.once('init', () => {
  new Settings().registerSettings();

  game.dfreds = game.dfreds || {};
  game.dfreds.effects = new EffectDefinitions();
  game.dfreds.toggleEffect = toggleEffect; // TODO deprecate and remove in future releases
  game.dfreds.effectHandler = new EffectHandler();
});

Hooks.on('getSceneControlButtons', (controls) => {
  new Controls().initializeControls(controls);
});

// TODO consider handling all chat messages via hooks
Hooks.on('preDeleteActiveEffect', async (activeEffect, config, userId) => {
  const isExpired = activeEffect?.duration?.remaining === 0;
  const effectName = activeEffect?.data?.label?.split('Convenient Effect: ')[1];

  if (isExpired && effectName) {
    game.dfreds.effectHandler.createChatOnExpiredConvenientEffect(effectName, activeEffect?.parent);
  }
});
