import Controls from './controls.js';
import EffectDefinitions from './effects/effect-definitions.js';
import EffectHandler from './effects/effect-handler.js';
import HandlebarHelpers from './handlebar-helpers.js';
import toggleEffect from './effects/toggle-effect.js';
import Settings from './settings.js';

Hooks.once('init', () => {
  new Settings().registerSettings();
  new HandlebarHelpers().registerHelpers();

  game.dfreds = game.dfreds || {};
  game.dfreds.effects = new EffectDefinitions();
  game.dfreds.toggleEffect = toggleEffect; // TODO deprecate and remove in future releases
  game.dfreds.effectHandler = new EffectHandler();
});

Hooks.on('getSceneControlButtons', (controls) => {
  new Controls().initializeControls(controls);
});

Hooks.on('preCreateActiveEffect', async (activeEffect, config, userId) => {
  const effectName = activeEffect?.data?.label?.split('Convenient Effect: ')[1];

  if (!effectName) return;

  game.dfreds.effectHandler.createChatForEffect(
    effectName,
    'Applied to',
    activeEffect?.parent
  );
});

Hooks.on('preDeleteActiveEffect', async (activeEffect, config, userId) => {
  const isExpired = activeEffect?.duration?.remaining === 0;
  const effectName = activeEffect?.data?.label?.split('Convenient Effect: ')[1];

  if (!effectName) return;

  if (isExpired) {
    game.dfreds.effectHandler.createChatForEffect(
      effectName,
      'Expired from',
      activeEffect?.parent
    );
  } else {
    game.dfreds.effectHandler.createChatForEffect(
      effectName,
      'Removed from',
      activeEffect?.parent
    );
  }
});
