import FoundryHelpers from '../foundry-helpers.js';

/**
 * Handles updating actor data for certain effects
 */
export default class ActorUpdater {
  constructor() {
    this._foundryHelpers = new FoundryHelpers();
  }

  /**
   * Adds data changes to the provided actor UUID
   *
   * @param {string} effectName - the name of the effect that is adding actor data changes
   * @param {string} uuid - the UUID of the actor to add the data changes to
   */
  async addActorDataChanges(effectName, uuid) {
    const actor = this._foundryHelpers.getActorByUuid(uuid);

    switch (effectName.toLowerCase()) {
      case 'aid':
        await this._addAidEffects(actor);
        break;
      case "bear's endurance":
        await this._addBearsEnduranceEffects(actor);
        break;
      case 'divine word':
        await this._addDivineWordEffects(actor);
        break;
      case 'false life':
        await this._addFalseLifeEffects(actor);
        break;
      case "heroes' feast":
        await this._addHeroesFeastEffects(actor);
        break;
    }
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

  async _addDivineWordEffects(actor) {
    if (actor.data.data.attributes.hp.value <= 20) {
      await actor.update({
        'data.attributes.hp.value': 0,
      });
    }
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
      flags: {
        convenientEffects: {
          heroesFeastRoll: evaluation.total,
        },
      },
    });
  }

  /**
   * Removes data changes from the provided actor UUID
   *
   * @param {string} effectName - the name of the effect that is removing actor data changes
   * @param {string} uuid - the UUID of the actor to remove the data changes from
   */
  async removeActorDataChanges(effectName, uuid) {
    const actor = this._foundryHelpers.getActorByUuid(uuid);

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
