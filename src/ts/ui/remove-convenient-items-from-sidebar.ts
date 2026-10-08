import { ItemDirectory } from "@client/applications/sidebar/tabs/_module.mjs";
import { findFolders } from "../utils/finds.ts";

function removeConvenientItemsFromSidebar(directory: ItemDirectory<Item<null>>): void {
    if (BUILD_MODE === "development") return;

    const folderIds = [...findFolders({ backup: false }), ...findFolders({ backup: true })].map((folder) => folder.id);

    for (const folderId of folderIds) {
        directory.element.querySelector(`li[data-entry-id="${folderId}"]`)?.remove();
    }
}

export { removeConvenientItemsFromSidebar };
