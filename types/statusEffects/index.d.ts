import Document from "@common/abstract/document.mjs";
import { Module } from "@client/packages/_module.mjs";

export {};

declare global {
    interface StatusEffectsModule extends Module {
        api: StatusEffectsApi;
    }

    interface IFindStatusEffect {
        /**
         * The foundry effect ID or the SE effect ID
         */
        effectId?: string | null;

        /**
         * The effect name
         */
        effectName?: string | null;
    }

    interface IHasStatusEffectApplied {
        /**
         * The foundry effect ID or the SE effect ID
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

    interface IToggleStatusEffect {
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
         * The origin of the effect. If toggling off, it will only remove the effect
         * if the origin matches.
         */
        origin?: ActiveEffectOrigin | null;
    }

    interface IAddStatusEffect {
        /**
         * The foundry effect ID or the SE effect ID. If defined, prioritized over
         * `effectName`.
         */
        effectId?: string;

        /**
         * The name of the effect to add.
         */
        effectName?: string;

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

    interface IRemoveStatusEffect {
        /**
         * The foundry effect ID or the SE effect ID to remove. If defined,
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

    interface ICreateNewStatusEffects {
        /**
         * The data that defines the status effects to create
         */
        effectsData: PreCreate<ActiveEffectSource>[];
    }

    interface IDeleteStatusEffect {
        /**
         * The foundry effect ID or the SE effect ID to remove. If defined,
         * prioritized over `effectName`
         */
        effectId?: string;

        /**
         * The name of the effect to remove
         */
        effectName?: string;
    }

    interface StatusEffectsApi {
        findStatusEffects(): ActiveEffect<Item<any>>[];

        findStatusEffect(
            input: IFindStatusEffect,
        ): ActiveEffect<Item<null>> | undefined;

        hasStatusEffectApplied(
            input: IHasStatusEffectApplied,
        ): Promise<boolean>;

        toggleStatusEffect(input: IToggleStatusEffect): Promise<void>;

        addStatusEffect(input: IAddStatusEffect): Promise<Document[]>;

        removeStatusEffect(input: IRemoveStatusEffect): Promise<void>;

        createNewStatusEffects(
            input: ICreateNewStatusEffects,
        ): Promise<Document[]>;

        deleteStatusEffect(input: IDeleteStatusEffect): Promise<void>;
    }
}
