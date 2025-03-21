import { Listener } from "./index.ts";
import { Mapping } from "../effects/mapping.ts";
import { error } from "../logger.ts";
import { MODULE_ID } from "../constants.ts";

const CreateEffects: Listener = {
    listen(): void {
        Hooks.once(`${MODULE_ID}.createEffects`, async () => {
            // Ensure only a single GM will run initialization and migration if
            // multiple are logged in
            if (game.user !== game.users.activeGM) return;

            if (BUILD_MODE === "development") {
                await game.dfreds.effectInterface.resetSystemInitialization({
                    confirm: false,
                });
            }

            const mapping = new Mapping();
            const systemDefinition = mapping.findSystemDefinitionForSystemId();

            try {
                ui.notifications.info(`Initializing convenient effects...`);
                await systemDefinition?.effectDefinition?.initialize();
                ui.notifications.info(
                    `Finished initializing convenient effects`,
                );
            } catch (e: any) {
                ui.notifications.error(
                    `Something went wrong while initializing convenient effects`,
                );
                error(`Error while initializing convenient effects: ${e}`);
            }
        });
    },
};

export { CreateEffects };
