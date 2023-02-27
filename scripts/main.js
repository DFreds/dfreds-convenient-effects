import ChatHandler from './chat-handler.js';
import Constants from './constants.js';
import Controls from './controls.js';
import EffectDefinitions from './effects/effect-definitions.js';
import EffectInterface from './effect-interface.js';
import FoundryHelpers from './foundry-helpers.js';
import HandlebarHelpers from './handlebar-helpers.js';
import MacroHandler from './macro-handler.js';
import Settings from './settings.js';
import StatusEffects from './status-effects.js';
import { libWrapper } from './lib/shim.js';
import TextEnrichers from './text-enrichers.js';
import { addDescriptionToEffectConfig } from './ui/add-description-to-effect-config.js';
import { addNestedEffectsToEffectConfig } from './ui/add-nested-effects-to-effect-config.js';
import { isConvenient } from './effects/effect-helpers.js';

/**
 * Initialize the settings and handlebar helpers
 */
Hooks.once('init', () => {
  new Settings().registerSettings();
  new HandlebarHelpers().registerHelpers();
  new TextEnrichers().initialize();
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
  const settings = new Settings();

  if (!settings.customEffectsItemId) {
    const item = await CONFIG.Item.documentClass.create({
      name: 'Custom Convenient Effects',
      img: 'modules/dfreds-convenient-effects/images/magic-palm.svg',
      type: 'consumable',
    });

    await settings.setCustomEffectsItemId(item.id);
  }

  Hooks.callAll(`${Constants.MODULE_ID}.initialize`);
});

Hooks.once(`${Constants.MODULE_ID}.initialize`, async () => {
  game.dfreds.statusEffects.initialize();

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
});

Hooks.on('changeSidebarTab', (directory) => {
  if (!(directory instanceof ItemDirectory)) return;

  const settings = new Settings();
  const customEffectsItemId = settings.customEffectsItemId;

  if (!customEffectsItemId) return;

  const html = directory.element;
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
  if (!isConvenient(activeEffect) || !(activeEffect?.parent instanceof Actor))
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
 * Handle when an active effect is created
 */
Hooks.on('createActiveEffect', (activeEffect, _config, _userId) => {
  const settings = new Settings();
  if (activeEffect.parent.id == settings.customEffectsItemId) {
    // Re-render the app if open and a new effect is added to the custom item
    const foundryHelpers = new FoundryHelpers();
    foundryHelpers.renderConvenientEffectsAppIfOpen();
  }
});

/**
 * Handle re-rendering the app if it is open and an update occurs
 */
Hooks.on('updateActiveEffect', (activeEffect, _config, _userId) => {
  const settings = new Settings();
  if (activeEffect.parent.id == settings.customEffectsItemId) {
    const foundryHelpers = new FoundryHelpers();
    foundryHelpers.renderConvenientEffectsAppIfOpen();
  }
});

/**
 * Handle creating a chat message if an effect has expired or was removed
 */
Hooks.on('preDeleteActiveEffect', (activeEffect, _config, _userId) => {
  if (!isConvenient(activeEffect) || !(activeEffect?.parent instanceof Actor))
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
  const settings = new Settings();
  if (activeEffect.parent.id == settings.customEffectsItemId) {
    const foundryHelpers = new FoundryHelpers();
    foundryHelpers.renderConvenientEffectsAppIfOpen();
  }

  if (!isConvenient(activeEffect) || !(activeEffect?.parent instanceof Actor)) {
    return;
  }

  // Remove effects that were added due to this effect
  const actor = activeEffect.parent;
  const effectIdsFromThisEffect = actor.effects
    .filter(
      (effect) => effect.origin === `Convenient Effect: ${activeEffect.label}`
    )
    .map((effect) => effect.id);

  if (effectIdsFromThisEffect) {
    actor.deleteEmbeddedDocuments('ActiveEffect', effectIdsFromThisEffect);
  }
});

/**
 * Handle changing the rendered active effect config
 */
Hooks.on(
  'renderActiveEffectConfig',
  async (activeEffectConfig, $html, _data) => {
    addDescriptionToEffectConfig(activeEffectConfig, $html);

    const settings = new Settings();

    // Only add nested effects if the effect exists on the custom effect item
    if (activeEffectConfig.object.parent.id != settings.customEffectsItemId)
      return;
    addNestedEffectsToEffectConfig(activeEffectConfig, $html);
  }
);

/**
 * Handle re-rendering the ConvenientEffectsApp if it is open and a custom convenient active effect sheet is closed
 */
Hooks.on('closeActiveEffectConfig', (activeEffectConfig, _html) => {
  const settings = new Settings();

  // Only re-render if the effect exists on the custom effect
  if (activeEffectConfig.object.parent.id != settings.customEffectsItemId)
    return;

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
  if (!game.dfreds.effectInterface.hasNestedEffects(effect)) return;

  game.dfreds.effectInterface.addEffect({
    effectName: data.effectName,
    uuid: actor.uuid,
  });
});
