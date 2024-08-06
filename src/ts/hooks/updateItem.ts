import { renderAppIfOpen } from "../ui/render-app-if-open.ts";
import { Flags } from "../utils/flags.ts";
import { Listener } from "./index.ts";

/**
 * Handles re-rendering the app if a convenient item is updated
 */
const UpdateItem: Listener = {
    listen(): void {
        Hooks.on("updateItem", (item: any, _data, _metadata, _userId) => {
            const itemType = item as Item<any>;

            if (Flags.isConvenient(itemType)) {
                renderAppIfOpen();
            }
        });
    },
};

export { UpdateItem };
