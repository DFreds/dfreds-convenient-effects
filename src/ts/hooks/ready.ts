import { MODULE_ID } from "../constants.ts";
import { Mapping } from "../effects/mapping.ts";
import { error } from "../logger.ts";
import { Listener } from "./index.ts";
import { renderApp } from "../ui/render-app-if-open.ts";

/**
 * Handle creating the Item that will hold the effects
 */
const Ready: Listener = {
    listen(): void {
        Hooks.once("ready", async () => {
            if (game.user !== game.users.activeGM) return;

            const mapping = new Mapping();
            const systemDefinition = mapping.findSystemDefinitionForSystemId();

            try {
                await systemDefinition?.effectDefinition?.initialize();
                Hooks.callAll(`${MODULE_ID}.ready`);
                renderApp();
            } catch (e: any) {
                ui.notifications.error(
                    `Something went wrong while initializing convenient effects`,
                );
                error(`Error while initializing convenient effects: ${e}`);
            }
        });
    },
};

export { Ready };
