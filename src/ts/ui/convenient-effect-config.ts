import { Flags } from "../utils/flags.ts";
import { findAllEffects } from "../utils/finds.ts";
import {
    ApplicationConfiguration,
    ApplicationRenderOptions,
} from "types/foundry/client-esm/applications/_types.js";
import { MODULE_ID } from "../constants.ts";
import type {
    ActiveEffectSchema,
    ActiveEffectSource,
} from "types/foundry/common/documents/active-effect.d.ts";
interface MultiSelectData {
    id?: string;
    label?: string;
    selected: string;
}

interface ConvenientEffectConfigData {
    effect: ActiveEffect<any>;
    source: ActiveEffectSource;
    fields: ActiveEffectSchema;
    rootId: string;
    nestedEffectsData: MultiSelectData[];
    subEffectsData: MultiSelectData[];
    otherEffectsData: MultiSelectData[];
}

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface ConvenientEffectConfigOptions extends ApplicationConfiguration {
    document: ActiveEffect<any> | null;
}

class ConvenientEffectConfigV2 extends HandlebarsApplicationMixin(
    ApplicationV2<ConvenientEffectConfigOptions>,
) {
    #document?: ActiveEffect<any> | null;

    constructor(options?: DeepPartial<ConvenientEffectConfigOptions>) {
        super(options);
        this.#document = options?.document;
    }

    static override DEFAULT_OPTIONS: DeepPartial<ConvenientEffectConfigOptions> =
        {
            id: "convenient-effect-config",
            classes: ["sheet"],
            tag: "form",
            document: null,
            window: {
                contentClasses: ["standard-form"],
                icon: "fas fa-hand-sparkles",
                title: "ConvenientEffects.ConfigTitle",
            },
            position: {
                width: 580,
            },
            form: {
                handler: this.#onSubmit,
                submitOnChange: false,
                closeOnSubmit: true,
            },
        };

    static override PARTS = {
        header: {
            template: `modules/${MODULE_ID}/templates/ce-config/header.hbs`,
        },
        config: {
            id: "convenient-config",
            template: `modules/${MODULE_ID}/templates/ce-config/config.hbs`,
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        },
    };

    get document(): ActiveEffect<any> {
        return this.#document as ActiveEffect<any>;
    }

    protected override async _prepareContext(
        _options: ApplicationRenderOptions,
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
            source: this.document._source,
            fields: this.document.schema.fields,
            rootId: this.document.id,
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

    #prepareSubmitData(
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
        const submitData = thisClass.#prepareSubmitData(event, form, formData);
        await thisClass.document.update(submitData as Record<string, unknown>);
    }
}

export { ConvenientEffectConfigV2 };
