import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Settings } from "./settings.ts";
import { findActorByUuid, findEffectFolderItems } from "./utils/finds.ts";
import { getActorUuids } from "./utils/gets.ts";
import { log } from "./logger.ts";
import { SocketMessage } from "./sockets/sockets.ts";
import { Flags } from "./utils/flags.ts";
import { getNestedEffectSelection } from "./ui/nested-effect-selection-dialog.ts";

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

// TODO
// interface ICreateNewEffects {
//     /**
//      * The effects to create
//      */
//     effects: PreCreate<ActiveEffectSource>[];
// }

class EffectInterface {
    #settings: Settings;

    constructor() {
        this.#settings = new Settings();
    }

    // TODO needs socket through GM probably
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
    }: IFindEffect): ActiveEffect<Item<null>> | undefined {
        const effectItems = findEffectFolderItems();

        if (!effectItems) return undefined;

        const matchingEffects = effectItems
            .filter((effectItem) =>
                // If folderId is included, filter all but that ID
                folderId ? effectItem.id === folderId : true,
            )
            .flatMap((effectItem) => Array(...effectItem.effects))
            .map((effect) => effect as ActiveEffect<Item<null>>)
            .filter((effect) => {
                const isConvenient = Flags.isConvenient(effect);
                const isMatchingId = effect.id === effectId;
                const isMatchingName = effect.name === effectName;
                const isMatchingCeId = Flags.getCeEffectId(effect) === effectId;

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
        const actor = findActorByUuid(uuid);

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
            ui.notifications.error(
                `Please select or target a token to toggle this effect`,
            );
            return;
        }

        const effectDataToSend = await this.#getEffectDataToSend({
            effectId,
            effectName,
        });

        if (!effectDataToSend) {
            ui.notifications.error("Cannot find effect to toggle");
            return;
        }

        for (const uuid of actorUuids) {
            if (
                this.hasEffectApplied({
                    effectId:
                        effectDataToSend._id ??
                        Flags.getCeEffectId(effectDataToSend),
                    effectName: effectDataToSend.name,
                    uuid,
                })
            ) {
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
    }: IAddEffect): Promise<void> {
        const effectDataToSend = await this.#getEffectDataToSend({
            effectId,
            effectName,
            effectData,
        });

        if (!effectDataToSend) {
            ui.notifications.error("Cannot find effect to add");
            return;
        }

        if (!findActorByUuid(uuid)) {
            ui.notifications.error(`Actor ${uuid} could not be found`);
            return;
        }

        foundry.utils.setProperty(
            effectDataToSend,
            `flags.core.overlay`,
            overlay,
        );

        if (origin) {
            effectDataToSend.origin = origin;
        }

        game.dfreds.sockets.emitAddEffect({
            request: "addEffect",
            data: {
                effectData: effectDataToSend,
                uuid,
            },
        } satisfies SocketMessage);
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
            ui.notifications.error("Cannot find effect to remove");
            return;
        }

        if (!findActorByUuid(uuid)) {
            ui.notifications.error(`Actor ${uuid} could not be found`);
            return;
        }

        game.dfreds.sockets.emitRemoveEffect({
            request: "removeEffect",
            data: {
                effectId:
                    effectDataToSend._id ??
                    Flags.getCeEffectId(effectDataToSend),
                effectName: effectDataToSend.name,
                uuid,
                origin,
            },
        } satisfies SocketMessage);
    }

    // TODO needs socket through GM probably?
    // async createNewEffects({ effects }: ICreateNewEffects): Promise<void> {}

    // TODO should this be exposed in the interface?
    async resetMigrations(): Promise<void> {
        if (!game.user.isGM) return;

        const items = findEffectFolderItems();
        await Item.deleteDocuments(items.map((item) => item.id));

        // TODO how do we tell it to recreate the items?

        await this.#settings.clearRanMigrations();
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

        if (
            effectDataToSend &&
            Flags.getNestedEffects(effectDataToSend).length > 0
        ) {
            effectDataToSend = await getNestedEffectSelection(effectDataToSend);
        }

        return effectDataToSend;
    }
}

export { EffectInterface };
