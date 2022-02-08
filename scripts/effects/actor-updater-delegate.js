import Constants from '../constants.js';
import FoundryHelpers from '../foundry-helpers.js';
import ActorUpdater5e from './dnd5e/actor-updater-5e.js';

/**
 * Handles updating actor data for certain effects by delegating to specific systems
 */
export default class ActorUpdaterDelegate {
  constructor() {
    this._foundryHelpers = new FoundryHelpers();
    this._handlers = {};
    this._initializeHandlers();
  }

  _initializeHandlers() {
    this._handlers[Constants.SYSTEM_IDS.DND_5E] = new ActorUpdater5e();
  }

  /**
   * Adds data changes to the provided actor UUID
   *
   * @param {string} effectName - the name of the effect that is adding actor data changes
   * @param {string} uuid - the UUID of the actor to add the data changes to
   * @returns {Promise} a promise that resolves when the update is complete
   */
  addActorDataChanges(effectName, uuid) {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.addActorDataChanges(effectName, uuid);
    }
  }

  /**
   * Removes data changes from the provided actor UUID
   *
   * @param {string} effectName - the name of the effect that is removing actor data changes
   * @param {string} uuid - the UUID of the actor to remove the data changes from
   * @returns {Promise} a promise that resolves when the update is complete
   */
  removeActorDataChanges(effectName, uuid) {
    const handler = this._handlers[this._foundryHelpers.systemId];

    if (handler) {
      return handler.removeActorDataChanges(effectName, uuid);
    }
  }
}
