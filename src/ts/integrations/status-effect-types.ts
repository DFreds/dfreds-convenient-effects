import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";

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

    createNewStatusEffects(input: ICreateNewStatusEffects): Promise<Document[]>;

    deleteStatusEffect(input: IDeleteStatusEffect): Promise<void>;
}

export type { StatusEffectsModule, StatusEffectsApi };
