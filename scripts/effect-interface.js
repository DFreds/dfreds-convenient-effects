import ActorUpdater from './effects/actor-updater.js';
import EffectHandler from './effects/effect-handler.js';
import Effect from './effects/effect.js';
import FoundryHelpers from './foundry-helpers.js';

/**
 * Interface for working with effects and executing them as a GM via sockets
 */
export default class EffectInterface {
  constructor() {
    this._actorUpdater = new ActorUpdater();
    this._effectHandler = new EffectHandler();
    this._foundryHelpers = new FoundryHelpers();
  }

  /**
   * Initializes the socket and registers the socket functions
   */
  initialize() {
    this._socket = socketlib.registerModule('dfreds-convenient-effects');
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
    this._socket.register(
      'addActorDataChanges',
      this._actorUpdater.addActorDataChanges.bind(this._actorUpdater)
    );
    this._socket.register(
      'removeActorDataChanges',
      this._actorUpdater.removeActorDataChanges.bind(this._actorUpdater)
    );
  }

  /**
   * Toggles the effect on the provided actor UUIDS as the GM via sockets
   *
   * @param {string} effectName - the name of the effect to toggle
   * @param  {...string} uuids - the UUIDs of the actors to toggle the effect on
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async toggleEffect(effectName, ...uuids) {
    if (uuids.length == 0) {
      uuids = this._foundryHelpers.getActorUuidsFromCanvas();
    }

    if (uuids.length == 0) {
      ui.notifications.error(
        `Please select or target a token to toggle ${effectName}`
      );
      return;
    }

    let effect = this._effectHandler.findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} was not found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._effectHandler.getNestedEffectSelection(effect);
      if (!effect) return; // dialog closed without selecting one
    }

    return this._socket.executeAsGM('toggleEffect', effect.name, ...uuids);
  }

  /**
   * Removes the effect from the provided actor UUID as the GM via sockets
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the UUID of the actor to remove the effect from
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async removeEffect(effectName, uuid) {
    let effect = this._effectHandler.findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} could not be found`);
      return;
    }

    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._effectHandler.getNestedEffectSelection(effect);
    }

    return this._socket.executeAsGM('removeEffect', effect.name, uuid);
  }

  /**
   * Adds the effect to the provided actor UUID as the GM via sockets
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the UUID of the actor to add the effect to
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  async addEffect(effectName, uuid, origin) {
    let effect = this._effectHandler.findEffectByName(effectName);

    if (!effect) {
      ui.notifications.error(`Effect ${effectName} could not be found`);
      return;
    }

    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (!actor) {
      ui.notifications.error(`Actor ${uuid} could not be found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._effectHandler.getNestedEffectSelection(effect);
    }

    return this._socket.executeAsGM('addEffect', effect.name, uuid, origin);
  }

  /**
   * Adds data changes to the provided actor UUID as the GM via sockets
   *
   * @param {string} effectName - the name of the effect that is adding actor data changes
   * @param {string} uuid - the UUID of the actor to add the data changes to
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  addActorDataChanges(effectName, uuid) {
    return this._socket.executeAsGM('addActorDataChanges', effectName, uuid);
  }

  /**
   * Removes data changes from the provided actor UUID as the GM via sockets
   *
   * @param {string} effectName - the name of the effect that is removing actor data changes
   * @param {string} uuid - the UUID of the actor to remove the data changes from
   * @returns {Promise} a promise that resolves when the GM socket function completes
   */
  removeActorDataChanges(effectName, uuid) {
    return this._socket.executeAsGM('removeActorDataChanges', effectName, uuid);
  }
}
