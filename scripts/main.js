import ChatHandler from './chat-handler.js';
import Constants from './constants.js';
import Controls from './controls.js';
import CustomEffectsHandler from './effects/custom-effects-handler.js';
import EffectDefinitions from './effects/effect-definitions.js';
import EffectInterface from './effect-interface.js';
import FoundryHelpers from './foundry-helpers.js';
import HandlebarHelpers from './handlebar-helpers.js';
import MacroHandler from './macro-handler.js';
import Settings from './settings.js';
import StatusEffects from './status-effects.js';
import { libWrapper } from './lib/shim.js';

/**
 * Initialize the settings and handlebar helpers
 */
Hooks.once('init', () => {
  new Settings().registerSettings();
  new HandlebarHelpers().registerHelpers();
});

/**
 * Handle initializing the API when socket lib is ready
 */
Hooks.once('socketlib.ready', () => {
  game.dfreds = game.dfreds || {};

  game.dfreds.effects = new EffectDefinitions();
  game.dfreds.effectInterface = new EffectInterface();
  game.dfreds.statusEffects = new StatusEffects();

  game.dfreds.effectInterface.initialize();
});

/**
 * Handle initializing the status and custom effects
 */
Hooks.once('ready', async () => {
  new Settings().migrateOldSettings();

  const customEffectsHandler = new CustomEffectsHandler();
  await customEffectsHandler.deleteInvalidEffects();
  game.dfreds.statusEffects.initializeStatusEffects();
});

/**
 * Handle setting up the lib wrapper overrides
 */
Hooks.once('setup', () => {
  libWrapper.register(
    Constants.MODULE_ID,
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
    Constants.MODULE_ID,
    'TokenHUD.prototype._getStatusEffectChoices',
    function (wrapper, ...args) {
      const token = this.object;
      return game.dfreds.statusEffects.getStatusEffectChoices({
        token,
        wrapper,
        args,
      });
    }
  );

  libWrapper.register(
    Constants.MODULE_ID,
    'TokenHUD.prototype.refreshStatusIcons',
    function (wrapper, ...args) {
      const tokenHud = this;
      game.dfreds.statusEffects.refreshStatusIcons(tokenHud);
      wrapper(...args);
    },
    'WRAPPER'
  );
});

/**
 * Handle adding new controls
 */
Hooks.on('getSceneControlButtons', (controls) => {
  new Controls().initializeControls(controls);
});

/**
 * Handle creating a chat message if an effect is added
 */
Hooks.on('preCreateActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  const chatHandler = new ChatHandler();
  chatHandler.createChatForEffect({
    effectName: activeEffect?.data?.label,
    reason: 'Applied to',
    actor: activeEffect?.parent,
    isCreateActiveEffect: true,
  });
});

/**
 * Handle adding any actor data changes when an active effect is added to an actor
 */
Hooks.on('createActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  if (activeEffect?.data?.flags?.requiresActorUpdate) {
    game.dfreds.effectInterface.addActorDataChanges(
      activeEffect?.data?.label,
      activeEffect?.parent?.uuid
    );
  }
});

/**
 * Handle creating a chat message if an effect has expired or was removed
 */
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
    isCreateActiveEffect: false,
  });
});

/**
 * Handle removing any actor data changes when an active effect is deleted from an actor
 */
Hooks.on('deleteActiveEffect', (activeEffect, config, userId) => {
  if (!activeEffect?.data?.flags?.isConvenient) return;

  if (activeEffect?.data?.flags?.requiresActorUpdate) {
    game.dfreds.effectInterface.removeActorDataChanges(
      activeEffect?.data?.label,
      activeEffect?.parent?.uuid
    );
  }
});

/**
 * Handle adding a form item for effect description to custom effects
 */
Hooks.on('renderActiveEffectConfig', (activeEffectConfig, html, data) => {
  if (!activeEffectConfig?.object?.data?.flags?.isCustomConvenient) return;

  const labelFormGroup = html
    .find('section[data-tab="details"] .form-group')
    .first();

  const description =
    activeEffectConfig.object.data.flags.customEffectDescription ??
    'Applies custom effects';
  labelFormGroup.after(
    `<div class="form-group"><label>Effect Description</label><div class="form-fields"><input type="text" name="flags.customEffectDescription" value="${description}"></div></div>`
  );
});

/**
 * Handle re-rendering the ConvenientEffectsApp if it is open and a custom convenient active effect sheet is closed
 */
Hooks.on('closeActiveEffectConfig', (activeEffectConfig, html) => {
  if (!activeEffectConfig?.object?.data?.flags?.isCustomConvenient) return;

  const foundryHelpers = new FoundryHelpers();
  foundryHelpers.renderConvenientEffectsAppIfOpen();
});

/**
 * Handle dropping an effect onto the hotbar
 */
Hooks.on('hotbarDrop', (bar, data, slot) => {
  const macroHandler = new MacroHandler();
  macroHandler.createMacro(data, slot);
});

/**
 * Handle dropping an effect onto an actor sheet
 */
Hooks.on('dropActorSheetData', (actor, actorSheetCharacter, data) => {
  if (!data.effectName) return;

  game.dfreds.effectInterface.addEffect({
    effectName: data.effectName,
    uuid: actor.uuid,
  });
});
