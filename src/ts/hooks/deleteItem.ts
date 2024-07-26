import {
    isItemConvenient,
    renderConvenientEffectsAppIfOpen,
} from "../helpers.ts";
import { Listener } from "./index.ts";

/**
 * Handles re-rendering the app if a convenient item is deleted
 */
const DeleteItem: Listener = {
    listen(): void {
        Hooks.on("deleteItem", (item: any, _metadata, userId) => {
            if (game.user.id !== userId) return;

            const itemType = item as Item<any>;

            if (isItemConvenient(itemType)) {
                renderConvenientEffectsAppIfOpen();
            }
        });
    },
};

export { DeleteItem };
