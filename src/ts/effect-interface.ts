import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Settings } from "./settings.ts";
import {
    findActorByUuid,
    findEffectFolderItems,
    getActorUuids,
    isEffectConvenient,
} from "./helpers.ts";
import { log } from "./logger.ts";
import { SocketMessage } from "./sockets/sockets.ts";

interface IFindEffect {
    /**
     * The folder ID. If included, it will only search this folder
     */
    folderId?: string | null;

    /**
     * The effect ID
     */
    effectId?: string | null;

    /**
     * The effect name
     */
    effectName?: string | null;
}

interface IHasEffectApplied {
    /**
     * The effect ID
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
     * The effect ID
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
     * The ID of the effect to add. If defined, prioritized over `effectName` and
     * `effectData`.
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
     * The ID of the effect to remove. If defined, prioritized over `effectName`.
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
            .filter(
                (effect) =>
                    effect.id === effectId || effect.name === effectName,
            );

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
            actor?.effects?.some(
                (effect) =>
                    isEffectConvenient(effect) &&
                    (effect.id === effectId || effect.name === effectName) &&
                    !effect.disabled,
            ) ?? false
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
            // TODO more descriptive error?
            ui.notifications.error(
                `Please select or target a token to toggle this effect`,
            );
            return;
        }

        // TODO use promise.all?
        for (const uuid of actorUuids) {
            if (this.hasEffectApplied({ effectId, effectName, uuid })) {
                await this.removeEffect({ effectId, effectName, uuid, origin });
            } else {
                await this.addEffect({
                    effectId,
                    effectName,
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
        const effect = this.findEffect({ effectId, effectName });
        const effectDataToSend = effect?.toObject() ?? effectData;

        if (!effectDataToSend) {
            ui.notifications.error("Cannot find effect to add");
            return;
        }

        if (!findActorByUuid(uuid)) {
            ui.notifications.error(`Actor ${uuid} could not be found`);
            return;
        }

        // if (this.hasNestedEffects(effect) > 0) {
        //     effect = await this._getNestedEffectSelection(effect);
        //     if (!effect) return; // dialog closed without selecting one
        // }

        const coreFlags: DocumentFlags = {
            core: {
                overlay,
            },
        };
        effectDataToSend.flags = foundry.utils.mergeObject(
            effectDataToSend.flags ?? {},
            coreFlags,
        );

        if (origin) {
            effectDataToSend.origin = origin;
        }

        // TODO this needs to do any nested effects. Nested effects are handled by client

        game.dfreds.sockets.emitAddEffect({
            request: "addEffect",
            data: {
                effectData: effectDataToSend,
                uuid,
            },
        } satisfies SocketMessage);
    }

    // TODO is adding/removing effect by effect ID viable?
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
        if (!effectId && !effectName) {
            ui.notifications.error("Cannot find effect to remove");
            return;
        }

        if (!findActorByUuid(uuid)) {
            ui.notifications.error(`Actor ${uuid} could not be found`);
            return;
        }

        // TODO this needs to do any nested effects

        game.dfreds.sockets.emitRemoveEffect({
            request: "removeEffect",
            data: {
                effectId,
                effectName,
                uuid,
                origin,
            },
        } satisfies SocketMessage);
    }

    // TODO needs socket through GM probably?
    // async createNewEffects({ effects }: ICreateNewEffects): Promise<void> {}

    // TODO
    /**
     * Checks if the given effect has nested effects
     *
     * @param effect - the active effect to check the nested effects on
     * @returns true if the effect has a nested effect
     */
    // hasNestedEffects(effect: ActiveEffect<Item<null>>): boolean {
    //     const nestedEffects =
    //         effect.getFlag(MODULE_ID, FLAGS.NESTED_EFFECTS) ?? [];

    //     return nestedEffects.length > 0;
    // }

    // TODO should this be exposed in the interface?
    async resetMigrations(): Promise<void> {
        if (!game.user.isGM) return;

        const items = findEffectFolderItems();
        await Item.deleteDocuments(items.map((item) => item.id));

        // TODO how do we tell it to recreate the items?

        await this.#settings.clearRanMigrations();
    }

    // async #getNestedEffectSelection(effect: ActiveEffect<any>) {
    //     const nestedEffectNames =
    //         effect.getFlag(MODULE_ID, FLAGS.NESTED_EFFECTS) ?? [];
    //     const nestedEffects = nestedEffectNames
    //         .map((nestedEffect) =>
    //             game.dfreds.effectInterface.findEffectByName(nestedEffect),
    //         )
    //         .filter((effect) => effect !== undefined);

    //     const content = await renderTemplate(
    //         "modules/dfreds-convenient-effects/templates/nested-effects-dialog.hbs",
    //         { parentEffect: effect, nestedEffects },
    //     );
    //     const choice = await Dialog.prompt(
    //         {
    //             title: effect.name,
    //             content: content,
    //             label: "Select Effect",
    //             callback: (html) => {
    //                 const htmlChoice = html
    //                     .find('select[name="effect-choice"]')
    //                     .val();
    //                 return htmlChoice;
    //             },
    //             rejectClose: false,
    //         },
    //         { width: 300 },
    //     );

    //     return nestedEffects.find(
    //         (nestedEffect) => nestedEffect.name === choice,
    //     );
    // }
}

export { EffectInterface };
