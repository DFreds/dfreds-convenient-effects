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

  Hooks.callAll(`${Constants.MODULE_ID}.ready`);
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

  libWrapper.register(
    Constants.MODULE_ID,
    'ActorSheet.prototype._onDropActiveEffect',
    async function (wrapper, ...args) {
      const [, data] = args;
      if (!data.effectName) {
        wrapper(...args);
      } else {
        // NOTE: taken from _onDropActiveEffect
        const effect = await ActiveEffect.implementation.fromDropData(data);
        if (!this.actor.isOwner || !effect) return false;
        if (this.actor.uuid === effect.parent?.uuid) return false; // NOTE: Modified to include optional
        return ActiveEffect.create(effect.toObject(), { parent: this.actor });
      }
    }
  );
});

Hooks.on('renderItemDirectory', (_itemDirectory, html, _data) => {
  const settings = new Settings();
  const customEffectsItemId = settings.customEffectsItemId;

  if (!customEffectsItemId) return;

  const li = html.find(`li[data-document-id="${customEffectsItemId}"]`);
  li.remove();
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
Hooks.on('preCreateActiveEffect', (activeEffect, _config, _userId) => {
  if (
    !activeEffect?.flags?.isConvenient ||
    !(activeEffect?.parent instanceof Actor)
  )
    return;

  const chatHandler = new ChatHandler();
  chatHandler.createChatForEffect({
    effectName: activeEffect?.label,
    reason: 'Applied to',
    actor: activeEffect?.parent,
    isCreateActiveEffect: true,
  });
});

/**
 * Handle adding any actor data changes when an active effect is added to an actor
 */
Hooks.on('createActiveEffect', (activeEffect, _config, _userId) => {
  if (
    !activeEffect?.flags?.isConvenient ||
    !(activeEffect?.parent instanceof Actor)
  )
    return;

  if (activeEffect?.flags?.requiresActorUpdate) {
    game.dfreds.effectInterface.addActorDataChanges(
      activeEffect?.label,
      activeEffect?.parent?.uuid
    );
  }
});

/**
 * Handle creating a chat message if an effect has expired or was removed
 */
Hooks.on('preDeleteActiveEffect', (activeEffect, _config, _userId) => {
  if (
    !activeEffect?.flags?.isConvenient ||
    !(activeEffect?.parent instanceof Actor)
  )
    return;

  const isExpired =
    activeEffect?.duration?.remaining !== null &&
    activeEffect?.duration?.remaining <= 0;

  const chatHandler = new ChatHandler();
  chatHandler.createChatForEffect({
    effectName: activeEffect?.label,
    reason: isExpired ? 'Expired from' : 'Removed from',
    actor: activeEffect?.parent,
    isCreateActiveEffect: false,
  });
});

/**
 * Handle removing any actor data changes when an active effect is deleted from an actor
 */
Hooks.on('deleteActiveEffect', (activeEffect, _config, _userId) => {
  if (
    !activeEffect?.flags?.isConvenient ||
    !(activeEffect?.parent instanceof Actor)
  )
    return;

  if (activeEffect?.flags?.requiresActorUpdate) {
    game.dfreds.effectInterface.removeActorDataChanges(
      activeEffect?.label,
      activeEffect?.parent?.uuid
    );
  }
});

/**
 * Handle adding a form item for effect description to custom effects
 */
Hooks.on('renderActiveEffectConfig', (activeEffectConfig, html, _data) => {
  if (!activeEffectConfig?.object?.flags?.isCustomConvenient) return;

  const labelFormGroup = html
    .find('section[data-tab="details"] .form-group')
    .first();

  const description =
    activeEffectConfig.object.flags.convenientDescription ??
    'Applies custom effects';
  labelFormGroup.after(
    `<div class="form-group"><label>Effect Description</label><div class="form-fields"><input type="text" name="flags.convenientDescription" value="${description}"></div></div>`
  );
});

/**
 * Handle re-rendering the ConvenientEffectsApp if it is open and a custom convenient active effect sheet is closed
 */
Hooks.on('closeActiveEffectConfig', (activeEffectConfig, _html) => {
  if (!activeEffectConfig?.object?.flags?.isCustomConvenient) return;

  const foundryHelpers = new FoundryHelpers();
  foundryHelpers.renderConvenientEffectsAppIfOpen();
});

/**
 * Handle dropping an effect onto the hotbar
 */
Hooks.on('hotbarDrop', (_bar, data, slot) => {
  if (!data.effectName) return;
  delete data.type; // This stops dnd5e from creating its own macro by obscuring that the drop data is an ActiveEffect
  const macroHandler = new MacroHandler();
  macroHandler.createMacro(data, slot);
});

/**
 * Handle dropping an effect onto an actor sheet
 */
Hooks.on('dropActorSheetData', (actor, _actorSheetCharacter, data) => {
  if (!data.effectName) return;

  const effect = game.dfreds.effectInterface.findEffectByName(data.effectName);

  // core will handle the drop since we are not using a nested effect
  if (!effect.nestedEffects.length) return;

  game.dfreds.effectInterface.addEffect({
    effectName: data.effectName,
    uuid: actor.uuid,
  });
});
