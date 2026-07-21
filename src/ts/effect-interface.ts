import { Settings } from "./settings.ts";
import {
    findAllEffects,
    findDocumentByUuid,
    findDocumentByUuidSync,
    findFolder,
    findFolders,
    findIncrementParentOf
} from "./utils/finds.ts";
import { getActorUuids } from "./utils/gets.ts";
import { error, log } from "./logger.ts";
import { Flags } from "./utils/flags.ts";
import { getNestedEffectSelection } from "./ui/nested-effect-selection-dialog.ts";
import { createConvenientEffect, createConvenientItem } from "./utils/creates.ts";
import { Sockets } from "./sockets/sockets.ts";
import Document from "@common/abstract/document.mjs";
import { ActiveEffectSource } from "@client/documents/_module.mjs";
import { MODULE_ID } from "./constants.ts";
import { Mapping } from "./effects/mapping.ts";

class EffectInterfaceImpl implements EffectInterface {
    #settings: Settings;
    #sockets: Sockets;

    constructor({ sockets }: { sockets: Sockets }) {
        this.#settings = new Settings();
        this.#sockets = sockets;
    }

    findEffects({ backup = false }: IFindEffects = {}): ActiveEffect<Item<null>>[] {
        return findAllEffects({ backup });
    }

    findEffect({ folderId, effectId, effectName, backup = false }: IFindEffect): ActiveEffect<Item<null>> | undefined {
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

                return isConvenient && (isMatchingId || isMatchingName || isMatchingCeId);
            });

        if (matchingEffects.length > 1) {
            log(`Found more than one matching effect for effectId: ${effectId} and effectName: ${effectName}`);
        }

        return matchingEffects[0];
    }

    hasEffectApplied({ effectId, effectName, uuid }: IHasEffectApplied): boolean {
        const document = findDocumentByUuidSync(uuid);

        return (
            document?.effects?.some((effect) => {
                const isConvenient = Flags.isConvenient(effect) ?? false;
                const isEnabled = !effect.disabled;
                const isMatchingId = effect.id === effectId;
                const isMatchingName = effect.name === effectName;
                const isMatchingCeId = Flags.getCeEffectId(effect) === effectId;

                return isConvenient && isEnabled && (isMatchingId || isMatchingName || isMatchingCeId);
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
        direction = 1,
    }: IToggleEffect): Promise<void> {
        let documentUuids = uuids;
        if (documentUuids.length === 0) {
            documentUuids = getActorUuids(prioritizeTargets);
        }

        if (documentUuids.length === 0) {
            ui.notifications.warn(`Please select or target a token to toggle this effect`);
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
            if (Flags.isUpdatesActor(effectDataToSend)) {
                await this.addEffect({
                    effectId: effectDataToSend._id ?? Flags.getCeEffectId(effectDataToSend),
                    effectName: effectDataToSend.name,
                    uuid,
                    origin,
                    direction,
                });
                continue;
            }

            // Generic increment parent: step through its ordered members client-side
            const incrementEffectIds = Flags.getIncrementEffectIds(effectDataToSend);
            if (incrementEffectIds && incrementEffectIds.length > 0) {
                await this.#stepIncrementChain({
                    parentData: effectDataToSend,
                    uuid,
                    direction,
                    origin,
                });
                continue;
            }

            // Generic increment member: jump to this level, or toggle it off if it is already applied
            const incrementParent = findIncrementParentOf(Flags.getCeEffectId(effectDataToSend), { backup: false });
            if (incrementParent && !Flags.isUpdatesActor(incrementParent)) {
                await this.#jumpIncrementMember({
                    parent: incrementParent,
                    memberData: effectDataToSend,
                    uuid,
                    origin,
                });
                continue;
            }

            const hasEffectApplied = this.hasEffectApplied({
                effectId: effectDataToSend._id ?? Flags.getCeEffectId(effectDataToSend),
                effectName: effectDataToSend.name,
                uuid,
            });

            if (hasEffectApplied) {
                await this.removeEffect({
                    effectId: effectDataToSend._id ?? Flags.getCeEffectId(effectDataToSend),
                    effectName: effectDataToSend.name,
                    uuid,
                    origin,
                });
            } else {
                await this.addEffect({
                    effectId: effectDataToSend._id ?? Flags.getCeEffectId(effectDataToSend),
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
        direction = 1,
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

        if (!Flags.isUpdatesActor(effectDataToSend)) {
            const incrementEffectIds = Flags.getIncrementEffectIds(effectDataToSend);
            if (incrementEffectIds && incrementEffectIds.length > 0) {
                await this.#stepIncrementChain({
                    parentData: effectDataToSend,
                    uuid,
                    direction,
                    origin,
                });
                return [];
            }
        }

        foundry.utils.setProperty(effectDataToSend, `flags.core.overlay`, overlay);

        if (origin) {
            effectDataToSend.origin = origin;
        }

        return (
            this.#sockets.emitAddEffect({
                effectData: effectDataToSend,
                uuid,
                direction,
            }) ?? []
        );
    }

    async removeEffect({ effectId, effectName, uuid, origin }: IRemoveEffect): Promise<void> {
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
            effectId: effectDataToSend._id ?? Flags.getCeEffectId(effectDataToSend),
            effectName: effectDataToSend.name,
            uuid,
            origin,
        });
    }

    async createNewEffects({ existingFolderId, newFolderData, effectsData }: ICreateNewEffects): Promise<void> {
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
            await existingFolder.createEmbeddedDocuments("ActiveEffect", newEffectsData);
        } else if (newFolderData) {
            const newFolder = await Item.create(
                createConvenientItem({
                    item: newFolderData,
                }),
            );

            await newFolder?.createEmbeddedDocuments("ActiveEffect", newEffectsData);
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

    async resetBackupEffects(): Promise<void> {
        if (!game.user.isGM) return;

        const backupConvenientEffectsV2 = foundry.applications.instances.get("backup-convenient-effects-v2");
        if (backupConvenientEffectsV2) {
            await backupConvenientEffectsV2.close();
        }

        const backupFolders = findFolders({ backup: true });
        await Item.deleteDocuments(backupFolders.map((item) => item.id));

        const systemDefinition = new Mapping().findSystemDefinitionForSystemId();
        await systemDefinition?.effectDefinition?.createItemsAndEffects({ backup: true });

        if (systemDefinition?.effectDefinition) {
            await this.#settings.setBackupEffectsVersion(systemDefinition.effectDefinition.version);
        }
    }

    async #stepIncrementChain({
        parentData,
        uuid,
        direction,
        origin,
    }: {
        parentData: PreCreate<ActiveEffectSource>;
        uuid: string;
        direction: 1 | -1;
        origin?: ActiveEffectOrigin | null;
    }): Promise<void> {
        const memberIds = Flags.getIncrementEffectIds(parentData) ?? [];
        if (memberIds.length === 0) return;

        const lastIndex = memberIds.length - 1;
        const appliedIndex = memberIds.findIndex((memberId) => this.hasEffectApplied({ effectId: memberId, uuid }));

        if (direction === 1) {
            if (appliedIndex === -1) {
                await this.addEffect({ effectId: memberIds[0], uuid, origin });
            } else if (appliedIndex < lastIndex) {
                await this.removeEffect({ effectId: memberIds[appliedIndex], uuid });
                await this.addEffect({ effectId: memberIds[appliedIndex + 1], uuid, origin });
            }
        } else {
            if (appliedIndex > 0) {
                await this.removeEffect({ effectId: memberIds[appliedIndex], uuid });
                await this.addEffect({ effectId: memberIds[appliedIndex - 1], uuid, origin });
            } else if (appliedIndex === 0) {
                await this.removeEffect({ effectId: memberIds[0], uuid });
            }
        }
    }

    async #jumpIncrementMember({
        parent,
        memberData,
        uuid,
        origin,
    }: {
        parent: ActiveEffect<any>;
        memberData: PreCreate<ActiveEffectSource>;
        uuid: string;
        origin?: ActiveEffectOrigin | null;
    }): Promise<void> {
        const memberCeId = Flags.getCeEffectId(memberData);
        if (!memberCeId) return;

        if (this.hasEffectApplied({ effectId: memberCeId, uuid })) {
            await this.removeEffect({ effectId: memberCeId, uuid });
            return;
        }

        const memberIds = Flags.getIncrementEffectIds(parent) ?? [];
        for (const siblingId of memberIds) {
            if (siblingId !== memberCeId && this.hasEffectApplied({ effectId: siblingId, uuid })) {
                await this.removeEffect({ effectId: siblingId, uuid });
            }
        }

        await this.addEffect({ effectId: memberCeId, uuid, origin });
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
                effectDataToSend = await getNestedEffectSelection(effectDataToSend);
            }
        }

        return effectDataToSend;
    }
}

export { EffectInterfaceImpl as EffectInterface };
