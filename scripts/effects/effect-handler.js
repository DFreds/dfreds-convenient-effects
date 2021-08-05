import DynamicEffectsAdder from './dynamic-effects-adder.js';
import FoundryHelpers from '../foundry-helpers.js';
import Settings from '../settings.js';
import log from '../logger.js';

/**
 * Handles toggling on and off effects on actors
 */
export default class EffectHandler {
  constructor() {
    this._foundryHelpers = new FoundryHelpers();
    this._dynamicEffectsAdder = new DynamicEffectsAdder();
    this._settings = new Settings();
  }

  /**
   * Searches through the list of available effects and returns one matching the
   * effect name
   *
   * @param {string} effectName - the effect name to search for
   * @returns {Effect} the found effect
   */
  findEffectByName(effectName) {
    return game.dfreds.effects.all.find((effect) => effect.name == effectName);
  }

  /**
   * Prompts the user to select a nested effect from the choices available
   *
   * @param {Effect} effect - the parent effect
   * @returns {Effect} the chosen nested effect
   */
  async getNestedEffectSelection(effect) {
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

  /**
   * Toggles an effect on or off by name on an actor by UUID
   *
   * @param {string} effectName - name of the effect to toggle
   * @param {string[]} uuids - uuids to apply the effect to
   */
  async toggleEffect(effectName, ...uuids) {
    let effect = this.findEffectByName(effectName);

    for (const uuid of uuids) {
      if (await this.hasEffectApplied(effectName, uuid)) {
        await this.removeEffect(effect.name, uuid);
      } else {
        await this.addEffect(effect.name, uuid);
      }
    }
  }

  /**
   * Checks to see if any of the current active effects applied to the actor
   * with the given UUID match the effect name and are a convenient effect
   *
   * @param {string} effectName - the name of the effect to check
   * @param {string} uuid - the uuid of the actor to see if the effect is
   * applied to
   * @returns {boolean} true if the effect is applied, false otherwise
   */
  async hasEffectApplied(effectName, uuid) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    return actor?.data?.effects?.some(
      (activeEffect) =>
        activeEffect?.data?.flags?.isConvenient &&
        activeEffect?.data?.label == effectName
    );
  }

  /**
   * Removes the effect with the provided name from an actor matching the
   * provided UUID
   *
   * @param {string} effectName - the name of the effect to remove
   * @param {string} uuid - the uuid of the actor to remove the effect from
   */
  async removeEffect(effectName, uuid) {
    const actor = await this._foundryHelpers.getActorByUuid(uuid);
    const effectToRemove = actor.data.effects.find(
      (activeEffect) =>
        activeEffect?.data?.flags?.isConvenient &&
        activeEffect?.data?.label == effectName
    );

    if (effectToRemove) {
      await actor.deleteEmbeddedDocuments('ActiveEffect', [effectToRemove.id]);
      log(`Removed effect ${effectName} from ${actor.name} - ${actor.id}`);
    }
  }

  /**
   * Adds the effect with the provided name to an actor matching the provided
   * UUID
   *
   * @param {string} effectName - the name of the effect to add
   * @param {string} uuid - the uuid of the actor to add the effect to
   */
  async addEffect(effectName, uuid, origin) {
    let effect = this.findEffectByName(effectName);
    const actor = await this._foundryHelpers.getActorByUuid(uuid);

    if (effect.isDynamic) {
      await this._dynamicEffectsAdder.addDynamicEffects(effect, actor);
    }

    this._handleIntegrations(effect);

    const activeEffectData = effect.convertToActiveEffectData(origin);
    await actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);

    log(`Added effect ${effect.name} to ${actor.name} - ${actor.id}`);
  }

  _handleIntegrations(effect) {
    if (this._settings.integrateWithAtl && effect.atlChanges.length > 0) {
      this._addAtlChangesToEffect(effect);
    }

    if (
      this._settings.integrateWithTokenMagic &&
      effect.tokenMagicChanges.length > 0
    ) {
      this._addTokenMagicChangesToEffect(effect);
    }
  }

  _addAtlChangesToEffect(effect) {
    effect.changes.push(...effect.atlChanges);
  }

  _addTokenMagicChangesToEffect(effect) {
    effect.changes.push(...effect.tokenMagicChanges);
  }
}
