import { Flags } from "../../utils/flags.ts";
import { findAllEffects } from "../../utils/finds.ts";
import { notEmpty } from "../../utils/types.ts";
import { MODULE_ID } from "../../constants.ts";
import { ApplicationConfiguration, ApplicationTabsConfiguration } from "@client/applications/_module.mjs";
import { HandlebarsRenderOptions } from "@client/applications/api/_module.mjs";
import { FormDataExtended } from "@client/applications/ux/_module.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface ConvenientEffectConfigOptions extends ApplicationConfiguration {
    document: ActiveEffect<any> | null;
}

interface MultiSelectData {
    id?: string;
    label?: string;
    selected: string;
}

interface OrderedEffectData {
    id?: string;
    label?: string;
}

interface ConvenientEffectConfigData {
    nestedEffectsData: MultiSelectData[];
    subEffectsData: MultiSelectData[];
    otherEffectsData: MultiSelectData[];
    incrementEffectsData: MultiSelectData[];
    incrementOrder: OrderedEffectData[];
}

// TODO this any is because of some circular dependencies with ActiveEffect
class ConvenientEffectConfigV2 extends (HandlebarsApplicationMixin(
    ApplicationV2<ConvenientEffectConfigOptions>,
) as any) {
    readonly #document?: ActiveEffect<any> | null;

    // Holds ordering of increment chain members. `<multi-select>` loses stored order on re-render, so
    // the ordered list below it (reordered via the arrow actions) is the source of truth until the form is submitted.
    #incrementOrder?: string[];

    constructor(options?: DeepPartial<ConvenientEffectConfigOptions>) {
        super(options);
        this.#document = options?.document as ActiveEffect<any> | null;
    }

    // @ts-expect-error any is because of some circular dependencies with ActiveEffect
    static override DEFAULT_OPTIONS: DeepPartial<ConvenientEffectConfigOptions> = {
        id: "convenient-effect-config",
        classes: ["sheet"],
        tag: "form",
        document: null,
        window: {
            contentClasses: ["standard-form"],
            icon: "fas fa-hand-sparkles",
            title: "ConvenientEffects.Config.Title",
            resizable: true,
        },
        position: {
            width: 580,
        },
        form: {
            handler: this.#onSubmit,
            submitOnChange: false,
            closeOnSubmit: true,
        },
        actions: {
            incrementMoveUp: this.#onIncrementMoveUp,
            incrementMoveDown: this.#onIncrementMoveDown,
        },
    };

    // @ts-expect-error any is because of some circular dependencies with ActiveEffect
    static override PARTS = {
        header: {
            template: `modules/${MODULE_ID}/templates/ce-config/header.hbs`,
        },
        tabs: {
            template: "templates/generic/tab-navigation.hbs",
        },
        ids: {
            id: "ids",
            template: `modules/${MODULE_ID}/templates/ce-config/ids.hbs`,
        },
        flags: {
            id: "flags",
            template: `modules/${MODULE_ID}/templates/ce-config/flags.hbs`,
        },
        dependentEffects: {
            id: "dependentEffects",
            template: `modules/${MODULE_ID}/templates/ce-config/dependent-effects.hbs`,
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        },
    };

    // @ts-expect-error any is because of some circular dependencies with ActiveEffect
    static override TABS: Record<string, ApplicationTabsConfiguration> = {
        sheet: {
            tabs: [
                {
                    id: "ids",
                    icon: "fa-solid fa-hashtag",
                    label: "ConvenientEffects.Config.IDsTab",
                },
                {
                    id: "flags",
                    icon: "fa-solid fa-flag",
                    label: "ConvenientEffects.Config.FlagsTab",
                },
                {
                    id: "dependentEffects",
                    icon: "fa-solid fa-list-tree",
                    label: "ConvenientEffects.Config.DependentEffectsTab",
                },
            ],
            initial: "ids",
        },
    };

    get document(): ActiveEffect<any> {
        return this.#document as ActiveEffect<any>;
    }

    // @ts-expect-error any is because of some circular dependencies with ActiveEffect
    protected override async _prepareContext(_options: HandlebarsRenderOptions): Promise<object> {
        const context = await super._prepareContext(_options);

        Object.assign(context, {
            effect: this.document,
            source: this.document._source,
            fields: (this.document.schema as any).fields,
            rootId: this.document.id,
            ...this.#prepareContext(),
        });

        return context;
    }

    // @ts-expect-error any is because of some circular dependencies with ActiveEffect
    protected override async _preparePartContext(
        partId: string,
        context: object,
        options: HandlebarsRenderOptions,
    ): Promise<object> {
        const partContext = await super._preparePartContext(partId, context, options);

        // Check if tabs exists in the context and if the partId matches a tab
        const contextWithTabs = partContext as {
            tabs?: Record<string, unknown>;
            tab?: unknown;
        };
        if (contextWithTabs.tabs && partId in contextWithTabs.tabs) {
            contextWithTabs.tab = contextWithTabs.tabs[partId];
        }

        switch (partId) {
            case "footer":
                this.#prepareFooterContext(partContext);
                break;
        }

        return partContext;
    }

    #prepareContext(): ConvenientEffectConfigData {
        const allEffects = findAllEffects({ backup: false });

        const currentNestedEffectIds = Flags.getNestedEffectIds(this.document);
        const nestedEffectsData = allEffects.map((effect) => {
            const availableId = Flags.getCeEffectId(effect);
            return {
                id: availableId,
                label: effect.name,
                selected: currentNestedEffectIds?.some((currentNestedEffectId) => {
                    return availableId === currentNestedEffectId;
                })
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

        const currentOtherEffectIds = Flags.getOtherEffectIds(this.document) ?? [];
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

        const storedIncrementIds = this.#incrementOrder ?? Flags.getIncrementEffectIds(this.document) ?? [];
        const effectByCeId = new Map(allEffects.map((effect) => [Flags.getCeEffectId(effect), effect]));

        const orderedSelectedEffects = storedIncrementIds.map((id) => effectByCeId.get(id)).filter(notEmpty);

        const selectedIncrementData: MultiSelectData[] = orderedSelectedEffects.map((effect) => {
            return {
                id: Flags.getCeEffectId(effect),
                label: effect.name,
                selected: "selected",
            };
        });

        const unselectedIncrementData: MultiSelectData[] = allEffects
            .filter((effect) => !storedIncrementIds.includes(Flags.getCeEffectId(effect) ?? ""))
            .map((effect) => {
                return {
                    id: Flags.getCeEffectId(effect),
                    label: effect.name,
                    selected: "",
                };
            });

        const incrementEffectsData = [...selectedIncrementData, ...unselectedIncrementData];

        const incrementOrder: OrderedEffectData[] = orderedSelectedEffects.map((effect) => {
            return {
                id: Flags.getCeEffectId(effect),
                label: effect.name,
            };
        });

        return {
            nestedEffectsData,
            subEffectsData,
            otherEffectsData,
            incrementEffectsData,
            incrementOrder,
        };
    }

    // @ts-expect-error any is because of some circular dependencies with ActiveEffect
    protected override async _onRender(context: object, options: HandlebarsRenderOptions): Promise<void> {
        await super._onRender(context, options);

        const form = this.element as HTMLFormElement;
        const incrementMultiSelect = form.querySelector('multi-select[name="incrementEffectIds"]');
        incrementMultiSelect?.addEventListener("change", this.#onIncrementSelectionChange);
    }

    #onIncrementSelectionChange = async (): Promise<void> => {
        const form = this.element as HTMLFormElement;
        this.#incrementOrder = this.#currentIncrementOrder(form);
        await this.render({ parts: ["dependentEffects"] });
    };

    #currentIncrementOrder(form: HTMLFormElement): string[] {
        const multiSelect = form.querySelector('multi-select[name="incrementEffectIds"]') as
            | (HTMLElement & { value?: string[] })
            | null;
        const selected = multiSelect?.value ? [...multiSelect.value] : [];

        const listIds = Array.from(form.querySelectorAll<HTMLElement>(".increment-order-item")).map(
            (item) => item.dataset.id ?? "",
        );

        const ordered = listIds.filter((id) => selected.includes(id));
        for (const id of selected) {
            if (!ordered.includes(id)) {
                ordered.push(id);
            }
        }

        return ordered;
    }

    async #moveIncrementMember(target: HTMLElement, offset: -1 | 1): Promise<void> {
        const id = target.dataset.id;
        if (!id) return;

        const form = this.element as HTMLFormElement;
        const order = this.#currentIncrementOrder(form);

        const index = order.indexOf(id);
        if (index === -1) return;

        const swapIndex = index + offset;
        if (swapIndex < 0 || swapIndex >= order.length) return;

        [order[index], order[swapIndex]] = [order[swapIndex], order[index]];

        this.#incrementOrder = order;
        await this.render({ parts: ["dependentEffects"] });
    }

    static async #onIncrementMoveUp(...args: any[]): Promise<void> {
        const [, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectConfigV2;
        await thisClass.#moveIncrementMember(target, -1);
    }

    static async #onIncrementMoveDown(...args: any[]): Promise<void> {
        const [, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as ConvenientEffectConfigV2;
        await thisClass.#moveIncrementMember(target, 1);
    }

    #prepareFooterContext(context: object): void {
        Object.assign(context, {
            buttons: [
                {
                    type: "submit",
                    icon: "fa-solid fa-floppy-disk",
                    label: "EFFECT.Submit",
                },
            ],
        });
    }

    async #prepareSubmitData(
        _event: SubmitEvent | Event,
        form: HTMLFormElement,
        formData: FormDataExtended,
    ): Promise<object> {
        const data = foundry.utils.expandObject(formData.object);

        if (Object.hasOwn(data, "temporary")) {
            Flags.setIsTemporary(data, data.temporary as boolean);
        }

        if (Object.hasOwn(data, "viewable")) {
            await Flags.setIsViewable(data, data.viewable as boolean);
        }

        if (data.nestedEffectIds && data.nestedEffectIds instanceof Array) {
            await Flags.setNestedEffectIds(data, data.nestedEffectIds as string[]);
        }

        if (data.subEffectIds && data.subEffectIds instanceof Array) {
            await Flags.setSubEffectIds(data, data.subEffectIds as string[]);
        }

        if (data.otherEffectIds && data.otherEffectIds instanceof Array) {
            await Flags.setOtherEffectIds(data, data.otherEffectIds as string[]);
        }

        const selectedIncrementIds =
            data.incrementEffectIds instanceof Array
                ? (data.incrementEffectIds as string[])
                : data.incrementEffectIds
                  ? [data.incrementEffectIds as string]
                  : [];

        const orderedIncrementIds = Array.from(form.querySelectorAll<HTMLElement>(".increment-order-item"))
            .map((item) => item.dataset.id ?? "")
            .filter((id) => selectedIncrementIds.includes(id));

        for (const id of selectedIncrementIds) {
            if (!orderedIncrementIds.includes(id)) {
                orderedIncrementIds.push(id);
            }
        }

        await Flags.setIncrementEffectIds(data, orderedIncrementIds);

        return data;
    }

    static async #onSubmit(
        event: SubmitEvent | Event,
        form: HTMLFormElement,
        formData: FormDataExtended,
    ): Promise<void> {
        const thisClass = this as unknown as ConvenientEffectConfigV2;
        const submitData = await thisClass.#prepareSubmitData(event, form, formData);
        await thisClass.document.update(submitData as Record<string, unknown>);
    }
}

export { ConvenientEffectConfigV2 };
