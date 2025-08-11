import { Flags } from "../utils/flags.ts";
import { notEmpty } from "../utils/types.ts";
import { getApi } from "../utils/gets.ts";
import { ActiveEffectSource } from "@common/documents/active-effect.mjs";

const { DialogV2 } = foundry.applications.api;
const { renderTemplate } = foundry.applications.handlebars;

async function getNestedEffectSelection(
    effectData: PreCreate<ActiveEffectSource>,
): Promise<PreCreate<ActiveEffectSource> | undefined> {
    const nestedEffectIds = Flags.getNestedEffectIds(effectData) ?? [];
    const nestedEffects = nestedEffectIds
        .map((id) => {
            return getApi().findEffect({ effectId: id })?.toObject();
        })
        .filter(notEmpty);

    const content = await renderTemplate(
        "modules/dfreds-convenient-effects/templates/nested-effects-dialog.hbs",
        {
            parentEffect: effectData,
            nestedEffects,
            default: nestedEffects[0].name,
        },
    );

    const choice = (await DialogV2.prompt({
        id: "nested-effect-selection-dialog",
        window: {
            title: effectData.name,
            icon: "fa-solid fa-trees",
        },
        position: {
            width: 480,
        },
        close: () => {
            return null;
        },
        content,
        ok: {
            action: "ok",
            label: "ConvenientEffects.SelectEffect",
            icon: "fa-solid fa-check",
            callback: async (_event, _button, dialog) => {
                const htmlChoice = $(dialog.element)
                    .find('select[name="effect-choice"]')
                    .val();
                return htmlChoice;
            },
            default: true,
        },
    })) as string | undefined;

    return nestedEffects.find((nestedEffect) => nestedEffect.name === choice);
}

export { getNestedEffectSelection };
