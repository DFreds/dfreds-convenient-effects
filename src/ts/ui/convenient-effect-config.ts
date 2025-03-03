import { Flags } from "../utils/flags.ts";
import { findAllEffects, findEffectByUuid } from "../utils/finds.ts";
import {
    DocumentSheetConfiguration,
    DocumentSheetRenderOptions,
} from "types/foundry/client-esm/applications/api/document-sheet.js";

interface MultiSelectData {
    id?: string;
    label?: string;
    selected: string;
}

interface ConvenientEffectConfigData {
    effect: ActiveEffect<any>;
    nestedEffectsData: MultiSelectData[];
    subEffectsData: MultiSelectData[];
    otherEffectsData: MultiSelectData[];
}

const { DocumentSheetV2, HandlebarsApplicationMixin } =
    foundry.applications.api;

class ConvenientEffectConfigV2 extends HandlebarsApplicationMixin(
    DocumentSheetV2<
        DocumentSheetConfiguration<ActiveEffect<any>>,
        DocumentSheetRenderOptions
    >,
) {
    static init(
        app: ActiveEffectConfig<any>,
        html: JQuery,
        _data: unknown,
    ): void {
        // todo add to ui extender?
        if (app.document.isOwner || game.user.isGM) {
            const openButton = $(
                `<a class="header-button control open-convenient-config" title="convenient-config"><i class="fas fa-hand-sparkles"></i> ${game.i18n.localize("ConvenientEffects.ConfigLabel")}</a>`,
            );
            openButton.click(async (_event) => {
                let convenientConfig = null;
                const activeEffect = await findEffectByUuid(app.document.uuid);

                for (const key in app.document.apps) {
                    const obj = app.document.apps[key];
                    if (obj instanceof ConvenientEffectConfigV2) {
                        convenientConfig = obj;
                        break;
                    }
                }
                if (!convenientConfig && activeEffect instanceof ActiveEffect)
                    convenientConfig = new ConvenientEffectConfigV2({
                        document: activeEffect,
                    });
                convenientConfig?.render(true);
            });

            html.closest(".app").find(".open-convenient-config").remove();
            const titleElement = html.closest(".app").find(".window-title");
            openButton.insertAfter(titleElement);
        }
    }

    static override DEFAULT_OPTIONS: DeepPartial<DocumentSheetConfiguration> = {
        id: "convenient-effect-config",
        tag: "form",
        window: {
            contentClasses: ["standard-form"],
            icon: "fas fa-hand-sparkles",
            title: "ConvenientEffects.ConfigTitle",
        },
        actions: {},
        position: {
            width: 580,
            height: "auto",
        },
        form: {
            handler: this.#onSubmit,
            closeOnSubmit: true,
            submitOnChange: false,
        },
    };

    static override PARTS = {
        convenientConfig: {
            id: "convenient-config",
            template:
                "modules/dfreds-convenient-effects/templates/convenient-effect-config-v2.hbs",
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        },
    };

    protected override async _prepareContext(
        _options: DocumentSheetRenderOptions,
    ): Promise<ConvenientEffectConfigData & { buttons: object[] }> {
        const allEffects = findAllEffects({ backup: false });

        const currentNestedEffectIds = Flags.getNestedEffectIds(this.document);
        const nestedEffectsData = allEffects.map((effect) => {
            const availableId = Flags.getCeEffectId(effect);
            return {
                id: availableId,
                label: effect.name,
                selected: currentNestedEffectIds?.some(
                    (currentNestedEffectId) => {
                        return availableId === currentNestedEffectId;
                    },
                )
                    ? "selected"
                    : "",
            };
        });

        const currentSubEffectIds = Flags.getSubEffectIds(this.document) ?? [];
        const subEffectsData = allEffects.map((effect) => {
            const availableId = Flags.getCeEffectId(effect);
            return {
                id: availableId,
                label: effect.name,
                selected: currentSubEffectIds.some((currentSubEffectId) => {
                    return availableId === currentSubEffectId;
                })
                    ? "selected"
                    : "",
            };
        });

        const currentOtherEffectIds =
            Flags.getOtherEffectIds(this.document) ?? [];
        const otherEffectsData = allEffects.map((effect) => {
            const availableId = Flags.getCeEffectId(effect);
            return {
                id: availableId,
                label: effect.name,
                selected: currentOtherEffectIds.some((currentOtherEffectId) => {
                    return availableId === currentOtherEffectId;
                })
                    ? "selected"
                    : "",
            };
        });

        return {
            effect: this.document,
            nestedEffectsData,
            subEffectsData,
            otherEffectsData,
            buttons: [
                {
                    type: "submit",
                    icon: "fa-solid fa-save",
                    label: "EFFECT.Submit",
                },
            ],
        };
    }

    protected override _prepareSubmitData(
        _event: SubmitEvent | Event,
        _form: HTMLFormElement,
        formData: FormDataExtended,
    ): object {
        const data = foundry.utils.expandObject(formData.object);

        if (Object.hasOwn(data, "temporary")) {
            Flags.setIsTemporary(data, data.temporary as boolean);
        }

        if (Object.hasOwn(data, "viewable")) {
            Flags.setIsViewable(data, data.viewable as boolean);
        }

        if (data.nestedEffectIds && data.nestedEffectIds instanceof Array) {
            Flags.setNestedEffectIds(data, data.nestedEffectIds as string[]);
        }

        if (data.subEffectIds && data.subEffectIds instanceof Array) {
            Flags.setSubEffectIds(data, data.subEffectIds as string[]);
        }

        if (data.otherEffectIds && data.otherEffectIds instanceof Array) {
            Flags.setOtherEffectIds(data, data.otherEffectIds as string[]);
        }

        return data;
    }

    static async #onSubmit(
        event: SubmitEvent | Event,
        form: HTMLFormElement,
        formData: FormDataExtended,
    ): Promise<void> {
        const thisClass = this as unknown as ConvenientEffectConfigV2;
        const submitData = thisClass._prepareSubmitData(event, form, formData);
        await thisClass.document.update(submitData as Record<string, unknown>);
    }
}

