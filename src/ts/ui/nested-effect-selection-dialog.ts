import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Flags } from "../utils/flags.ts";

async function getNestedEffectSelection(
    effectData: PreCreate<ActiveEffectSource>,
): Promise<PreCreate<ActiveEffectSource> | undefined> {
    const nestedEffects = Flags.getNestedEffects(effectData);

    const content = await renderTemplate(
        "modules/dfreds-convenient-effects/templates/nested-effects-dialog.hbs",
        { parentEffect: effectData, nestedEffects },
    );

    const choice = (await Dialog.wait(
        {
            title: effectData.name,
            content,
            default: "ok",
            close: () => {
                return null;
            },
            buttons: {
                ok: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Select Effect",
                    // @ts-expect-error Complains about returning, but works
                    callback: (html: JQuery) => {
                        const htmlChoice = html
                            .find('select[name="effect-choice"]')
                            .val();
                        return htmlChoice;
                    },
                },
            },
        },
        { width: 300 },
    )) as string | undefined;

    return nestedEffects.find((nestedEffect) => nestedEffect.name === choice);
}

export { getNestedEffectSelection };
