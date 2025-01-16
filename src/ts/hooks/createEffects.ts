import { Listener } from "./index.ts";
import { Mapping } from "../effects/mapping.ts";
import { log } from "../logger.ts";
import { DEBUG, MODULE_ID } from "../constants.ts";

const CreateEffects: Listener = {
    listen(): void {
        Hooks.once(`${MODULE_ID}.createEffects`, async () => {
            // Ensure only a single GM will run initialization and migration if
            // multiple are logged in
            if (game.user !== game.users.activeGM) return;

            if (DEBUG) {
                await game.dfreds.effectInterface.resetSystemInitialization({
                    confirm: false,
                });
            }

            const mapping = new Mapping();
            const systemDefinition = mapping.findSystemDefinitionForSystemId();

            try {
                await systemDefinition?.effectDefinition?.initialize();
            } catch (e: any) {
                log(
                    `Something went wrong while initializing system ${game.system.id}: ${e}`,
                );
            }
        });
    },
};

export { CreateEffects };
