import { Settings } from "./settings.ts";
import {
    findDocumentByUuidSync,
    findAllEffects,
    findFolder,
    findFolders,
    findDocumentByUuid,
} from "./utils/finds.ts";
import { getActorUuids } from "./utils/gets.ts";
import { error, log } from "./logger.ts";
import { Flags } from "./utils/flags.ts";
import { getNestedEffectSelection } from "./ui/nested-effect-selection-dialog.ts";
import {
    createConvenientEffect,
    createConvenientItem,
} from "./utils/creates.ts";
import { Sockets } from "./sockets/sockets.ts";
import Document from "@common/abstract/document.mjs";
import { ActiveEffectSource } from "@client/documents/_module.mjs";
import { MODULE_ID } from "./constants.ts";

class EffectInterfaceImpl implements EffectInterface {
    #settings: Settings;
    #sockets: Sockets;

    constructor({ sockets }: { sockets: Sockets }) {
        this.#settings = new Settings();
        this.#sockets = sockets;
    }

    findEffects({ backup = false }: IFindEffects = {}): ActiveEffect<
        Item<null>
    >[] {
        return findAllEffects({ backup });
    }

    findEffect({
        folderId,
        effectId,
        effectName,
        backup = false,
    }: IFindEffect): ActiveEffect<Item<null>> | undefined {
        const folders = findFolders({ backup });

        if (!folders) return;

        const matchingEffects = folders
            .filter((folder) =>
                // If folderId is included, filter all but that ID
                folderId ? folder.id === folderId : true,
            )
            .flatMap((effectItem) => Array(...effectItem.effects))
            .map((effect) => effect as ActiveEffect<Item<null>>)
            .filter((effect) => {
                const isConvenient = Flags.isConvenient(effect);
                const isMatchingId = effect.id === effectId;
                const isMatchingCeId = Flags.getCeEffectId(effect) === effectId;
                const isMatchingName = effect.name === effectName;

                return (
                    isConvenient &&
                    (isMatchingId || isMatchingName || isMatchingCeId)
                );
            });

        if (matchingEffects.length > 1) {
            log(
                `Found more than one matching effect for effectId: ${effectId} and effectName: ${effectName}`,
            );
        }

        return matchingEffects[0];
    }

    hasEffectApplied({
        effectId,
        effectName,
        uuid,
    }: IHasEffectApplied): boolean {
        const document = findDocumentByUuidSync(uuid);

        return (
            document?.effects?.some((effect) => {
                const isConvenient = Flags.isConvenient(effect);
                const isEnabled = !effect.disabled;
                const isMatchingId = effect.id === effectId;
                const isMatchingName = effect.name === effectName;
                const isMatchingCeId = Flags.getCeEffectId(effect) === effectId;

                return (
                    isConvenient &&
                    isEnabled &&
                    (isMatchingId || isMatchingName || isMatchingCeId)
                );
            }) ?? false
        );
    }

