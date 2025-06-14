import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Settings } from "../settings.ts";
import { error, log } from "../logger.ts";
import { getApi, getItemType } from "../utils/gets.ts";
import { createConvenientItem } from "../utils/creates.ts";
import { Flags } from "../utils/flags.ts";

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

            await this.settings.setHasInitialized(false);
            await this.settings.clearRanMigrations();
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

        await this.#runMigrations();
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

    async #runMigrations(): Promise<void> {
        try {
            const migrationsRun = this.settings.ranMigrations;
            const sortedMigrations = this.migrations.sort(
                (a: MigrationType, b: MigrationType) => {
                    return a.date.getTime() - b.date.getTime();
                },
            );

            for (const migration of sortedMigrations) {
                if (migrationsRun.includes(migration.key)) continue; // Don't run a migration that already ran

                log(
                    `Running version ${migration.key} migration for ${this.systemId}`,
                );

                const success = await migration.func();
                if (success) {
                    // Save each successful migration so that if something fails
                    // before the end, it picks up at the right spot
                    await this.settings.addRanMigration(migration.key);
                } else {
                    error(
                        `Failed to run migration ${migration.key} for ${this.systemId}`,
                    );
                }
            }
        } catch (e: any) {
            error(`Something went wrong while running migrations: ${e}`);
        }
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

type MigrationType = {
    /**
     * The identifier for the migration. Successfully run migrations are saved
     * using this key
     */
    key: string;

    /**
     * The date of the migration. Migrations run from oldest to newest in order
     */
    date: Date;

    /**
     * The migration function
     */
    func: AsyncBooleanFunction;
};

export { EffectDefinition };
export type { ItemData, ItemEffects, MigrationType };
