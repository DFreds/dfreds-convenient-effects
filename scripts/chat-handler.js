import Settings from './settings.js';

/**
 * Handles creating chats for applied and removed effects
 */
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
   * @param {boolean} isCreateActiveEffect - true if this chat occurs on creating an active effect
   */
  async createChatForEffect({
    effectName,
    reason,
    actor,
    isCreateActiveEffect,
  }) {
    // Fixes issue where chat messages were being created for the custom effects being deleted
    if (this._settings.customEffectsItemId === actor.id) return;

    // Handle if it set to None
    if (this._settings.chatMessagePermission > CONST.USER_ROLES.GAMEMASTER)
      return;

    const effect = game.dfreds.effectInterface.findEffectByName(effectName);

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
      content: this._getChatContent({
        effect,
        reason,
        actorName,
        isCreateActiveEffect,
      }),
    });
  }

  _getChatContent({ effect, reason, actorName, isCreateActiveEffect }) {
    let message = `<p><strong>${effect.name}</strong> - ${reason} ${actorName}</p>`;
    if (
      this._settings.showChatMessageEffectDescription === 'onAddOrRemove' ||
      (this._settings.showChatMessageEffectDescription === 'onAddOnly' &&
        isCreateActiveEffect)
    ) {
      message += `<p>${this._getDescription(effect)}</p>`;
    }

    return message;
  }

  _getDescription(effect) {
    if (effect.description) {
      return effect.description;
    } else if (effect.flags.convenientDescription) {
      return effect.flags.convenientDescription;
    } else {
      return 'Applies custom effects';
    }
  }
}
