import socketInstance from '../socket.js';

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
  addActorDataChanges(effectName, uuid) {
    return socketInstance.socket.executeAsGM(
      'addActorDataChangesAsGM',
      effectName,
      uuid
    );
  }

  async addActorDataChangesAsGM(effectName, uuid) {
    const actor = await this._getActorByUuid(uuid);

    switch (effectName.toLowerCase()) {
      case 'aid':
        await this._addAidEffects(actor);
        break;
      case "bear's endurance":
        await this._addBearsEnduranceEffects(actor);
        break;
      case 'false life':
        await this._addFalseLifeEffects(actor);
        break;
      case "heroes' feast":
        await this._addHeroesFeastEffects(actor);
        break;
    }
  }

  async _getActorByUuid(uuid) {
    const actorToken = await fromUuid(uuid);
    const actor = actorToken?.actor ? actorToken?.actor : actorToken;
    return actor;
  }

  async _addAidEffects(actor) {
    await actor.update({
      'data.attributes.hp.tempmax': actor.data.data.attributes.hp.tempmax + 5,
      'data.attributes.hp.value': actor.data.data.attributes.hp.value + 5,
    });
  }

  async _addBearsEnduranceEffects(actor) {
    const roll = new Roll('2d6');
    const evaluation = await roll.evaluate({ async: true });

    await actor.update({
      'data.attributes.hp.temp': evaluation.total,
    });
  }

  async _addFalseLifeEffects(actor) {
    const roll = new Roll('1d4 + 4');
    const evaluation = await roll.evaluate({ async: true });

    await actor.update({
      'data.attributes.hp.temp': evaluation.total,
    });
  }

  async _addHeroesFeastEffects(actor) {
    const roll = new Roll('2d10');
    const evaluation = await roll.evaluate({ async: true });

    await actor.update({
      'data.attributes.hp.tempmax':
        actor.data.data.attributes.hp.tempmax + evaluation.total,
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
   * @param {Actor5e} uuid - the effected actor
   */
  removeActorDataChanges(effectName, uuid) {
    return socketInstance.socket.executeAsGM(
      'removeActorDataChangesAsGM',
      effectName,
      uuid
    );
  }

  async removeActorDataChangesAsGM(effectName, uuid) {
    const actor = await this._getActorByUuid(uuid);

    switch (effectName.toLowerCase()) {
      case 'aid':
        await this._removeAidEffects(actor);
        break;
      case "bear's endurance":
        await this._removeBearsEnduranceEffects(actor);
        break;
      case 'false life':
        await this._removeFalseLifeEffects(actor);
        break;
      case "heroes' feast":
        await this._removeHeroesFeastEffects(actor);
        break;
    }
  }

  async _removeAidEffects(actor) {
    const newTempMax = actor.data.data.attributes.hp.tempmax - 5;
    const value = actor.data.data.attributes.hp.value;
    const max = actor.data.data.attributes.hp.max;

    await actor.update({
      'data.attributes.hp.tempmax': newTempMax,
    });

    if (value > max + newTempMax) {
      await actor.update({
        'data.attributes.hp.value': max + newTempMax,
      });
    }
  }

  async _removeBearsEnduranceEffects(actor) {
    await actor.update({
      'data.attributes.hp.temp': 0,
    });
  }

  async _removeFalseLifeEffects(actor) {
    await actor.update({
      'data.attributes.hp.temp': 0,
    });
  }

  async _removeHeroesFeastEffects(actor) {
    const total = actor.data.flags.convenientEffects.heroesFeastRoll;

    const newTempMax = actor.data.data.attributes.hp.tempmax - total;
    const value = actor.data.data.attributes.hp.value;
    const max = actor.data.data.attributes.hp.max;

    await actor.update({
      'data.attributes.hp.tempmax': newTempMax,
    });

    if (value > max + newTempMax) {
      await actor.update({
        'data.attributes.hp.value': max + newTempMax,
      });
    }
  }
}
