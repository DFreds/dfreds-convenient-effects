import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Settings } from "./settings.ts";
import {
    findActorByUuid,
    findActorByUuidSync,
    findAllEffects,
    findFolder,
    findFolders,
} from "./utils/finds.ts";
import { getActorUuids } from "./utils/gets.ts";
import { error, log } from "./logger.ts";
import { Flags } from "./utils/flags.ts";
import { getNestedEffectSelection } from "./ui/nested-effect-selection-dialog.ts";
import { ItemSource } from "types/foundry/common/documents/item.js";
import {
    createConvenientEffect,
    createConvenientItem,
} from "./utils/creates.ts";
import Document from "types/foundry/common/abstract/document.js";

interface IFindEffects {
    /**
     * If the find should look at the backup items. Defaults to false
     */
    backup?: boolean;
}

interface IFindEffect {
    /**
     * The foundry folder (item) ID. If included, it will only search this
     * folder
     */
    folderId?: string | null;

    /**
     * The foundry effect ID or the CE effect ID
     */
    effectId?: string | null;

    /**
     * The effect name
     */
    effectName?: string | null;

    /**
     * If the find should look at the backup items. Defaults to false
     */
    backup?: boolean;
}

interface IHasEffectApplied {
    /**
     * The foundry effect ID or the CE effect ID
     */
    effectId?: string;

    /**
     * The effect name
     */
    effectName?: string;

    /**
     * The UUID of the actor
     */
    uuid: string;
}

interface IToggleEffect {
    /**
     * The foundry effect ID or the CE effect ID
     */
    effectId?: string;

    /**
     * The effect name
     */
    effectName?: string;

    /**
     * The UUIDs of the actors. Set to an empty array by default
     */
    uuids?: string[];

    /**
     * Applies the effect as an overlay or not. Set to false by default
     */
    overlay?: boolean;

    /**
     * Toggles effects on targets over selected tokens if set to true. Set to
     * false by default.
     */
    prioritizeTargets?: boolean;

    /**
     * The origin of the effect. If toggling off, it will only remove the effect
     * if the origin matches.
     */
    origin?: ActiveEffectOrigin | null;
}

interface IAddEffect {
    /**
     * The foundry effect ID or the CE effect ID. If defined, prioritized over
     * `effectName` and `effectData`.
     */
    effectId?: string;

    /**
     * The name of the effect to add. If defined, prioritized over
     * `effectData`.
     */
    effectName?: string;

    /**
     * The effect data to add. This is used to apply an effect that is NOT
     * already defined.
     */
    effectData?: PreCreate<ActiveEffectSource>;

    /**
     * The UUID of the actor
     */
    uuid: string;

    /**
     * Applies the effect as an overlay or not. Set to false by default.
     */
    overlay?: boolean;

    /**
     * The origin of the effect
     */
    origin?: ActiveEffectOrigin | null;
}

interface IRemoveEffect {
    /**
     * The foundry effect ID or the CE effect ID to remove. If defined,
     * prioritized over `effectName`
     */
    effectId?: string;

    /**
     * The name of the effect to remove
     */
    effectName?: string;

    /**
     * The UUID of the actor
     */
    uuid: string;

    /**
     * The origin of the effect. If defined, only removes the effect if the
     * origin matches
     */
    origin?: ActiveEffectOrigin | null;
}

interface ICreateNewEffects {
    /**
     * The ID of the existing folder to add the effects to. If defined,
     * prioritized over `folder`
     */
    existingFolderId?: string;

    /**
     * The folder to add the effects to
     */
    newFolderData?: PreCreate<ItemSource>;

    /**
     * The effects to create
     */
    effectsData: PreCreate<ActiveEffectSource>[];
}

class EffectInterface {
    #settings: Settings;

    constructor() {
        this.#settings = new Settings();
    }

    /**
     * Finds all defined effects
     *
     * @param params - The parameters to find effects
     * @returns The list of active effects
     */
    findEffects({ backup = false }: IFindEffects = {}): ActiveEffect<
        Item<null>
    >[] {
        return findAllEffects({ backup });
    }

    /**
     * Searches through the list of available effects and returns one matching
     * either the effect ID or effect name.
     *
     * @param params - The parameters to find the effect
     * @returns The active effect or undefined if it can't be found
     */
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

    /**
     * Checks to see if any of the current active effects applied to the actor
     * with the given UUID match the effect ID or name and are a convenient
     * effect
     *
     * @param options - The options to determine if the effect is applied
     * @returns true if the effect is applied to the actor and is a convenient
     * effect, false otherwise
     */
    hasEffectApplied({
        effectId,
        effectName,
        uuid,
    }: IHasEffectApplied): boolean {
        const actor = findActorByUuidSync(uuid);

        return (
            actor?.effects?.some((effect) => {
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

    /**
     * Toggles the effect on the provided actor UUIDS as the GM via sockets. If
     * no actor UUIDs are provided, it finds one of these in this priority:
     *
     * 1. The targeted tokens (if prioritize targets is enabled)
     * 2. The currently selected tokens on the canvas
     * 3. The user configured character
     *
     * @param options - the options for toggling an effect
     * @returns A promise that resolves when all effects are added
     */
    async toggleEffect({
        effectId,
        effectName,
        uuids = [],
        overlay = false,
        prioritizeTargets = false,
        origin,
    }: IToggleEffect): Promise<void> {
        let actorUuids = uuids;
        if (actorUuids.length === 0) {
            actorUuids = getActorUuids(prioritizeTargets);
        }

        if (actorUuids.length === 0) {
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

        for (const uuid of actorUuids) {
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

    /**
     * Adds an effect matching the given params to the actor of the given UUID.
     * The effect adding is sent via a socket.
     *
     * @param options - the options for adding an effect
     * @returns A promise that resolves when the effect is sent via the socket
     */
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

        const actor = await findActorByUuid(uuid);
        if (!actor) {
            error(`Actor ${uuid} could not be found`);
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

        return game.dfreds.sockets.emitAddEffect({
            effectData: effectDataToSend,
            uuid,
        });
    }

    /**
     * Removes an effect matching the given params from an actor of the given
     * UUID. The effect removal is sent via a socket.
     *
     * @param options - the options for removing an effect
     * @returns A promise that resolves when the removal request is sent via the
     * socket
     */
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

        const actor = await findActorByUuid(uuid);
        if (!actor) {
            error(`Actor ${uuid} could not be found`);
            return;
        }

        return game.dfreds.sockets.emitRemoveEffect({
            effectId:
                effectDataToSend._id ?? Flags.getCeEffectId(effectDataToSend),
            effectName: effectDataToSend.name,
            uuid,
            origin,
        });
    }

    /**
     * Creates effects on either an existing folder with `folderId` or on a new
     * folder using the data provided by `folder`.
     *
     * @param options - the options for creating effects
     * @returns A promise that resolves when the effect creation is complete
     */
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

    /**
     * Completely resets the world, re-initializing all effects and re-running
     * migrations after the forced reload.
     *
     * @returns A promise that resolves when the reset is complete
     */
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
        await this.#settings.clearRanMigrations();

        if (confirm) {
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

export { EffectInterface };