    async toggleEffect({
        effectId,
        effectName,
        uuids = [],
        overlay = false,
        prioritizeTargets = false,
        origin,
    }: IToggleEffect): Promise<void> {
        let documentUuids = uuids;
        if (documentUuids.length === 0) {
            documentUuids = getActorUuids(prioritizeTargets);
        }

        if (documentUuids.length === 0) {
            ui.notifications.warn(
                `Please select or target a token to toggle this effect`,
            );
            return;
        }

        const effectDataToSend = await this.#getEffectDataToSend({
            effectId,
            effectName,
        });

        if (!effectDataToSend) {
            error("Cannot find effect to toggle");
            return;
        }

        for (const uuid of documentUuids) {
            const hasEffectApplied = this.hasEffectApplied({
                effectId:
                    effectDataToSend._id ??
                    Flags.getCeEffectId(effectDataToSend),
                effectName: effectDataToSend.name,
                uuid,
            });

            if (hasEffectApplied) {
                await this.removeEffect({
                    effectId:
                        effectDataToSend._id ??
                        Flags.getCeEffectId(effectDataToSend),
                    effectName: effectDataToSend.name,
                    uuid,
                    origin,
                });
            } else {
                await this.addEffect({
                    effectId:
                        effectDataToSend._id ??
                        Flags.getCeEffectId(effectDataToSend),
                    effectName: effectDataToSend.name,
                    uuid,
                    overlay,
                    origin,
                });
            }
        }
    }

    async addEffect({
        effectId,
        effectName,
        effectData,
        uuid,
        overlay = false,
        origin,
    }: IAddEffect): Promise<Document[]> {
        const effectDataToSend = await this.#getEffectDataToSend({
            effectId,
            effectName,
            effectData,
        });

        if (!effectDataToSend) {
            error("Cannot find effect to add");
            return [];
        }

        const document = await findDocumentByUuid(uuid);
        if (!document) {
            error(`Document ${uuid} could not be found`);
            return [];
        }

        foundry.utils.setProperty(
            effectDataToSend,
            `flags.core.overlay`,
            overlay,
        );

        if (origin) {
            effectDataToSend.origin = origin;
        }

        return (
            this.#sockets.emitAddEffect({
                effectData: effectDataToSend,
                uuid,
            }) ?? []
        );
    }

    async removeEffect({
        effectId,
        effectName,
        uuid,
        origin,
    }: IRemoveEffect): Promise<void> {
        const effectDataToSend = await this.#getEffectDataToSend({
            effectId,
            effectName,
        });

        if (!effectDataToSend) {
            error("Cannot find effect to remove");
            return;
        }

        const document = await findDocumentByUuid(uuid);
        if (!document) {
            error(`Document ${uuid} could not be found`);
            return;
        }

        return this.#sockets.emitRemoveEffect({
            effectId:
                effectDataToSend._id ?? Flags.getCeEffectId(effectDataToSend),
            effectName: effectDataToSend.name,
            uuid,
            origin,
        });
    }

    async createNewEffects({
        existingFolderId,
        newFolderData,
        effectsData,
    }: ICreateNewEffects): Promise<void> {
        if (!game.user.isGM) return;

        if (!existingFolderId && !newFolderData) {
            error(
                `Either an existing folder ID or new folder data need to be
                defined to create effects`,
            );
            return;
        }

        const newEffectsData = effectsData.map((effect) => {
            return createConvenientEffect({ effect });
        });

        const existingFolder = findFolder(existingFolderId ?? "", {
            backup: false,
        });

        if (existingFolder) {
            await existingFolder.createEmbeddedDocuments(
                "ActiveEffect",
                newEffectsData,
            );
        } else if (newFolderData) {
            const newFolder = await Item.create(
                createConvenientItem({
                    item: newFolderData,
                }),
            );

            await newFolder?.createEmbeddedDocuments(
                "ActiveEffect",
                newEffectsData,
            );
        }
    }

    async resetSystemInitialization({
        confirm = true,
    }: {
        confirm?: boolean;
    } = {}): Promise<void> {
        if (!game.user.isGM) return;

        const folders = findFolders({ backup: false });
        await Item.deleteDocuments(folders.map((item) => item.id));

        const backupFolders = findFolders({ backup: true });
        await Item.deleteDocuments(backupFolders.map((item) => item.id));

        await this.#settings.setHasInitialized(false);
        await migrations.clearAllRan({ moduleId: MODULE_ID });

        if (confirm) {
            // @ts-expect-error Complains about failed to resolve module specifier
            await SettingsConfig.reloadConfirm({ world: false });
        }
    }

    async #getEffectDataToSend({
        effectId,
        effectName,
        effectData,
    }: {
        effectId?: string | null;
        effectName?: string | null;
        effectData?: PreCreate<ActiveEffectSource>;
    }): Promise<PreCreate<ActiveEffectSource> | undefined> {
        const effect = this.findEffect({ effectId, effectName });
        let effectDataToSend = effect?.toObject() ?? effectData;

        if (effectDataToSend) {
            const nestedEffectIds = Flags.getNestedEffectIds(effectDataToSend);
            if (nestedEffectIds && nestedEffectIds.length > 0) {
                effectDataToSend =
                    await getNestedEffectSelection(effectDataToSend);
            }
        }

        return effectDataToSend;
    }
}

export { EffectInterfaceImpl as EffectInterface };
