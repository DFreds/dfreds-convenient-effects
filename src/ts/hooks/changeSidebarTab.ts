import { removeConvenientItemsFromSidebar } from "../ui/remove-convenient-items-from-sidebar.ts";
import { Listener } from "./index.ts";

/**
 * Handle removing the convenient items from the item sidebar
 */
const ChangeSidebarTab: Listener = {
    listen(): void {
        Hooks.on("changeSidebarTab", (directory) => {
            if (!(directory instanceof ItemDirectory)) return;
            removeConvenientItemsFromSidebar(directory);
        });
    },
};

export { ChangeSidebarTab };
