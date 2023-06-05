import Constants from './constants.js';
import CustomEffectsHandler from './effects/custom-effects-handler.js';
import EffectHandler from './effects/effect-handler.js';
import EffectHelpers from './effects/effect-helpers.js';
import FoundryHelpers from './foundry-helpers.js';
import Settings from './settings.js';

/**
 * Interface for working with effects and executing them as a GM via sockets
 */
export default class EffectInterface {
  constructor() {
    this._customEffectsHandler = new CustomEffectsHandler();
    this._effectHandler = new EffectHandler();
    this._effectHelpers = new EffectHelpers();
    this._foundryHelpers = new FoundryHelpers();
    this._settings = new Settings();
  }

  /**
   * Initializes the socket and registers the socket functions
   */
  initialize() {
    this._socket = socketlib.registerModule(Constants.MODULE_ID);
    this._registerFunctions();
  }

  _registerFunctions() {
    this._socket.register(
      'toggleEffect',
      this._effectHandler.toggleEffect.bind(this._effectHandler)
    );
    this._socket.register(
      'addEffect',
      this._effectHandler.addEffect.bind(this._effectHandler)
    );
    this._socket.register(
      'removeEffect',
      this._effectHandler.removeEffect.bind(this._effectHandler)
    );
  }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name. Prioritizes finding custom effects first.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {ActiveEffect} the found effect
   */
  findEffectByName(effectName) {
    const effect = this.findCustomEffectByName(effectName);
    if (effect) return effect;

    return game.dfreds.effects.all.find((effect) => effect.name == effectName);
  }

  /**
   * Searches through the list of available custom effects and returns one matching the
   * effect name.
   *
   * @param {string} effectName - the effect name to search for
   * @returns {ActiveEffect} the found effect
   */
  findCustomEffectByName(effectName) {
    const effect = this._customEffectsHandler
      .getCustomEffects()
      .find((effect) => effect.name == effectName);

    return effect;
  }

  /**
   * Toggles the effect on the provided actor UUIDS as the GM via sockets. If no actor
   * UUIDs are provided, it finds one of these in this priority:
   *
   * 1. The targeted tokens (if prioritize targets is enabled)
   * 2. The currently selected tokens on the canvas
   * 3. The user configured character
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {object} params - the effect parameters
   * @param {boolean} params.overlay - if the effect is an overlay or not
   * @param {string[]} params.uuids - UUIDS of the actors to toggle the effect on
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async toggleEffect(effectName, { overlay, uuids = [] } = {}) {
    if (uuids.length == 0) {
      uuids = this._foundryHelpers.getActorUuids();
    }

    if (uuids.length == 0) {
      ui.notifications.error(
        `Please select or target a token to toggle ${effectName}`
      );
      return;
    }

    let effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} was not found`);
      return;
    }

    if (this.hasNestedEffects(effect)) {
      effect = await this._getNestedEffectSelection(effect);
      if (!effect) return; // dialog closed without selecting one
    }

    return this._socket.executeAsGM('toggleEffect', effect.name, {
      overlay,
      uuids,
    });
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  hasEffectApplied(effectName, uuid) {
    return this._effectHandler.hasEffectApplied(effectName, uuid);
  }

  /**
   * Removes the effect from the provided actor UUID as the GM via sockets
   *
   * @param {object} params - the effect params
   * @param {string} params.effectName - the name of the effect to remove
   * @param {string} params.uuid - the UUID of the actor to remove the effect from
   * @param {string | undefined} params.origin - only removes the effect if the origin
   * matches. If undefined, removes any effect with the matching name
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async removeEffect({ effectName, uuid, origin }) {
    let effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} could not be found`);
      return;
    }

    const actor = this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (this.hasNestedEffects(effect)) {
      effect = await this._getNestedEffectSelection(effect);
      if (!effect) return; // dialog closed without selecting one
    }

    return this._socket.executeAsGM('removeEffect', {
      effectName: effect.name,
      uuid,
      origin,
    });
  }

  /**
   * Adds the effect to the provided actor UUID as the GM via sockets
   *
   * @param {object} params - the params for adding an effect
   * @param {string} params.effectName - the name of the effect to add
   * @param {string} params.uuid - the UUID of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   * @param {object} params.metadata - additional contextual data for the application of the effect (likely provided by midi-qol)
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async addEffect({ effectName, uuid, origin, overlay, metadata }) {
    let effect = this.findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} could not be found`);
      return;
    }

    const actor = this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (this.hasNestedEffects(effect) > 0) {
      effect = await this._getNestedEffectSelection(effect);
      if (!effect) return; // dialog closed without selecting one
    }

    return this._socket.executeAsGM('addEffect', {
      effect: effect.toObject(),
      uuid,
      origin,
      overlay,
    });
  }

  /**
   * Adds the defined effect to the provided actor UUID as the GM via sockets
   *
   * @param {object} params - the params for adding an effect
   * @param {object} params.effectData - the object containing all of the relevant effect data
   * @param {string} params.uuid - the UUID of the actor to add the effect to
   * @param {string} params.origin - the origin of the effect
   * @param {boolean} params.overlay - if the effect is an overlay or not
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async addEffectWith({ effectData, uuid, origin, overlay }) {
    let effect = this._effectHelpers.createActiveEffect({
      ...effectData,
      origin,
    });
    const actor = this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (this.hasNestedEffects(effect)) {
      effect = await this._getNestedEffectSelection(effect);
      if (!effect) return; // dialog closed without selecting one
    }

    return this._socket.executeAsGM('addEffect', {
      effect: effect.toObject(),
      uuid,
      origin,
      overlay,
    });
  }

  /**
   * Creates new custom effects with the provided active effect data.
   *
   * @param {object} params - the params for adding an effect
   * @param {ActiveEffect[]} params.activeEffects - array of active effects to add
   * @returns {Promise} a promise that resolves when the active effects have finished being added
   */
  createNewCustomEffectsWith({ activeEffects }) {
    return this._customEffectsHandler.createNewCustomEffectsWith({
      activeEffects,
    });
  }

