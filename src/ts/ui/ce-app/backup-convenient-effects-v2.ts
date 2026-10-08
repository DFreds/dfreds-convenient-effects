import { ApplicationConfiguration } from "@client/applications/_types.mjs";
import { findEffectByCeId, findFolder } from "../../utils/finds.ts";
import { getApi } from "../../utils/gets.ts";
import { ContextMenuEntry } from "@client/applications/ux/context-menu.mjs";
import { ConvenientDirectoryMixin } from "./convenient-directory-mixin.ts";

const { ApplicationV2, DialogV2 } = foundry.applications.api;

class BackupConvenientEffectsV2 extends ConvenientDirectoryMixin(ApplicationV2) {
    readonly isBackup = true;

    static override DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration> = {
        id: "backup-convenient-effects-v2",
        tag: "section",
        classes: ["tab", "sidebar-tab", "directory", "flexcol", "sidebar-popout", "convenient-effects-app"],
        window: {
            title: "ConvenientEffects.BackupAppName",
            icon: "fa-solid fa-hand-sparkles",
            resizable: true,
            minimizable: true,
        },
        position: {
            width: 300,
            height: 600,
        },
        actions: {
            resetSystemEffects: BackupConvenientEffectsV2.#onResetSystemEffects,
        },
    };

    _getEntryContextOptions(): ContextMenuEntry[] {
        return [];
    }

    _getFolderContextOptions(): ContextMenuEntry[] {
        return [
            {
                label: "SIDEBAR.Export",
                icon: '<i class="fa-solid fa-file-export"></i>',
                visible: (_html: HTMLElement) => {
                    return game.user.isGM;
                },
                onClick: (_event: PointerEvent, target: HTMLElement) => {
                    const folderHtml = target.closest(".directory-item.folder") as HTMLElement;
                    const folder = findFolder(folderHtml.dataset.folderId ?? "", {
                        backup: this.isBackup,
                    });

                    folder?.exportToJSON();
                },
            },
        ];
    }

    _canDragDrop(_selector: string): boolean {
        return game.user.isGM;
    }

    _canDragStart(_selector: string): boolean {
        return game.user.isGM;
    }

    _getEntryDragData(entryId: string): object {
        const effect = findEffectByCeId(entryId, {
            backup: this.isBackup,
        });

        if (!effect) return {};

        return effect.toDragData();
    }

    static async #onResetSystemEffects(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as BackupConvenientEffectsV2;
        return thisClass._onResetSystemEffects(event, target);
    }

    async _onResetSystemEffects(_event: PointerEvent, _target: HTMLElement): Promise<void> {
        const proceed = await DialogV2.confirm({
            window: {
                title: game.i18n.localize("ConvenientEffects.ResetSystemEffects"),
            },
            content: `<strong>${game.i18n.localize("AreYouSure")}</strong><p>${game.i18n.localize("ConvenientEffects.ResetSystemEffectsWarning")}</p>`,
        });

        if (!proceed) return;

        await getApi().resetSystemInitialization();
    }
}

export { BackupConvenientEffectsV2 };
