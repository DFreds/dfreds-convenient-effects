import { ActiveEffectSource } from "types/foundry/common/documents/module.js";
import { findEffectFolderItems, findEffectsForItem } from "../utils/finds.ts";
import { Flags } from "../utils/flags.ts";

async function addNestedEffectSelectionConfig(
    activeEffectConfig: ActiveEffectConfig<any>,
    html: JQuery,
): Promise<void> {
    const activeEffect = activeEffectConfig.document as ActiveEffect<any>;

    let chosenEffects = (Flags.getNestedEffects(activeEffect) ?? []).map(
        (effect) => {
            return effect;
        },
    );

    const folders = findEffectFolderItems();

    // TODO filter current nested effects out?
    // TODO effect interface find all?

    const availableEffects = folders
        .flatMap((folder) => {
            return findEffectsForItem(folder.id);
        })
        .map((effect) => {
            return {
                id: Flags.getCeEffectId(effect),
                name: effect.name,
            };
        });

    const nestedEffectSelectionConfig = await renderTemplate(
        "modules/dfreds-convenient-effects/templates/nested-effect-selection-config.hbs",
        {
            availableEffects,
            chosenEffects,
        },
    );

    const detailsSection = html.find('section[data-tab="details"]');

    detailsSection.append("<hr>");
    detailsSection.append(nestedEffectSelectionConfig);

    detailsSection
        .find("#nested-effects-config button")
        .on("click", async (event) => {
            event.preventDefault();
            const action = event.currentTarget.dataset.action;

            if (action === "nested-effect-add") {
                const effectId = html
                    .find("#nested-effects-config .nested-effects-selector")
                    .val() as string;

                const effect = game.dfreds.effectInterface.findEffect({
                    effectId,
                });

                if (!effect) return;

                chosenEffects.push(effect.toObject());
                chosenEffects = removeDuplicates(chosenEffects);

                await activeEffectConfig.submit({ preventClose: true });
                await Flags.setNestedEffects(activeEffect, chosenEffects);
            } else if (action === "nested-effect-remove") {
                const ceEffectId = event.currentTarget.dataset.ceEffectId;
                const nestedEffects = chosenEffects.filter(
                    (effect) => Flags.getCeEffectId(effect) !== ceEffectId,
                );

                await activeEffectConfig.submit({ preventClose: true });
                await Flags.setNestedEffects(activeEffect, nestedEffects);
            }
        });
}

function removeDuplicates(
    effects: PreCreate<ActiveEffectSource>[],
): PreCreate<ActiveEffectSource>[] {
    const uniqueIds = new Set<string>();
    return effects.filter((effect) => {
        const ceEffectId = Flags.getCeEffectId(effect);

        if (!ceEffectId) return false;

        if (uniqueIds.has(ceEffectId)) {
            return false;
        } else {
            uniqueIds.add(ceEffectId);
            return true;
        }
    });
}

export { addNestedEffectSelectionConfig };
