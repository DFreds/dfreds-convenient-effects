import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Settings } from "../settings.ts";
import { log } from "../logger.ts";
import { createConvenientItem } from "../helpers.ts";

abstract class EffectDefinition {
    protected settings: Settings;

    abstract systemId: string;

    constructor() {
        this.settings = new Settings();
    }

    async initialize(): Promise<void> {
        // TODO should we create backup items that can't be modified here? With additional flag perhaps

        await this.#createItemsAndEffects(); // TODO do this only once
        await this.#runMigrations();
    }

    abstract get initialItemEffects(): ItemEffects[];

    abstract get migrations(): MigrationType[];

    async #createItemsAndEffects(): Promise<void> {
        const effectPromises = this.initialItemEffects.map(
            async (itemEffect) => {
                const item = await Item.create(
                    createConvenientItem({
                        item: {
                            name: itemEffect.itemData.name,
                            type: CONFIG.Item.typeLabels[0] ?? "consumable", // TODO when undefined... do what?
                        },
                    }),
                );

                if (!item) return; // type safety, shouldn't occur

                return item.createEmbeddedDocuments(
                    "ActiveEffect",
                    itemEffect.effects,
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

                await migration.func();

                // Save each successful migration so that if something fails
                // before the end, it picks up at the right spot
                await this.settings.addRanMigration(migration.key);
            }
        } catch (e: any) {
            log(`Something went wrong while running migrations: ${e}`);
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
    func: AnyAsyncFunction;
};

export { EffectDefinition };
export type { ItemData, ItemEffects, MigrationType };
