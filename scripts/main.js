import Controls from './controls.js';
import EffectDefinitions from './effects/effect-definitions.js';
import EffectHandler from './effects/effect-handler.js';
import HandlebarHelpers from './handlebar-helpers.js';
import Settings from './settings.js';
import StatusEffects from './status-effects.js';
import { libWrapper } from './lib/shim.js';

Hooks.once('init', () => {
  new Settings().registerSettings();
  new HandlebarHelpers().registerHelpers();

  game.dfreds = game.dfreds || {};
  game.dfreds.effects = new EffectDefinitions();
  game.dfreds.effectHandler = new EffectHandler();
  game.dfreds.statusEffects = new StatusEffects();
});

Hooks.once('ready', () => {
  game.dfreds.statusEffects.initializeStatusEffects();
});

Hooks.once('setup', () => {
  const MODULE_ID = 'dfreds-convenient-effects';

  libWrapper.register(
    MODULE_ID,
    'TokenHUD.prototype._onToggleEffect',
    function (wrapper, ...args) {
      game.dfreds.statusEffects.onToggleEffect({
        token: this.object,
        wrapper,
        args,
      });
    }
  );
});

Hooks.on('getSceneControlButtons', (controls) => {
  new Controls().initializeControls(controls);
});

Hooks.on('preCreateActiveEffect', async (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  game.dfreds.effectHandler.createChatForEffect({
    effectName: activeEffect?.data?.label,
    reason: 'Applied to',
    actor: activeEffect?.parent,
  });
});

Hooks.on('preDeleteActiveEffect', async (activeEffect, config, userId) => {
  const isExpired =
    activeEffect?.duration?.remaining !== null &&
    activeEffect?.duration?.remaining <= 0;

  if (!activeEffect?.data?.flags?.isConvenient) return;

  if (isExpired) {
    game.dfreds.effectHandler.createChatForEffect({
      effectName: activeEffect?.data?.label,
      reason: 'Expired from',
      actor: activeEffect?.parent,
    });
  } else {
    game.dfreds.effectHandler.createChatForEffect({
      effectName: activeEffect?.data?.label,
      reason: 'Removed from',
      actor: activeEffect?.parent,
    });
  }
});
