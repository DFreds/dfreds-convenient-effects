import ActorUpdater from './effects/actor-updater.js';
import EffectHandler from './effects/effect-handler.js';

export default class EffectInterface {
  constructor() {
    this._actorUpdater = new ActorUpdater();
    this._effectHandler = new EffectHandler();
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

  toggleEffect(effectName, ...uuids) {
    return this._socket.executeAsGM('toggleEffect', effectName, ...uuids);
  }

  removeEffect(effectName, uuid) {
    return this._socket.executeAsGM('removeEffect', effectName, uuid);
  }

  addEffect(effectName, uuid, origin) {
    return this._socket.executeAsGM('addEffect', effectName, uuid, origin);
  }

  addActorDataChanges(effectName, uuid) {
    return this._socket.executeAsGM('addActorDataChanges', effectName, uuid);
  }

  removeActorDataChanges(effectName, uuid) {
    return this._socket.executeAsGM('removeActorDataChanges', effectName, uuid);
  }
}
