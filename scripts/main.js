import ChatHandler from './chat-handler.js';
import Controls from './controls.js';
import EffectDefinitions from './effects/effect-definitions.js';
import EffectInterface from './effect-interface.js';
import HandlebarHelpers from './handlebar-helpers.js';
import Settings from './settings.js';
import StatusEffects from './status-effects.js';
import { libWrapper } from './lib/shim.js';

Hooks.once('init', () => {
  new Settings().registerSettings();
  new HandlebarHelpers().registerHelpers();
});

Hooks.once('socketlib.ready', () => {
  game.dfreds = game.dfreds || {};
  game.dfreds.effects = new EffectDefinitions();
  game.dfreds.effectInterface = new EffectInterface();
  game.dfreds.statusEffects = new StatusEffects();

  game.dfreds.effectInterface.initialize();
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

  const chatHandler = new ChatHandler();
  chatHandler.createChatForEffect({
    effectName: activeEffect?.data?.label,
    reason: 'Applied to',
    actor: activeEffect?.parent,
  });
});

Hooks.on('createActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  if (activeEffect?.data?.flags?.requiresActorUpdate) {
    game.dfreds.effectInterface.addActorDataChanges(
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

  const chatHandler = new ChatHandler();
  chatHandler.createChatForEffect({
    effectName: activeEffect?.data?.label,
    reason: isExpired ? 'Expired from' : 'Removed from',
    actor: activeEffect?.parent,
  });
});

Hooks.on('deleteActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  if (activeEffect?.data?.flags?.requiresActorUpdate) {
    game.dfreds.effectInterface.removeActorDataChanges(
      activeEffect?.data?.label,
      activeEffect?.parent?.uuid
    );
  }
});

Hooks.on('updateActiveEffect', (activeEffect, obj, info, id) => {
  if (!activeEffect?.data?.flags?.isCustomConvenient) return;

  // TODO this is called whenver a change or DAE custom duration flag is added... so won't work here
  game.dfreds.effectInterface.addNewEffect(activeEffect);
});

Hooks.on('closeActiveEffectConfig', (activeEffectConfig, configSheet) => {
  if (!activeEffectConfig?.object?.data?.flags?.isCustomConvenient) return;

  const itemToDelete = game.items.get(
    activeEffectConfig.object.data.flags.itemIdToDelete
  );
  itemToDelete?.delete();
});
