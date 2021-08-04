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
      case "bear's endurance":
        await this._addBearsEnduranceEffects(actor);
        break;
      case "heroes' feast":
        await this._addHeroesFeastEffects(actor);
        break;
    }
  }

  async _addAidEffects(actor) {
    await actor.data.update({
      'data.attributes.hp.max': actor.data.data.attributes.hp.max + 5,
      'data.attributes.hp.value': actor.data.data.attributes.hp.value + 5,
    });
  }

  async _addBearsEnduranceEffects(actor) {
    const roll = new Roll('2d6');
    const evaluation = await roll.evaluate({ async: true });

    await actor.data.update({
      'data.attributes.hp.temp': evaluation.total,
    });
  }

  async _addHeroesFeastEffects(actor) {
    const roll = new Roll('2d10');
    const evaluation = await roll.evaluate({ async: true });

    await actor.data.update({
      'data.attributes.hp.max':
        actor.data.data.attributes.hp.max + evaluation.total,
      'data.attributes.hp.value':
        actor.data.data.attributes.hp.value + evaluation.total,
      flags: foundry.utils.mergeObject(actor.data.flags, {
        convenientEffects: {
          heroesFeastRoll: evaluation.total,
        },
      }),
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
      case "bear's endurance":
        await this._removeBearsEnduranceEffects(actor);
        break;
      case "heroes' feast":
        await this._removeHeroesFeastEffects(actor);
        break;
    }
  }

  async _removeAidEffects(actor) {
    const newMax = actor.data.data.attributes.hp.max - 5;
    const value = actor.data.data.attributes.hp.value;

    await actor.data.update({
      'data.attributes.hp.max': newMax,
    });

    if (value > newMax) {
      await actor.data.update({
        'data.attributes.hp.value': newMax,
      });
    }
  }

  async _removeBearsEnduranceEffects(actor) {
    await actor.data.update({
      'data.attributes.hp.temp': 0,
    });
  }

  async _removeHeroesFeastEffects(actor) {
    const total = actor.data.flags.convenientEffects.heroesFeastRoll;

    const newMax = actor.data.data.attributes.hp.max - total;
    const value = actor.data.data.attributes.hp.value;

    await actor.data.update({
      'data.attributes.hp.max': newMax,
    });

    if (value > newMax) {
      await actor.data.update({
        'data.attributes.hp.value': newMax,
      });
    }
  }
}
