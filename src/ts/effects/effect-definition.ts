import { Settings } from "../settings.ts";
import { error, log } from "../logger.ts";
import { getApi, getItemType } from "../utils/gets.ts";
import { createConvenientItem } from "../utils/creates.ts";
import { Flags } from "../utils/flags.ts";
import { ActiveEffectSource } from "@client/documents/_module.mjs";
import { MODULE_ID } from "../constants.ts";

abstract class EffectDefinition {
    protected settings: Settings;

    abstract systemId: string;

    constructor() {
        this.settings = new Settings();
    }

    async initialize(): Promise<void> {
        if (BUILD_MODE === "development") {
            log(
                `Debug mode is enabled, deleting any effects for ${this.systemId} and clearing migrations`,
            );

            await getApi().resetSystemInitialization({
                confirm: false,
            });
        }

        if (!this.settings.hasInitialized) {
            ui.notifications.info(
                game.i18n.localize("ConvenientEffects.Initializing"),
            );
            await this.#createItemsAndEffects({ backup: false });
            await this.#createItemsAndEffects({ backup: true });

            // Set initialized before migration runs
            await this.settings.setHasInitialized(true);
            ui.notifications.info(
                game.i18n.localize("ConvenientEffects.FinishedInitializing"),
            );
        }

        migrations.addMigrations({ moduleId: MODULE_ID, migrations: this.migrations });

        const result = await migrations.runAll({ moduleId: MODULE_ID });
        if (!result) {
            error(`Failed to run migrations for ${this.systemId}`);
        }
    }

    abstract get initialItemEffects(): ItemEffects[];

    abstract get migrations(): MigrationType[];

    async #createItemsAndEffects({
        backup,
    }: {
        backup: boolean;
    }): Promise<void> {
        const effectPromises = this.initialItemEffects.map(
            async (itemEffect) => {
                const item = await Item.implementation.create(
                    createConvenientItem({
                        item: {
                            name: itemEffect.itemData.name,
                            type: getItemType(),
                        },
                        isBackup: backup,
                    }),
                );

                if (!item) return; // type safety, shouldn't occur

                return item.createEmbeddedDocuments(
                    "ActiveEffect",
                    itemEffect.effects.map((effect) => {
                        Flags.setIsBackup(effect, backup);
                        return effect;
                    }),
                );
            },
        );

        await Promise.all(effectPromises);
    }
}

type ItemData = {
    name: string;
};

type ItemEffects = {
    /**
     * The item data for the item that will contain the effects
     */
    itemData: ItemData;

    /**
     * The effects that belong to the item
     */
    effects: PreCreate<ActiveEffectSource>[];
};

export { EffectDefinition };
export type { ItemData, ItemEffects };
