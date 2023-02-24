import Constants from '../constants.js';

export async function addNestedEffectsToEffectConfig(
  activeEffectConfig,
  $html
) {
  let currentEffects =
    activeEffectConfig.object.getFlag(
      Constants.MODULE_ID,
      Constants.FLAGS.NESTED_EFFECTS
    ) ?? [];
  const nestedEffectsTemplate =
    'modules/dfreds-convenient-effects/templates/nested-effects-config.hbs';

  const nestedEffectsHtml = await renderTemplate(nestedEffectsTemplate, {
    effects: game.dfreds.effects.all,
    chosenEffects: currentEffects,
  });

  const detailsSection = $html.find('section[data-tab="details"]');

  detailsSection.append('<hr>');
  detailsSection.append(nestedEffectsHtml);

  detailsSection
    .find('#nested-effects-config button')
    .on('click', async (event) => {
      event.preventDefault();
      const action = event.currentTarget.dataset.action;

      if (action === 'nested-effect-add') {
        const effectName = $html
          .find('#nested-effects-config .nested-effects-selector')
          .val();

        currentEffects.push(effectName);
        currentEffects = [...new Set(currentEffects)]; // remove duplicates

        await activeEffectConfig.submit({ preventClose: true });
        await activeEffectConfig.object.setFlag(
          Constants.MODULE_ID,
          Constants.FLAGS.NESTED_EFFECTS,
          currentEffects
        );
      } else if (action === 'nested-effect-remove') {
        const effectName = event.currentTarget.dataset.effectName;
        let nestedEffects = currentEffects.filter(
          (effect) => effect !== effectName
        );

        await activeEffectConfig.submit({ preventClose: true });
        await activeEffectConfig.object.setFlag(
          Constants.MODULE_ID,
          Constants.FLAGS.NESTED_EFFECTS,
          nestedEffects
        );
      }
    });
}
