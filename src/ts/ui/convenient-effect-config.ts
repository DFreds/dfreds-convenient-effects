import { Flags } from "../utils/flags.ts";
import { findAllEffects, findEffectByUuid } from "../utils/finds.ts";

interface MultiSelectData {
    id?: string;
    label?: string;
    selected: string;
}

interface ConvenientEffectConfigData
    extends FormApplicationData<ActiveEffect<any>> {
    effect: ActiveEffect<any>;
    nestedEffectsData: MultiSelectData[];
    subEffectsData: MultiSelectData[];
    otherEffectsData: MultiSelectData[];
}

class ConvenientEffectConfig extends FormApplication<
    ActiveEffect<any>,
    FormApplicationOptions
> {
    constructor(
        object?: ActiveEffect<any>,
        options?: Partial<FormApplicationOptions>,
    ) {
        super(object, options);
    }

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

    static override get defaultOptions(): FormApplicationOptions {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "convenient-effect-config",
            title: "ConvenientEffects.ConfigTitle",
            popOut: true,
            template:
                "modules/dfreds-convenient-effects/templates/convenient-effect-config.hbs",
            classes: ["sheet"],
            width: 580,
            height: "auto",
        });
    }

    override async getData(
        options?: Partial<FormApplicationOptions>,
    ): Promise<ConvenientEffectConfigData> {
        const context = await super.getData(options);
        const allEffects = findAllEffects({ backup: false });

        const currentNestedEffectIds = Flags.getNestedEffectIds(this.object);
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

        const currentSubEffectIds = Flags.getSubEffectIds(this.object) ?? [];
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
            Flags.getOtherEffectIds(this.object) ?? [];
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

        return foundry.utils.mergeObject(context, {
            effect: this.object,
            nestedEffectsData,
            subEffectsData,
            otherEffectsData,
        });
    }

    protected override _getSubmitData(
        updateData?: Record<string, unknown>,
    ): Record<string, unknown> {
        const fd = new FormDataExtended(this.form, { editors: this.editors });
        const data = foundry.utils.expandObject(fd.object);
        if (updateData) foundry.utils.mergeObject(data, updateData);

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

    protected override _updateObject(
        _event: Event,
        formData: Record<string, unknown>,
    ): Promise<unknown> {
        return this.object.update(formData);
    }
}

export { ConvenientEffectConfig };
