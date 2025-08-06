import Document from "types/foundry/common/abstract/document.js";

export {};

declare global {
    interface ConvenientEffectsModule extends Module {
        api: EffectInterface;
    }

    type ActiveEffectOrigin =
        | `Actor.${string}`
        | `Scene.${string}.Token.${string}.Actor.${string}`
        | `Compendium.${string}.Actor.${string}`
        | `Item.${string}`
        | `Compendium.${string}.Item.${string}`;

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
         * The UUID of the document
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
         * The UUIDs of the documents. Set to an empty array by default
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
         * The UUID of the document
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
         * The UUID of the document
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

    export interface EffectInterface {
        /**
         * Finds all defined effects
         *
         * @param params - The parameters to find effects
         * @returns The list of active effects
         */
        findEffects({ backup = false }: IFindEffects = {}): ActiveEffect<
            Item<null>
        >[];

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
        }: IFindEffect): ActiveEffect<Item<null>> | undefined;

        /**
         * Checks to see if any of the current active effects applied to the document
         * with the given UUID match the effect ID or name and are a convenient
         * effect
         *
         * @param params - The parameters to determine if the effect is applied
         * @returns true if the effect is applied to the document and is a convenient
         * effect, false otherwise
         */
        hasEffectApplied({
            effectId,
            effectName,
            uuid,
        }: IHasEffectApplied): boolean;

        /**
         * Toggles the effect on the provided document UUIDs as the GM via sockets. If
         * no document UUIDs are provided, it finds one of these in this priority:
         *
         * 1. The targeted tokens (if prioritize targets is enabled)
         * 2. The currently selected tokens on the canvas
         * 3. The user configured character
         *
         * @param params - the parameters for toggling an effect
         * @returns A promise that resolves when all effects are added
         */
        toggleEffect({
            effectId,
            effectName,
            uuids = [],
            overlay = false,
            prioritizeTargets = false,
            origin,
        }: IToggleEffect): Promise<void>;

        /**
         * Adds an effect matching the given params to the document of the given UUID.
         * The effect adding is sent via a socket.
         *
         * @param params - the parameters for adding an effect
         * @returns A promise that resolves when the effect is sent via the socket
         */
        addEffect({
            effectId,
            effectName,
            effectData,
            uuid,
            overlay = false,
            origin,
        }: IAddEffect): Promise<Document[]>;

        /**
         * Removes an effect matching the given params from a document of the given
         * UUID. The effect removal is sent via a socket.
         *
         * @param params - the parameters for removing an effect
         * @returns A promise that resolves when the removal request is sent via the
         * socket
         */
        removeEffect({
            effectId,
            effectName,
            uuid,
            origin,
        }: IRemoveEffect): Promise<void>;

        /**
         * Creates effects on either an existing folder with `folderId` or on a new
         * folder using the data provided by `folder`.
         *
         * @param params - the parameters for creating effects
         * @returns A promise that resolves when the effect creation is complete
         */
        createNewEffects({
            existingFolderId,
            newFolderData,
            effectsData,
        }: ICreateNewEffects): Promise<void>;

        /**
         * Completely resets the world, re-initializing all effects and re-running
         * migrations after the forced reload.
         *
         * @returns A promise that resolves when the reset is complete
         */
        resetSystemInitialization({
            confirm = true,
        }: {
            confirm?: boolean;
        } = {}): Promise<void>;
    }

    namespace Hooks {
        type HookParamsConvenientEffectsReady =
            HookParameters<"dfreds-convenient-effects.ready">;

        /**
         * Register a callback handler which should be triggered when a hook is triggered.
         *
         * @param hook The unique name of the hooked event
         * @param fn   The callback function which should be triggered when the hook event occurs
         */
        function on(...args: HookParamsConvenientEffectsReady): number;

        /**
         * Register a callback handler for an event which is only triggered once the first time the event occurs.
         * After a "once" hook is triggered the hook is automatically removed.
         *
         * @param hook  The unique name of the hooked event
         * @param fn    The callback function which should be triggered when the hook event occurs
         */
        function once(...args: HookParamsConvenientEffectsReady): number;
    }
}
