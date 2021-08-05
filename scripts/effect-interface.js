import ActorUpdater from './effects/actor-updater.js';
import EffectHandler from './effects/effect-handler.js';
import FoundryHelpers from './foundry-helpers.js';

export default class EffectInterface {
  constructor() {
    this._actorUpdater = new ActorUpdater();
    this._effectHandler = new EffectHandler();
    this._foundryHelpers = new FoundryHelpers();
  }

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
    }

    return this._socket.executeAsGM('toggleEffect', effect.name, ...uuids);
  }

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

  addActorDataChanges(effectName, uuid) {
    return this._socket.executeAsGM('addActorDataChanges', effectName, uuid);
  }

  removeActorDataChanges(effectName, uuid) {
    return this._socket.executeAsGM('removeActorDataChanges', effectName, uuid);
  }
}
