import Constants from '../constants.js';

export async function addDescriptionToEffectConfig(activeEffectConfig, $html) {
  const descriptionTemplate =
    'modules/dfreds-convenient-effects/templates/effect-description-config.hbs';

  const description =
    activeEffectConfig.object.getFlag(
      Constants.MODULE_ID,
      Constants.FLAGS.DESCRIPTION
    ) ??
    activeEffectConfig.object.convenientDescription ??
    'Applies effects';

  const descriptionHtml = await renderTemplate(descriptionTemplate, {
    description,
    moduleId: Constants.MODULE_ID,
    descriptionFlagKey: Constants.FLAGS.DESCRIPTION,
  });

  const labelFormGroup = $html
    .find('section[data-tab="details"] .form-group')
    .first();

  labelFormGroup.after(descriptionHtml);
}
