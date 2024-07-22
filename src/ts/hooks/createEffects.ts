import { id as MODULE_ID } from "@static/module.json";
import { Listener } from "./index.ts";
import { Mapping } from "../effects/mapping.ts";
import { log } from "../logger.ts";
import { Settings } from "../settings.ts";
import { FLAGS } from "../constants.ts";

const CreateEffects: Listener = {
    listen(): void {
        Hooks.on(`${MODULE_ID}.createEffects`, async () => {
            if (!game.user.isGM) return; // Only allow connected GMs to do this

            // TODO extract to actual API function to reset?
            const debug = true;
            if (debug) {
                const settings = new Settings();
                const oldEffectItemIds = settings.effectItemIds ?? [];
                const oldBackupItemIds = game.items
                    .filter((item) => {
                        const backupId = item.getFlag(
                            MODULE_ID,
                            FLAGS.BACKUP_ID,
                        ) as string | undefined;

                        if (!backupId) return false;

                        return oldEffectItemIds.includes(backupId);
                    })
                    .map((item) => item.id);

                await Item.deleteDocuments(oldEffectItemIds);
                await Item.deleteDocuments(oldBackupItemIds);
                await settings.setEffectItemIds([]);
                await settings.clearRanMigrations();
            }

            const systemId = game.system.id;
            log(`System ID is ${systemId}`);
            const mapping = new Mapping();
            const systemDefinition = mapping.fetchMappingForSystemId(systemId);

            if (!systemDefinition) {
                log(`No system definition available for system ${systemId}`);
                return;
            }

            try {
                await systemDefinition.initialize();
            } catch (e: any) {
                log(
                    `Something went wrong while initializing system ${systemId}: ${e}`,
                );
            }
        });
    },
};

export { CreateEffects };
