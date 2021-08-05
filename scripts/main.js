import Controls from './controls.js';
import ActorUpdater from './effects/actor-updater.js';
import EffectDefinitions from './effects/effect-definitions.js';
import EffectHandler from './effects/effect-handler.js';
import HandlebarHelpers from './handlebar-helpers.js';
import Settings from './settings.js';
import StatusEffects from './status-effects.js';
import { libWrapper } from './lib/shim.js';
import socketInstance from './socket.js';

Hooks.once('init', () => {
  new Settings().registerSettings();
  new HandlebarHelpers().registerHelpers();

  game.dfreds = game.dfreds || {};
  game.dfreds.effects = new EffectDefinitions();
  game.dfreds.effectHandler = new EffectHandler();
  game.dfreds.statusEffects = new StatusEffects();
  game.dfreds.actorUpdater = new ActorUpdater();
});

Hooks.once('socketlib.ready', () => {
  socketInstance.initialize();
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

  libWrapper.register(
    MODULE_ID,
    'TokenHUD.prototype._getStatusEffectChoices',
    function (_wrapper, ..._args) {
      const token = this.object;
      return game.dfreds.statusEffects.getStatusEffectChoices(token);
    }
  );
});

Hooks.on('getSceneControlButtons', (controls) => {
  new Controls().initializeControls(controls);
});

Hooks.on('preCreateActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  game.dfreds.effectHandler.createChatForEffect({
    effectName: activeEffect?.data?.label,
    reason: 'Applied to',
    actor: activeEffect?.parent,
  });
});

Hooks.on('createActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  if (activeEffect?.data?.flags?.requiresActorUpdate) {
    game.dfreds.actorUpdater.addActorDataChanges(
      activeEffect?.data?.label,
      activeEffect?.parent?.uuid
    );
  }
});

Hooks.on('preDeleteActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  const isExpired =
    activeEffect?.duration?.remaining !== null &&
    activeEffect?.duration?.remaining <= 0;

  game.dfreds.effectHandler.createChatForEffect({
    effectName: activeEffect?.data?.label,
    reason: isExpired ? 'Expired from' : 'Removed from',
    actor: activeEffect?.parent,
  });
});

Hooks.on('deleteActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  if (activeEffect?.data?.flags?.requiresActorUpdate) {
    game.dfreds.actorUpdater.removeActorDataChanges(
      activeEffect?.data?.label,
      activeEffect?.parent?.uuid
    );
  }
});
