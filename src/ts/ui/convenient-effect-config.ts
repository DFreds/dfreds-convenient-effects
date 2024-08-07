import { Flags } from "../utils/flags.ts";
import { findEffectFolderItems, findEffectsForItem } from "../utils/finds.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";

interface MultiSelectData {
    id?: string;
    label?: string;
    selected: string;
}

interface ConvenientEffectConfigData
    extends DocumentSheetData<ActiveEffect<any>> {
    effect: ActiveEffect<any>;
    nestedEffects: MultiSelectData[];
    subEffects: MultiSelectData[];
    otherEffects: MultiSelectData[];
}

class ConvenientEffectConfig extends DocumentSheet<
    ActiveEffect<any>,
    DocumentSheetOptions
> {
    static init(
        app: ActiveEffectConfig<any>,
        html: JQuery,
        _data: unknown,
    ): void {
        if (app.document.isOwner || game.user.isGM) {
            const openButton = $(
                `<a class="open-convenient-config" title="convenient-config"><i class="fas fa-hand-sparkles"></i> ${game.i18n.localize("ConvenientEffects.ConfigLabel")}</a>`,
            );
            openButton.click(async (_event) => {
                let convenientConfig = null;
                const activeEffect = await fromUuid(app.document.uuid);

                for (const key in app.document.apps) {
                    const obj = app.document.apps[key];
                    if (obj instanceof ConvenientEffectConfig) {
                        convenientConfig = obj;
                        break;
                    }
                }
                if (!convenientConfig && activeEffect instanceof ActiveEffect)
                    convenientConfig = new ConvenientEffectConfig(
                        activeEffect,
                        {},
                    );
                convenientConfig?.render(true);
            });

            html.closest(".app").find(".open-convenient-config").remove();
            const titleElement = html.closest(".app").find(".window-title");
            openButton.insertAfter(titleElement);
        }
    }

    static override get defaultOptions(): DocumentSheetOptions {
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
            width: 580,
            height: "auto",
        });
    }

    override async getData(
        options?: Partial<DocumentSheetOptions>,
    ): Promise<ConvenientEffectConfigData> {
        const context = await super.getData(options);
        const allEffects = findEffectFolderItems().flatMap((folder) =>
            findEffectsForItem(folder.id),
        );

        const currentNestedEffects = Flags.getNestedEffects(this.document);
        const nestedEffects = allEffects.map((effect) => {
            const availableId = Flags.getCeEffectId(effect);
            return {
                id: availableId,
                label: effect.name,
                selected: currentNestedEffects?.some((currentNestedEffect) => {
                    const chosenId = Flags.getCeEffectId(currentNestedEffect);
                    return availableId === chosenId;
                })
                    ? "selected"
                    : "",
            };
        });

        const currentSubEffects = Flags.getSubEffects(this.document) ?? [];
        const subEffects = allEffects.map((effect) => {
            const availableId = Flags.getCeEffectId(effect);
            return {
                id: availableId,
                label: effect.name,
                selected: currentSubEffects.some((currentSubEffect) => {
                    const chosenId = Flags.getCeEffectId(currentSubEffect);
                    return availableId === chosenId;
                })
                    ? "selected"
                    : "",
            };
        });

        const currentOtherEffects = Flags.getOtherEffects(this.document) ?? [];
        const otherEffects = allEffects.map((effect) => {
            const availableId = Flags.getCeEffectId(effect);
            return {
                id: availableId,
                label: effect.name,
                selected: currentOtherEffects.some((currentOtherEffect) => {
                    const chosenId = Flags.getCeEffectId(currentOtherEffect);
                    return availableId === chosenId;
                })
                    ? "selected"
                    : "",
            };
        });

        return foundry.utils.mergeObject(context, {
            effect: this.document,
            nestedEffects,
            subEffects,
            otherEffects,
        });
    }

    protected override _getSubmitData(
        updateData?: Record<string, unknown>,
    ): Record<string, unknown> {
        console.log(updateData);
        const fd = new FormDataExtended(this.form, { editors: this.editors });
        const data = foundry.utils.expandObject(fd.object);
        if (updateData) foundry.utils.mergeObject(data, updateData);

        if (data.nestedEffects && data.nestedEffects instanceof Array) {
            Flags.setNestedEffects(
                data,
                this.#getNestedEffectsData(data.nestedEffects as string[]),
            );
        }

        if (data.subEffects && data.subEffects instanceof Array) {
            Flags.setSubEffects(
                data,
                this.#getSubEffectsData(data.subEffects as string[]),
            );
        }

        if (data.otherEffects && data.otherEffects instanceof Array) {
            Flags.setOtherEffects(
                data,
                this.#getOtherEffectsData(data.otherEffects as string[]),
            );
        }

        return data;
    }

    #getNestedEffectsData(
        nestedEffectIds: string[],
    ): PreCreate<ActiveEffectSource>[] {
        const chosenNestedEffects = nestedEffectIds
            .map((id) => {
                return game.dfreds.effectInterface.findEffect({
                    effectId: id,
                });
            })
            .filter((effect) => effect !== undefined)
            .map((effect) => effect!.toObject());

        return chosenNestedEffects;
    }

    #getSubEffectsData(
        subEffectIds: string[],
    ): PreCreate<ActiveEffectSource>[] {
        const chosenSubEffects = subEffectIds
            .map((id) => {
                return game.dfreds.effectInterface.findEffect({
                    effectId: id,
                });
            })
            .filter((effect) => effect !== undefined)
            .map((effect) => effect!.toObject());

        return chosenSubEffects;
    }

    #getOtherEffectsData(
        otherEffectIds: string[],
    ): PreCreate<ActiveEffectSource>[] {
        const chosenOtherEffects = otherEffectIds
            .map((id) => {
                return game.dfreds.effectInterface.findEffect({
                    effectId: id,
                });
            })
            .filter((effect) => effect !== undefined)
            .map((effect) => effect!.toObject());

        return chosenOtherEffects;
    }

    override activateListeners(_html: JQuery): void {
        // html.find("#nested-effects-config button").on(
        //     "click",
        //     async (event) => {
        //         event.preventDefault();
        //         const action = event.currentTarget.dataset.action;
        //         let chosenNestedEffects =
        //             Flags.getNestedEffects(this.document) ?? [];
        //         if (action === "nested-effect-add") {
        //             const effectId = html
        //                 .find("#nested-effects-config .nested-effects-selector")
        //                 .val() as string;
        //             const effect = game.dfreds.effectInterface.findEffect({
        //                 effectId,
        //             });
        //             if (!effect) return null;
        //             chosenNestedEffects.push(effect.toObject());
        //             chosenNestedEffects =
        //                 this.#removeDuplicates(chosenNestedEffects);
        //             return this.submit({
        //                 preventClose: true,
        //                 updateData: {
        //                     [`flags.dfreds-convenient-effects.nestedEffects`]:
        //                         chosenNestedEffects,
        //                 },
        //             });
        //         } else if (action === "nested-effect-remove") {
        //             const ceEffectId = event.currentTarget.dataset.ceEffectId;
        //             const newNestedEffects = chosenNestedEffects.filter(
        //                 (effect) => Flags.getCeEffectId(effect) !== ceEffectId,
        //             );
        //             return this.submit({
        //                 preventClose: true,
        //                 updateData: {
        //                     [`flags.dfreds-convenient-effects.nestedEffects`]:
        //                         newNestedEffects,
        //                 },
        //             });
        //         }
        //         return null;
        //     },
        // );
    }

    // #removeDuplicates(
    //     effects: PreCreate<ActiveEffectSource>[],
    // ): PreCreate<ActiveEffectSource>[] {
    //     const uniqueIds = new Set<string>();
    //     return effects.filter((effect) => {
    //         const ceEffectId = Flags.getCeEffectId(effect);

    //         if (!ceEffectId) return false;

    //         if (uniqueIds.has(ceEffectId)) {
    //             return false;
    //         } else {
    //             uniqueIds.add(ceEffectId);
    //             return true;
    //         }
    //     });
    // }
}

export { ConvenientEffectConfig };
