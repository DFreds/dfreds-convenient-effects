import { id as MODULE_ID } from "@static/module.json";
import { Listener } from "./index.ts";
import { Mapping } from "../effects/mapping.ts";
import { log } from "../logger.ts";

const CreateEffects: Listener = {
    listen(): void {
        Hooks.on(`${MODULE_ID}.createEffects`, async () => {
            if (!game.user.isGM) return; // Only allow connected GMs to do this

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
