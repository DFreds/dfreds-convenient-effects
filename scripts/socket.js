class Socket {
  initialize() {
    this._socket = socketlib.registerModule('dfreds-convenient-effects');
    this._socket.register(
      'addEffectAsGM',
      game.dfreds.effectHandler.addEffectAsGM.bind(game.dfreds.effectHandler)
    );
    this._socket.register(
      'removeEffectAsGM',
      game.dfreds.effectHandler.removeEffectAsGM.bind(game.dfreds.effectHandler)
    );
    this._socket.register(
      'addActorDataChangesAsGM',
      game.dfreds.actorUpdater.addActorDataChangesAsGM.bind(
        game.dfreds.actorUpdater
      )
    );
    this._socket.register(
      'removeActorDataChangesAsGM',
      game.dfreds.actorUpdater.removeActorDataChangesAsGM.bind(
        game.dfreds.actorUpdater
      )
    );
  }

  get socket() {
    return this._socket;
  }
}

const instance = new Socket();

export default instance;