  /**
   * Checks if the given effect has nested effects
   *
   * @param {ActiveEffect} effect - the active effect to check the nested effets on
   * @returns
   */
  hasNestedEffects(effect) {
    const nestedEffects =
      effect.getFlag(Constants.MODULE_ID, Constants.FLAGS.NESTED_EFFECTS) ?? [];

    return nestedEffects.length > 0;
  }

  async _getNestedEffectSelection(effect) {
    const nestedEffectNames =
      effect.getFlag(Constants.MODULE_ID, Constants.FLAGS.NESTED_EFFECTS) ?? [];
    const nestedEffects = nestedEffectNames
      .map((nestedEffect) =>
        game.dfreds.effectInterface.findEffectByName(nestedEffect)
      )
      .filter((effect) => effect !== undefined);

    const content = await renderTemplate(
      'modules/dfreds-convenient-effects/templates/nested-effects-dialog.hbs',
      { parentEffect: effect, nestedEffects }
    );
    const choice = await Dialog.prompt(
      {
        title: effect.name,
        content: content,
        label: 'Select Effect',
        callback: (html) => {
          const htmlChoice = html.find('select[name="effect-choice"]').val();
          return htmlChoice;
        },
        rejectClose: false,
      },
      { width: 300 }
    );

    return nestedEffects.find((nestedEffect) => nestedEffect.name == choice);
  }

  /**
   * Adds the given effect name to the status effects. Note that Foundry
   * needs to be refreshed to reflect the changes on the token HUD.
   *
   * @param {string} effectName - the effect name to add as a status effect
   */
  async addStatusEffect(effectName) {
    await this._settings.addStatusEffect(effectName);
  }

  /**
   * Removes the given effect name from the status effects. Note that Foundry
   * needs to be refreshed to reflect the changes on the token HUD.
   *
   * @param {string} effectName - the effect name to remove as a status effect
   */
  async removeStatusEffect(effectName) {
    await this._settings.removeStatusEffect(effectName);
  }
}