// class ConvenientEffectConfig extends FormApplication<
//     ActiveEffect<any>,
//     FormApplicationOptions
// > {
//     constructor(
//         object?: ActiveEffect<any>,
//         options?: Partial<FormApplicationOptions>,
//     ) {
//         super(object, options);
//     }

//     static init(
//         app: ActiveEffectConfig<any>,
//         html: JQuery,
//         _data: unknown,
//     ): void {
//         // todo add to ui extender?
//         if (app.document.isOwner || game.user.isGM) {
//             const openButton = $(
//                 `<a class="header-button control open-convenient-config" title="convenient-config"><i class="fas fa-hand-sparkles"></i> ${game.i18n.localize("ConvenientEffects.ConfigLabel")}</a>`,
//             );
//             openButton.click(async (_event) => {
//                 let convenientConfig = null;
//                 const activeEffect = await findEffectByUuid(app.document.uuid);

//                 for (const key in app.document.apps) {
//                     const obj = app.document.apps[key];
//                     if (obj instanceof ConvenientEffectConfig) {
//                         convenientConfig = obj;
//                         break;
//                     }
//                 }
//                 if (!convenientConfig && activeEffect instanceof ActiveEffect)
//                     convenientConfig = new ConvenientEffectConfig(
//                         activeEffect,
//                         {},
//                     );
//                 convenientConfig?.render(true);
//             });

//             html.closest(".app").find(".open-convenient-config").remove();
//             const titleElement = html.closest(".app").find(".window-title");
//             openButton.insertAfter(titleElement);
//         }
//     }

//     static override get defaultOptions(): FormApplicationOptions {
//         return foundry.utils.mergeObject(super.defaultOptions, {
//             id: "convenient-effect-config",
//             title: "ConvenientEffects.ConfigTitle",
//             popOut: true,
//             template:
//                 "modules/dfreds-convenient-effects/templates/convenient-effect-config.hbs",
//             classes: ["sheet"],
//             width: 580,
//             height: "auto",
//         });
//     }

//     override async getData(
//         options?: Partial<FormApplicationOptions>,
//     ): Promise<ConvenientEffectConfigData> {
//         const context = await super.getData(options);
//         const allEffects = findAllEffects({ backup: false });

//         const currentNestedEffectIds = Flags.getNestedEffectIds(this.object);
//         const nestedEffectsData = allEffects.map((effect) => {
//             const availableId = Flags.getCeEffectId(effect);
//             return {
//                 id: availableId,
//                 label: effect.name,
//                 selected: currentNestedEffectIds?.some(
//                     (currentNestedEffectId) => {
//                         return availableId === currentNestedEffectId;
//                     },
//                 )
//                     ? "selected"
//                     : "",
//             };
//         });

//         const currentSubEffectIds = Flags.getSubEffectIds(this.object) ?? [];
//         const subEffectsData = allEffects.map((effect) => {
//             const availableId = Flags.getCeEffectId(effect);
//             return {
//                 id: availableId,
//                 label: effect.name,
//                 selected: currentSubEffectIds.some((currentSubEffectId) => {
//                     return availableId === currentSubEffectId;
//                 })
//                     ? "selected"
//                     : "",
//             };
//         });

//         const currentOtherEffectIds =
//             Flags.getOtherEffectIds(this.object) ?? [];
//         const otherEffectsData = allEffects.map((effect) => {
//             const availableId = Flags.getCeEffectId(effect);
//             return {
//                 id: availableId,
//                 label: effect.name,
//                 selected: currentOtherEffectIds.some((currentOtherEffectId) => {
//                     return availableId === currentOtherEffectId;
//                 })
//                     ? "selected"
//                     : "",
//             };
//         });

//         return foundry.utils.mergeObject(context, {
//             effect: this.object,
//             nestedEffectsData,
//             subEffectsData,
//             otherEffectsData,
//         });
//     }

//     protected override _getSubmitData(
//         updateData?: Record<string, unknown>,
//     ): Record<string, unknown> {
//         const fd = new FormDataExtended(this.form, { editors: this.editors });
//         const data = foundry.utils.expandObject(fd.object);
//         if (updateData) foundry.utils.mergeObject(data, updateData);

//         if (Object.hasOwn(data, "temporary")) {
//             Flags.setIsTemporary(data, data.temporary as boolean);
//         }

//         if (Object.hasOwn(data, "viewable")) {
//             Flags.setIsViewable(data, data.viewable as boolean);
//         }

//         if (data.nestedEffectIds && data.nestedEffectIds instanceof Array) {
//             Flags.setNestedEffectIds(data, data.nestedEffectIds as string[]);
//         }

//         if (data.subEffectIds && data.subEffectIds instanceof Array) {
//             Flags.setSubEffectIds(data, data.subEffectIds as string[]);
//         }

//         if (data.otherEffectIds && data.otherEffectIds instanceof Array) {
//             Flags.setOtherEffectIds(data, data.otherEffectIds as string[]);
//         }

//         return data;
//     }

//     protected override _updateObject(
//         _event: Event,
//         formData: Record<string, unknown>,
//     ): Promise<unknown> {
//         return this.object.update(formData);
//     }
// }

export { ConvenientEffectConfigV2 };
