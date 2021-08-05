import Settings from './settings.js';

export default class ChatHandler {
  constructor() {
    this._settings = new Settings();
  }

  /**
   * Creates a chat message when a convenient effect is applied or removed. This
   * only creates the message if the setting is enabled.
   *
   * @param {string} effectName - the name of the effect
   * @param {string} reason - the reason for the chat message
   * @param {Actor5e} actor - the actor the effect change occurred to
   */
  async createChatForEffect({ effectName, reason, actor }) {
    // Handle if it set to None
    if (this._settings.chatMessagePermission > CONST.USER_ROLES.GAMEMASTER)
      return;

    const effect = game.dfreds.effects.all.find(
      (effect) => effect.name == effectName
    );

    if (!effect) return;

    const actorName = actor.token ? actor.token.name : actor.name;

    await ChatMessage.create({
      user: game.userId,
      whisper:
        this._settings.chatMessagePermission === CONST.USER_ROLES.PLAYER
          ? undefined
          : game.users
              .filter(
                (user) => user.role >= this._settings.chatMessagePermission
              )
              .map((user) => user.id),
      content: `<p><strong>${effect.name}</strong> - ${reason} ${actorName}</p>
         <p>${effect.description}</p>
         `,
    });
  }
}
