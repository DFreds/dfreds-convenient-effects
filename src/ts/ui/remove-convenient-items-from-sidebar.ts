import { ItemDirectory } from "@client/applications/sidebar/tabs/_module.mjs";
import { findFolders } from "../utils/finds.ts";

function removeConvenientItemsFromSidebar(
    directory: ItemDirectory<Item<null>>,
): void {
    const nonBackupFolders = findFolders({ backup: false }).map(
        (folder) => folder.id,
    );
    const backupFolderIds = findFolders({ backup: true }).map(
        (folder) => folder.id,
    );

    const folderIds = [...nonBackupFolders, ...backupFolderIds];

    if (!folderIds) return;
    if (BUILD_MODE === "development") return;

    const $html = $(directory.element);
    folderIds.forEach((convenientItemId) => {
        const $li = $html.find(`li[data-entry-id="${convenientItemId}"]`);
        $li.remove();
    });
}

export { removeConvenientItemsFromSidebar };
