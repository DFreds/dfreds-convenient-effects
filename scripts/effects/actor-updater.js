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
   * @param {string} origin - the origin of the effect
   */
  async addActorDataChanges(effectName, uuid, origin) {
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
      case 'invisibility':
        await this._addInvisibileEffect(uuid, origin);
        break;
      case 'greater invisibility':
        await this._addInvisibileEffect(uuid, origin);
        break;
    }
  }

  async _addAidEffects(actor) {
    await actor.update({
      'system.attributes.hp.tempmax': actor.system.attributes.hp.tempmax + 5,
      'system.attributes.hp.value': actor.system.attributes.hp.value + 5,
    });
  }

  async _addBearsEnduranceEffects(actor) {
    const roll = new Roll('2d6');
    const evaluation = await roll.evaluate({ async: true });

    await actor.update({
      'system.attributes.hp.temp': evaluation.total,
    });
  }

  async _addDivineWordEffects(actor) {
    if (actor.system.attributes.hp.value <= 20) {
      await actor.update({
        'system.attributes.hp.value': 0,
      });
    }
  }

  async _addFalseLifeEffects(actor) {
    const roll = new Roll('1d4 + 4');
    const evaluation = await roll.evaluate({ async: true });

    await actor.update({
      'system.attributes.hp.temp': evaluation.total,
    });
  }

  async _addHeroesFeastEffects(actor) {
    const roll = new Roll('2d10');
    const evaluation = await roll.evaluate({ async: true });

    await actor.update({
      'system.attributes.hp.tempmax':
        actor.system.attributes.hp.tempmax + evaluation.total,
      'system.attributes.hp.value':
        actor.system.attributes.hp.value + evaluation.total,
      flags: {
        convenientEffects: {
          heroesFeastRoll: evaluation.total,
        },
      },
    });
  }

  async _addInvisibileEffect(uuid, origin) {
    await game.dfreds.effectInterface.addEffect({
      effectName: 'Invisible',
      uuid,
      origin,
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
      case 'invisibility':
        await this._removeInvisibleEffect(uuid);
        break;
      case 'greater invisibility':
        await this._removeInvisibleEffect(uuid);
        break;
    }
  }

  async _removeAidEffects(actor) {
    const newTempMax = actor.system.attributes.hp.tempmax - 5;
    const value = actor.system.attributes.hp.value;
    const max = actor.system.attributes.hp.max;

    await actor.update({
      'system.attributes.hp.tempmax': newTempMax,
    });

    if (value > max + newTempMax) {
      await actor.update({
        'system.attributes.hp.value': max + newTempMax,
      });
    }
  }

  async _removeBearsEnduranceEffects(actor) {
    await actor.update({
      'system.attributes.hp.temp': 0,
    });
  }

  async _removeFalseLifeEffects(actor) {
    await actor.update({
      'system.attributes.hp.temp': 0,
    });
  }

  async _removeHeroesFeastEffects(actor) {
    const total = actor.flags.convenientEffects.heroesFeastRoll;

    const newTempMax = actor.system.attributes.hp.tempmax - total;
    const value = actor.system.attributes.hp.value;
    const max = actor.system.attributes.hp.max;

    await actor.update({
      'system.attributes.hp.tempmax': newTempMax,
    });

    if (value > max + newTempMax) {
      await actor.update({
        'system.attributes.hp.value': max + newTempMax,
      });
    }
  }

  async _removeInvisibleEffect(uuid) {
    await game.dfreds.effectInterface.removeEffect({
      effectName: 'Invisible',
      uuid,
    });
  }
}
