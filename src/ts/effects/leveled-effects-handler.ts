import { ActiveEffectSource } from "@client/documents/_module.mjs";

/**
 * Handles effects that have levels on the actor (such as exhaustion) instead of
 * being only on or off. Systems that support leveled effects provide one of
 * these in their system definition.
 */
abstract class LeveledEffectsHandler {
    abstract systemId: string;

    /**
     * Whether the defined effect is managed as a leveled effect
     */
    abstract isLeveled(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): boolean;

    /**
     * Raises or lowers the level of the effect on the actor. Runs as the GM.
     */
    abstract changeLevel(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
        options: { levels: number; overlay: boolean },
    ): Promise<void>;

    /**
     * Removes every level of the effect from the actor. Runs as the GM.
     */
    abstract removeLevels(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>): Promise<void>;

    /**
     * Whether the actor has any level of the effect
     */
    abstract isApplied(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>, actor: Actor<any>): boolean;
}

export { LeveledEffectsHandler };
