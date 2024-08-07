import { Flags } from "../utils/flags.ts";
import { findEffectFolderItems, findEffectsForItem } from "../utils/finds.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";

interface ConvenientEffectConfigData<
    TDocument extends ActiveEffect<Actor | Item | null>,
> extends ActiveEffectConfigData<TDocument> {
    chosenEffects?: PreCreate<ActiveEffectSource>[];
    availableEffects: {
        id?: string;
        name: string;
    }[];
}

class ConvenientEffectConfig<
    TDocument extends ActiveEffect<Actor | Item | null>,
> extends ActiveEffectConfig<TDocument> {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static init(app: any, html: any, _data: any): void {
        const openButton = $(
            `<a class="open-convenient-config" title="convenient-config"><i class="fas fa-sd-card"></i>"Convenient"</a>`,
        );
        openButton.click(async (_event) => {
            let Convenient = null;
            const activeEffect = await fromUuid(app.document.uuid);

            for (const key in app.document.apps) {
                const obj = app.document.apps[key];
                if (obj instanceof ConvenientEffectConfig) {
                    Convenient = obj;
                    break;
                }
            }
            if (!Convenient && activeEffect instanceof ActiveEffect)
                Convenient = new ConvenientEffectConfig(activeEffect, {});
            Convenient?.render(true);
        });

        html.closest(".app").find(".open-itemacro").remove();
        const titleElement = html.closest(".app").find(".window-title");
        openButton.insertAfter(titleElement);
    }

    static override get defaultOptions(): ActiveEffectConfigOptions {
        return foundry.utils.mergeObject(super.defaultOptions, {
            template:
                "modules/dfreds-convenient-effects/templates/convenient-effect-config.hbs",
            classes: ["sheet", "active-effect-sheet"],
            tabs: [
                {
                    navSelector: ".tabs",
                    contentSelector: "form",
                    initial: "details",
                },
            ],
        });
    }

    // @ts-expect-error what the fuck
    override async getData(
        options?: DocumentSheetOptions,
    ): Promise<ConvenientEffectConfigData<TDocument>> {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const context = await super.getData(options);

        const chosenEffects = Flags.getNestedEffects(this.document) ?? [];
        // TODO filter current nested effects out?
        // TODO effect interface find all?
        const folders = findEffectFolderItems();
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

        return foundry.utils.mergeObject(context, {
            chosenNestedEffects,
            availableEffects,
        });
    }

    override activateListeners(html: JQuery): void {
        html.find("#nested-effects-config button").on(
            "click",
            async (event) => {
                event.preventDefault();
                const action = event.currentTarget.dataset.action;

                if (action === "nested-effect-add") {
                    const effectId = html
                        .find("#nested-effects-config .nested-effects-selector")
                        .val() as string;

                    const effect = game.dfreds.effectInterface.findEffect({
                        effectId,
                    });
                    let chosenEffects =
                        Flags.getNestedEffects(this.document) ?? [];

                    if (!effect) return null;

                    chosenEffects.push(effect.toObject());
                    chosenEffects = this.#removeDuplicates(chosenEffects);

                    return this.submit({
                        preventClose: true,
                        updateData: {
                            [`flags.dfreds-convenient-effects.nestedEffects`]:
                                chosenEffects,
                        },
                    });
                    // await Flags.setNestedEffects(activeEffect, chosenEffects);
                } else if (action === "nested-effect-remove") {
                    // const ceEffectId = event.currentTarget.dataset.ceEffectId;
                    // const nestedEffects = chosenEffects.filter(
                    //     (effect) => Flags.getCeEffectId(effect) !== ceEffectId,
                    // );
                    // await activeEffectConfig.submit({ preventClose: true });
                    // await Flags.setNestedEffects(activeEffect, nestedEffects);
                }
                return null;
            },
        );
    }

    #removeDuplicates(
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
}

export { ConvenientEffectConfig };
