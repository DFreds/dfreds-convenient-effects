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
  }

  get socket() {
    return this._socket;
  }
}

const instance = new Socket();

export default instance;
