import { Flags } from "../utils/flags.ts";
import { findAllEffects } from "../utils/finds.ts";
import {
    ApplicationConfiguration,
    ApplicationRenderOptions,
} from "types/foundry/client-esm/applications/_types.js";

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

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class ConvenientEffectConfigV2 extends HandlebarsApplicationMixin(
    ApplicationV2,
) {
    #document: ActiveEffect<any>;

    constructor(
        options?: DeepPartial<
            ApplicationConfiguration & { document: ActiveEffect<any> }
        >,
    ) {
        super(options);
        this.#document = options?.document as ActiveEffect<any>;
    }

    static override DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration> = {
        id: "convenient-effect-config",
        classes: ["sheet"],
        tag: "form",
        window: {
            contentClasses: ["standard-form"],
            icon: "fas fa-hand-sparkles",
            title: "ConvenientEffects.ConfigTitle",
        },
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

    get document(): ActiveEffect<any> {
        return this.#document;
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
