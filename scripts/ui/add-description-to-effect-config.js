import EffectHelpers from '../effects/effect-helpers.js';

export async function addDescriptionToEffectConfig(activeEffectConfig, $html) {
  const descriptionTemplate =
    'modules/dfreds-convenient-effects/templates/effect-description-config.hbs';

  const effectHelpers = new EffectHelpers();
  const description = effectHelpers.getDescription(activeEffectConfig.object);

  const descriptionHtml = await renderTemplate(descriptionTemplate, {
    description,
  });

  const labelFormGroup = $html
    .find('section[data-tab="details"] .form-group')
    .first();

  labelFormGroup.after(descriptionHtml);
}
