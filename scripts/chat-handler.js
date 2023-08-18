import EffectHelpers from './effects/effect-helpers.js';
import Settings from './settings.js';

/**
 * Handles creating chats for applied and removed effects
 */
export default class ChatHandler {
  constructor() {
    this._effectHelpers = new EffectHelpers();
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
      whisper: this._getChatTargets(actor),
      content: this._getChatContent({
        effect,
        reason,
        actorName,
        isCreateActiveEffect,
      }),
    });
  }

  _getChatContent({ effect, reason, actorName, isCreateActiveEffect }) {
    let message = ``<div class="convenienteffects-chat-header"><strong>${effect.name}</strong> - ${reason} ${actorName}</div>`;
    if (
      this._settings.showChatMessageEffectDescription === 'onAddOrRemove' ||
      (this._settings.showChatMessageEffectDescription === 'onAddOnly' &&
        isCreateActiveEffect)
    ) {
      let description = this._getDescription(effect);
      description = description.replace('<p>','').replace('</p>','');    //not sure where that <p> in the description comes from. I guess Foundry.
      message += `<hr class="convenienteffects-chat-hr"><div class="convenienteffects-chat-description">${description}</div>`;
    }

    return message;
  }

  _getChatTargets(actor) {
    if (this._settings.chatMessagePermission === CONST.USER_ROLES.PLAYER) {
      return null;
    }

    return game.users
      .filter((user) => {
        const hasRole = user.role >= this._settings.chatMessagePermission;
        const ownsActor =
          !!user?.character?.uuid && user.character.uuid === actor.uuid;

        if (this._settings.sendChatToActorOwner) {
          return hasRole || ownsActor;
        } else {
          return hasRole;
        }
      })
      .map((user) => user.id);
  }

  _getDescription(effect) {
    const description = this._effectHelpers.getDescription(effect);
    if (description) {
      return description;
    } else {
      return 'No description';
    }
  }
}
