import { renderAppIfOpen } from "../ui/render-app-if-open.ts";
import { Flags } from "../utils/flags.ts";
import { Listener } from "./index.ts";

/**
 * Handles re-rendering the app if a convenient item is created
 */
const CreateItem: Listener = {
    listen(): void {
        Hooks.on("createItem", (item: any, _metadata: any, _userId: any) => {
            const itemType = item as Item<any>;

            if (Flags.isConvenient(itemType)) {
                renderAppIfOpen();
            }
        });
    },
};

export { CreateItem };
