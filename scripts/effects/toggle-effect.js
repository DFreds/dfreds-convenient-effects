import EffectHandler from './effect-handler.js';

/**
 * Toggles an effect on or off by name
 *
 * @param {string} name - name of the effect to toggle
 */
export default async function toggleEffect(name) {
  ui.notifications.warn(
    'This is deprecated and will be removed in the future. Re-import the convenient effects macro to see how to fix this issue.'
  );
  const effectHandler = new EffectHandler();
  await effectHandler.toggleEffect(name);
}
