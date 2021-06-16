import DynamicEffectsAdder from './dynamic-effects-adder.js';
import log from '../logger.js';

/**
 * Toggles an effect on or off by name
 *
 * @param {string} name - name of the effect to toggle
 */
export default async function toggleEffect(name) {
  const controlledTokens = canvas.tokens.controlled;
  const toggledEffect = game.dfreds.effects.all.find(
    (effect) => effect.name == name
  );

  if (!toggledEffect) {
    ui.notifications.error(`Effect ${name} was not found`);
    return;
  }

  let actorsToEffect = [];
  if (game.user.targets.size === 0) {
    if (controlledTokens.length === 0) {
      ui.notifications.error('Please select a token');
      return;
    }
    actorsToEffect = controlledTokens.map((token) => token.actor);
  } else {
    actorsToEffect = Array.from(game.user.targets).map((token) => token.actor);
  }

  for (const actor of actorsToEffect) {
    const effectToRemove = actor.data.effects.find(
      (effect) =>
        effect.data.label == 'Convenient Effect: ' + toggledEffect.name
    );

    if (effectToRemove) {
      await actor.deleteEmbeddedDocuments('ActiveEffect', [effectToRemove.id]);
      log(`Removed effect ${toggledEffect.name}`);
    } else {
      if (toggledEffect.isDynamic) {
        const dynamicEffectsAdder = new DynamicEffectsAdder();
        await dynamicEffectsAdder.addDynamicEffects(toggledEffect, actor);
      }

      const activeEffectData = toggledEffect.convertToActiveEffectData();
      await actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);
      log(`Added effect ${toggledEffect.name}`);
    }
  }
}
