import { id as MODULE_ID } from "@static/module.json";
import { FLAGS } from "../constants.ts";

interface FolderResolve {
    data: {
        name: string;
        color: string;
    };
    operation: "create" | "update" | "close";
}

async function getInputFromDialog({
    folder,
}: {
    folder?: Item<null> | null;
}): Promise<FolderResolve> {
    const color = folder?.id
        ? (folder.getFlag(MODULE_ID, FLAGS.FOLDER_COLOR) as string)
        : "";
    const content = await renderTemplate(
        "modules/dfreds-convenient-effects/templates/create-edit-folder-dialog.hbs",
        {
            name: folder?.id ? folder.name : "",
            color,
            newName: "Folder",
        },
    );

    return new Promise((resolve, _reject) => {
        const dialog = getFolderDialog({
            resolve,
            folder,
            content,
        });
        dialog.render(true);
    });
}

function getFolderDialog({
    resolve,
    folder,
    content,
}: {
    resolve: (value: FolderResolve | PromiseLike<FolderResolve>) => void;
    folder?: Item<null> | null;
    content: string;
}): Dialog {
    return new Dialog(
        {
            title: folder?.id
                ? `${game.i18n.localize("FOLDER.Update")}: ${folder.name}`
                : game.i18n.localize("FOLDER.Create"),
            content,
            close: (_html) => {
                resolve({
                    operation: "close",
                    data: {
                        name: "",
                        color: "",
                    },
                });
            },
            default: "ok",
            buttons: {
                ok: {
                    label: game.i18n.localize(
                        folder?.id ? "FOLDER.Update" : "FOLDER.Create",
                    ),
                    icon: '<i class="fas fa-check"></i>',
                    callback: (html) => {
                        const folderName = html
                            .find("input[name=name]")
                            .val() as string;
                        const color = html.find("color-picker").val() as string;

                        resolve({
                            data: {
                                name: folderName || "Folder",
                                color,
                            },
                            operation: folder?.id ? "update" : "create",
                        });
                    },
                },
            },
        },
        {
            //     classes: ["sheet", "folder-edit"],
            width: 360,
        },
    );
}

export { getInputFromDialog };
