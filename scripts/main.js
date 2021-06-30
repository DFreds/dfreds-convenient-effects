import Controls from './controls.js';
import EffectDefinitions from './effects/effect-definitions.js';
import EffectHandler from './effects/effect-handler.js';
import HandlebarHelpers from './handlebar-helpers.js';
import Settings from './settings.js';

Hooks.once('init', () => {
  new Settings().registerSettings();
  new HandlebarHelpers().registerHelpers();

  game.dfreds = game.dfreds || {};
  game.dfreds.effects = new EffectDefinitions();
  game.dfreds.effectHandler = new EffectHandler();
});

Hooks.on('getSceneControlButtons', (controls) => {
  new Controls().initializeControls(controls);
});

Hooks.on('preCreateActiveEffect', async (activeEffect, config, userId) => {
  const effectName = activeEffect?.data?.label?.split('Convenient Effect: ')[1];

  if (!effectName) return;

  game.dfreds.effectHandler.createChatForEffect({
    effectName,
    reason: 'Applied to',
    actor: activeEffect?.parent,
  });
});

Hooks.on('preDeleteActiveEffect', async (activeEffect, config, userId) => {
  const isExpired =
    activeEffect?.duration?.remaining !== null &&
    activeEffect?.duration?.remaining <= 0;
  const effectName = activeEffect?.data?.label?.split('Convenient Effect: ')[1];

  if (!effectName) return;

  if (isExpired) {
    game.dfreds.effectHandler.createChatForEffect({
      effectName,
      reason: 'Expired from',
      actor: activeEffect?.parent,
    });
  } else {
    game.dfreds.effectHandler.createChatForEffect({
      effectName,
      reason: 'Removed from',
      actor: activeEffect?.parent,
    });
  }
});
