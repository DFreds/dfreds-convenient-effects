import Constants from '../constants.js';

export async function addDescriptionToEffectConfig(activeEffectConfig, $html) {
  const descriptionTemplate =
    'modules/dfreds-convenient-effects/templates/effect-description-config.hbs';

  const description = activeEffectConfig.object.getFlag(
    Constants.MODULE_ID,
    Constants.FLAGS.DESCRIPTION
  );

  const descriptionHtml = await renderTemplate(descriptionTemplate, {
    description,
  });

  const labelFormGroup = $html
    .find('section[data-tab="details"] .form-group')
    .first();

  labelFormGroup.after(descriptionHtml);
}
