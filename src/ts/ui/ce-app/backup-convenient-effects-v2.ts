import { findEffectByCeId, findFolder } from "../../utils/finds.ts";
import { getApi } from "../../utils/gets.ts";
import {
    BaseConvenientEffectsV2,
    ConvenientEffectsOptions,
} from "./base-convenient-effects-v2.ts";

const { DialogV2 } = foundry.applications.api;

class BackupConvenientEffectsV2 extends BaseConvenientEffectsV2 {
    static override DEFAULT_OPTIONS: DeepPartial<ConvenientEffectsOptions> = {
        id: "backup-convenient-effects-v2",
        window: {
            title: "ConvenientEffects.BackupAppName",
        },
        position: {
            width: 300,
            height: 600,
            top: 75,
            left: 125 + 300 + 18,
        },
        actions: {
            resetSystemEffects: BackupConvenientEffectsV2.#onResetSystemEffects,
        },
        convenientEffects: {
            backup: true,
        },
    };

    override _canCreateFolder(): boolean {
        return false;
    }

    override _getEntryContextOptions(): ContextMenuEntry[] {
        return [];
    }

    override _getFolderContextOptions(): ContextMenuEntry[] {
        return [
            {
                name: "SIDEBAR.Export",
                icon: '<i class="fa-solid fa-file-export"></i>',
                condition: (_header) => {
                    return game.user.isGM;
                },
                callback: (header) => {
                    const folderHtml = header.closest(
                        ".directory-item.folder",
                    ) as HTMLElement;
                    const folder = findFolder(
                        folderHtml.dataset.folderId ?? "",
                        {
                            backup: this.options.convenientEffects.backup,
                        },
                    );

                    folder?.exportToJSON();
                },
            },
        ];
    }

    override _canDragDrop(_selector: string): boolean {
        return game.user.isGM;
    }

    override _canDragStart(_selector: string): boolean {
        return game.user.isGM;
    }

    override _getEntryDragData(entryId: string): object {
        const effect = findEffectByCeId(entryId, {
            backup: this.options.convenientEffects.backup,
        });

        if (!effect) return {};

        return effect.toDragData();
    }

    override _onDragOver(_event: DragEvent): void {
        return;
    }

    override _onDrop(_event: DragEvent): void {
        return;
    }

    static async #onResetSystemEffects(...args: any[]): Promise<void> {
        const [event, target] = args as [PointerEvent, HTMLElement];
        const thisClass = this as unknown as BackupConvenientEffectsV2;
        return thisClass._onResetSystemEffects(event, target);
    }

    async _onResetSystemEffects(
        _event: PointerEvent,
        _target: HTMLElement,
    ): Promise<void> {
        const proceed = await DialogV2.confirm({
            window: {
                title: game.i18n.localize(
                    "ConvenientEffects.ResetSystemEffects",
                ),
            },
            content: `<strong>${game.i18n.localize("AreYouSure")}</strong><p>${game.i18n.localize("ConvenientEffects.ResetSystemEffectsWarning")}</p>`,
        });

        if (!proceed) return;

        await getApi().resetSystemInitialization();
    }
}

export { BackupConvenientEffectsV2 };
