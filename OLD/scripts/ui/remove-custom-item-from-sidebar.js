import Settings from '../settings.js';

export function removeCustomItemFromSidebar(directory) {
  if (!(directory instanceof ItemDirectory)) return;

  const settings = new Settings();
  const customEffectsItemId = settings.customEffectsItemId;

  if (!customEffectsItemId) return;

  const html = directory.element;
  const li = html.find(`li[data-document-id="${customEffectsItemId}"]`);
  li.remove();
}
