import {
    ApplicationConfiguration,
    ApplicationRenderOptions,
} from "types/foundry/client-esm/applications/_types.js";
import { Flags } from "../../utils/flags.ts";
import { MODULE_ID } from "../../constants.ts";
import { HandlebarsRenderOptions } from "types/foundry/client-esm/applications/api/handlebars-application.ts";
import { getItemType } from "../../utils/gets.ts";
import { createConvenientItem } from "../../utils/creates.ts";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

interface ConvenientFolderConfigOptions extends ApplicationConfiguration {
    document: Item<any> | null;
}

class ConvenientFolderConfig extends HandlebarsApplicationMixin(
    ApplicationV2<ConvenientFolderConfigOptions>,
) {
    #document?: Item<any> | null;

    constructor(options?: DeepPartial<ConvenientFolderConfigOptions>) {
        super(options);
        this.#document = options?.document;
    }

    static override DEFAULT_OPTIONS: DeepPartial<ConvenientFolderConfigOptions> =
        {
            id: "convenient-folder-config",
            classes: ["sheet", "folder-config"],
            tag: "form",
            document: null,
            window: {
                contentClasses: ["standard-form"],
                icon: "fa-solid fa-folder",
            },
            position: {
                width: 480,
            },
            form: {
                handler: this.#onSubmit,
                submitOnChange: false,
                closeOnSubmit: true,
            },
        };

    static override PARTS = {
        body: {
            template: `modules/${MODULE_ID}/templates/dialogs/folder-config.hbs`,
        },
        footer: {
            template: "templates/generic/form-footer.hbs",
        },
    };

    override get title(): string {
        return this.document?._id
            ? `${game.i18n.localize("FOLDER.Update")}: ${this.document.name}`
            : game.i18n.localize("SIDEBAR.ACTIONS.CREATE.Folder");
    }

    get document(): Item<any> {
        return this.#document as Item<any>;
    }

    protected override async _prepareContext(
        _options: ApplicationRenderOptions,
    ): Promise<object> {
        const context = await super._prepareContext(_options);

        const data = {
            color: this.document?._id
                ? Flags.getFolderColor(this.document)
                : "",
            namePlaceholder: game.i18n.localize("DOCUMENT.Folder"),
        };

        Object.assign(context, {
            document: this.document,
            source:
                this.document instanceof Item
                    ? this.document._source
                    : this.document,
            fields:
                this.document instanceof Item
                    ? this.document.schema.fields
                    : {},
            rootId:
                this.document?._id && game.items.get(this.document._id)
                    ? this.document._id
                    : foundry.utils.randomID(),
            ...data,
        });

        return context;
    }

    protected override async _preparePartContext(
        partId: string,
        context: object,
        options: HandlebarsRenderOptions,
    ): Promise<object> {
        const partContext = await super._preparePartContext(
            partId,
            context,
            options,
        );

        switch (partId) {
            case "footer":
                this.#prepareFooterContext(partContext);
                break;
        }

        return partContext;
    }

    #prepareFooterContext(context: object): void {
        Object.assign(context, {
            buttons: [
                {
                    type: "submit",
                    icon: "fa-solid fa-floppy-disk",
                    label: this.document?._id
                        ? "FOLDER.Update"
                        : "SIDEBAR.ACTIONS.CREATE.Folder",
                },
            ],
        });
    }

    async #prepareSubmitData(
        _event: SubmitEvent | Event,
        _form: HTMLFormElement,
        formData: FormDataExtended,
        updateData?: object,
    ): Promise<object> {
        const submitData = foundry.utils.expandObject(formData.object);

        if (updateData) {
            foundry.utils.mergeObject(submitData, updateData, {
                inplace: true,
                performDeletions: true,
            });
        }

        if (Object.hasOwn(submitData, "color")) {
            Flags.setFolderColor(submitData, submitData.color as string);
            delete submitData.color;
        }

        this.document.validate({
            changes: submitData,
            clean: true,
            fallback: false,
        });

        return submitData;
    }

    async #processSubmitData(
        _event: SubmitEvent | Event,
        _form: HTMLFormElement,
        submitData: object,
        options?: Partial<DatabaseUpdateOperation<any>>,
    ): Promise<void> {
        const thisClass = this as unknown as ConvenientFolderConfig;
        const document = thisClass.document;

        if (game.items.get(document._id ?? "")) {
            await document.update(
                submitData as Record<string, unknown>,
                options,
            );
        } else {
            const operation = Object.assign(options ?? {}, {
                parent: document.parent,
                pack: document.pack,
                keepId: true,
            });
            // @ts-expect-error This accesses the static create method of the Item class
            const created = await document.constructor.create(
                foundry.utils.mergeObject(
                    createConvenientItem({
                        item: {
                            name: game.i18n.localize(
                                "SIDEBAR.ACTIONS.CREATE.Folder",
                            ),
                            type: getItemType(),
                        },
                    }),
                    submitData,
                ),
                operation,
            );

            if (created) {
                this.#document = created;
            } else {
                throw new Error("Failed to create document");
            }
        }
    }

    static async #onSubmit(
        event: SubmitEvent | Event,
        form: HTMLFormElement,
        formData: FormDataExtended,
        options?: {
            updateData?: object;
        },
    ): Promise<void> {
        const { updateData, ...updateOptions } = options ?? {};

        const thisClass = this as unknown as ConvenientFolderConfig;
        const submitData = await thisClass.#prepareSubmitData(
            event,
            form,
            formData,
            updateData,
        );

        await thisClass.#processSubmitData(
            event,
            form,
            submitData,
            updateOptions,
        );
    }
}

export { ConvenientFolderConfig };
