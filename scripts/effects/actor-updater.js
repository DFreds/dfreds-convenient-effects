/**
 * Handles updating actor data for certain effects
 */
export default class ActorUpdater {
  /**
   * Adds actor data changes for specific effects
   *
   * @param {string} effectName - the effect name to handle
   * @param {Actor5e} actor - the effected actor
   */
  async addActorDataChanges(effectName, actor) {
    switch (effectName.toLowerCase()) {
      case 'aid':
        await this._addAidEffects(actor);
        break;
    }
  }

  async _addAidEffects(actor) {
    await actor.data.update({
      'data.attributes.hp.max': actor.data.data.attributes.hp.max + 5,
      'data.attributes.hp.value': actor.data.data.attributes.hp.value + 5,
    });
  }

  /**
   * Removes actor data changes for specific effects
   *
   * @param {string} effectName - the effect name to handle
   * @param {Actor5e} actor - the effected actor
   */
  async removeActorDataChanges(effectName, actor) {
    switch (effectName.toLowerCase()) {
      case 'aid':
        await this._removeAidEffects(actor);
        break;
    }
  }

  async _removeAidEffects(actor) {
    await actor.data.update({
      'data.attributes.hp.max': actor.data.data.attributes.hp.max - 5,
      'data.attributes.hp.value': actor.data.data.attributes.hp.value - 5,
    });
  }
}
