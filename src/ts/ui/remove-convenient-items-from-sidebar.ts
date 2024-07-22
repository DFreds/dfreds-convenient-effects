import { id as MODULE_ID } from "@static/module.json";
import { FLAGS, DEBUG } from "../constants.ts";

function removeConvenientItemsFromSidebar(
    directory: ItemDirectory<Item<null>>,
): void {
    const convenientItemIds = game.items
        .filter((item) => {
            return item.getFlag(MODULE_ID, FLAGS.IS_CONVENIENT) as boolean;
        })
        .map((item) => item.id);

    if (!convenientItemIds) return;
    if (DEBUG) return;

    const html = directory.element;
    convenientItemIds.forEach((convenientItemId) => {
        const li = html.find(`li[data-document-id="${convenientItemId}"]`);
        li.remove();
    });
}

export { removeConvenientItemsFromSidebar };
