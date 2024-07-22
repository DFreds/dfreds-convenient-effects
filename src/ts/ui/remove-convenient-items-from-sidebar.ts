import { DEBUG } from "../constants.ts";
import { findAllEffectFolderItems } from "../helpers.ts";

function removeConvenientItemsFromSidebar(
    directory: ItemDirectory<Item<null>>,
): void {
    const convenientItemIds = findAllEffectFolderItems().map((item) => item.id);

    if (!convenientItemIds) return;
    if (DEBUG) return;

    const html = directory.element;
    convenientItemIds.forEach((convenientItemId) => {
        const li = html.find(`li[data-document-id="${convenientItemId}"]`);
        li.remove();
    });
}

export { removeConvenientItemsFromSidebar };
