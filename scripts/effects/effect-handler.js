import DynamicEffectsAdder from './dynamic-effects-adder.js';
import Settings from '../settings.js';
import log from '../logger.js';

/**
 * Handles toggling on and off effects on actors
 */
export default class EffectHandler {
  constructor() {
    this._dynamicEffectsAdder = new DynamicEffectsAdder();
    this._settings = new Settings();
  }

  /**
   * Toggles an effect on or off by name
   *
   * @param {string} name - name of the effect to toggle
   */
  async toggleEffect(name) {
    const actorsToEffect = this._determineActorsToEffect();
    if (!actorsToEffect) return;

    let effect = game.dfreds.effects.all.find((effect) => effect.name == name);

    if (!effect) {
      ui.notifications.error(`Effect ${name} was not found`);
      return;
    }

    if (effect.nestedEffects.length > 0) {
      effect = await this._getNestedEffectSelection(effect);
    }

    for (const actor of actorsToEffect) {
      if (this._hasEffectApplied(effect, actor)) {
        await this._removeEffect(effect, actor);
      } else {
        await this._addEffect(effect, actor);
      }
    }
  }

  /**
   * Creates a chat message when a convenient effect is applied or removed. This
   * only creates the message if the setting is enabled.
   *
   * @param {string} effectName - the name of the effect
   * @param {string} reason - the reason for the chat message
   * @param {Actor5e} actor - the actor the effect change occurred to
   */
  async createChatForEffect(effectName, reason, actor) {
    if (!this._settings.createChatMessage) return;

    const effect = game.dfreds.effects.all.find(
      (effect) => effect.name == effectName
    );

    if (!effect) return;

    const actorName = actor.token ? actor.token.name : actor.name;

    await ChatMessage.create({
      user: game.userId,
      content: `<p><strong>${effect.name}</strong> - ${reason} ${actorName}</p>
         <p>${effect.description}</p>
         `,
    });
  }

  _determineActorsToEffect() {
    if (canvas.tokens.controlled.length == 0 && game.user.targets.size == 0) {
      ui.notifications.error(
        'Please select or target a token to apply an effect'
      );
      return;
    }

    if (game.user.targets.size === 0) {
      return canvas.tokens.controlled.map((token) => token.actor);
    } else {
      return Array.from(game.user.targets).map((token) => token.actor);
    }
  }

  async _getNestedEffectSelection(effect) {
    const content = await renderTemplate(
      'modules/dfreds-convenient-effects/templates/nested-effects-dialog.html',
      { parentEffect: effect }
    );
    const choice = await Dialog.prompt(
      {
        title: effect.name,
        content: content,
        label: 'Select Effect',
        callback: (html) => {
          const htmlChoice = html.find('select[name="effect-choice"]').val();
          return htmlChoice;
        },
      },
      { width: 300 }
    );

    return effect.nestedEffects.find(
      (nestedEffect) => nestedEffect.name == choice
    );
  }

  _hasEffectApplied(effect, actor) {
    return actor.data.effects.some(
      (activeEffect) =>
        activeEffect.data.label == `Convenient Effect: ${effect.name}`
    );
  }

  async _removeEffect(effect, actor) {
    const effectToRemove = actor.data.effects.find(
      (activeEffect) =>
        activeEffect.data.label == `Convenient Effect: ${effect.name}`
    );
    await actor.deleteEmbeddedDocuments('ActiveEffect', [effectToRemove.id]);
    log(`Removed effect ${effect.name}`);
  }

  async _addEffect(effect, actor) {
    if (effect.isDynamic) {
      await this._dynamicEffectsAdder.addDynamicEffects(effect, actor);
    }

    if (this._settings.integrateWithAtl && effect.atlChanges.length > 0) {
      this._addAtlChangesToEffect(effect);
    }

    const activeEffectData = effect.convertToActiveEffectData();
    await actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);

    log(`Added effect ${effect.name}`);
  }

  _addAtlChangesToEffect(effect) {
    effect.changes.push(...effect.atlChanges);
  }
}
