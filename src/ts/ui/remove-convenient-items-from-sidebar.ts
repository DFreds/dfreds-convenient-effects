import { DEBUG } from "../constants.ts";
import { findFolders } from "../utils/finds.ts";

function removeConvenientItemsFromSidebar(
    directory: ItemDirectory<Item<null>>,
): void {
    const folderIds = findFolders().map((folder) => folder.id);

    if (!folderIds) return;
    if (DEBUG) return;

    const html = directory.element;
    folderIds.forEach((convenientItemId) => {
        const li = html.find(`li[data-document-id="${convenientItemId}"]`);
        li.remove();
    });
}

export { removeConvenientItemsFromSidebar };
