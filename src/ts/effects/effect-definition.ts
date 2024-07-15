import { id as MODULE_ID } from "@static/module.json";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Settings } from "../settings.ts";
import { log } from "../logger.ts";
import { FLAGS } from "../constants.ts";
import { ItemFlags } from "types/foundry/common/documents/item.js";

abstract class EffectDefinition {
    protected settings: Settings;

    abstract systemId: string;

    constructor() {
        this.settings = new Settings();
    }

    async initialize(): Promise<void> {
        // TODO do this only once
        await this.createInitialFolderItems();
        await this.createInitialEffects();

        // TODO do every time to check for new ones
        await this.runMigrations();
    }

    abstract get initialEffects(): Record<
        string,
        PreCreate<ActiveEffectSource>[]
    >;

    abstract get migrations(): MigrationType[];

    protected async createInitialFolderItems(): Promise<void> {
        const folderItemNames = Object.keys(this.initialEffects);

        const ceFlags: DeepPartial<ItemFlags> = {};
        ceFlags[MODULE_ID] = {};
        ceFlags[MODULE_ID]![FLAGS.IS_CONVENIENT] = true;

        const itemPromises = folderItemNames.map((folderItemName) => {
            return Item.create({
                name: folderItemName,
                img: "modules/dfreds-convenient-effects/images/magic-palm.svg",
                type: CONFIG.Item.typeLabels[0] ?? "consumable", // TODO when undefined... do what?
                flags: ceFlags,
            });
        });

        const folderItems = await Promise.all(itemPromises);
        const folderItemIds = folderItems
            .filter((folderItem) => !!folderItem)
            .map((folderItem) => folderItem.id);

        await this.settings.setEffectItemIds(folderItemIds);
    }

    protected async createInitialEffects(): Promise<void> {
        const folderItemNames = Object.keys(this.initialEffects);

        const effectPromises = folderItemNames.map(async (folderItemName) => {
            const folderItem = game.items.find(
                (item) => item.name === folderItemName,
            );
            const effectsForFolder = this.initialEffects[folderItemName];

            return folderItem?.createEmbeddedDocuments(
                "ActiveEffect",
                effectsForFolder,
            );
        });

        await Promise.all(effectPromises);
    }

    protected async runMigrations(): Promise<void> {
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
                await this.settings.addRanMigrationVersion(migration.key);
            }
        } catch (e: any) {
            log(`Something went wrong while running migrations: ${e}`);
        }
    }
}

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
export type { MigrationType };
