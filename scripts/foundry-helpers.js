import Settings from './settings.js';

export default class FoundryHelpers {
  constructor() {
    this._settings = new Settings();
  }

  getActorUuidsFromCanvas() {
    if (canvas.tokens.controlled.length == 0 && game.user.targets.size == 0) {
      return [];
    }

    if (this._settings.prioritizeTargets && game.user.targets.size !== 0) {
      return Array.from(game.user.targets).map((token) => token.actor.uuid);
    } else {
      return canvas.tokens.controlled.map((token) => token.actor.uuid);
    }
  }

  async getActorByUuid(uuid) {
    const actorToken = await fromUuid(uuid);
    const actor = actorToken?.actor ? actorToken?.actor : actorToken;
    return actor;
  }
}
