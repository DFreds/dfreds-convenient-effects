import { renderConvenientEffectsAppIfOpen } from "../helpers.ts";
import { Flags } from "../utils/flags.ts";
import { Listener } from "./index.ts";

/**
 * Handles re-rendering the app if a convenient item is created
 */
const CreateItem: Listener = {
    listen(): void {
        Hooks.on("createItem", (item: any, _metadata, _userId) => {
            const itemType = item as Item<any>;

            if (Flags.isConvenient(itemType)) {
                renderConvenientEffectsAppIfOpen();
            }
        });
    },
};

export { CreateItem };
