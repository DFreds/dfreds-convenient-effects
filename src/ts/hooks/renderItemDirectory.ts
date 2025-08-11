import { ItemDirectory } from "@client/applications/sidebar/tabs/_module.mjs";
import { removeConvenientItemsFromSidebar } from "../ui/remove-convenient-items-from-sidebar.ts";
import { Listener } from "./index.ts";

/**
 * Handle removing the convenient items from the item sidebar
 */
const RenderItemDirectory: Listener = {
    listen(): void {
        Hooks.on(
            "renderItemDirectory",
            (directory: ItemDirectory<Item<null>>) => {
                removeConvenientItemsFromSidebar(directory);
            },
        );
    },
};

export { RenderItemDirectory };
