import { error, log } from "../../../logger.ts";
import { findFolders } from "../../../utils/finds.ts";

const migration: MigrationType = {
    key: "2026-03-18-migrate-dnd5e-item-type",
    date: new Date("2026-03-18"),
    func: async (): Promise<boolean> => {
        if (game.system.id !== "dnd5e") return true;

        log("Migrating DND5E item type...");

        try {
            const backupItems = findFolders({ backup: true });
            const convenientItems = findFolders({ backup: false });

            const promises = [...backupItems, ...convenientItems].map(
                async (item) => {
                    if (item.type === "weapon") return;

                    item.clone(
                        { type: "weapon" },
                        { save: true, keepId: true },
                    );
                    await item.delete();
                },
            );

            await Promise.all(promises);
            log(`Migrated ${promises.length} items`);
        } catch (err: any) {
            error(`Error migrating DND5E item type. ${err.message}`);
            return false;
        }

        return true;
    },
};

export { migration as migrateDnd5eItemType };
