import DynamicEffectsAdder from './dynamic-effects-adder.js';

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
  if (controlledTokens.length === 0) {
    ui.notifications.error('Please select a token');
    return;
  }

  for (const actor of controlledTokens.map((token) => token.actor)) {
    const effectToRemove = actor.data.effects.find(
      (effect) =>
        effect.data.label == 'Convenient Effect: ' + toggledEffect.name
    );

    if (effectToRemove) {
      await actor.deleteEmbeddedDocuments('ActiveEffect', [effectToRemove.id]);
    } else {
      if (toggledEffect.isDynamic) {
        const dynamicEffectsAdder = new DynamicEffectsAdder();
        await dynamicEffectsAdder.addDynamicEffects(toggledEffect, actor);
      }

      const activeEffectData = toggledEffect.convertToActiveEffectData();
      await actor.createEmbeddedDocuments('ActiveEffect', [activeEffectData]);
    }
  }
}
