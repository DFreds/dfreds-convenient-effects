import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { findActorByUuid, isEffectConvenient } from "../helpers.ts";
import { log } from "../logger.ts";

interface IAddEffect {
    /**
     * The effect data to add
     */
    effectData: DeepPartial<ActiveEffectSource>;

    /**
     * The UUID of the actor to add the effect to
     */
    uuid: string;
}

interface IRemoveEffect {
    /**
     * The ID of the effect to remove
     */
    effectId?: string;

    /**
     * The name of the effect to remove
     */
    effectName?: string;

    /**
     * The UUID of the actor to remove the effect from
     */
    uuid: string;

    /**
     * Only removes the effect if the origin matches. If undefined, removes any
     * effect with the matching ID or name
     */
    origin?: ActiveEffectOrigin | null;
}

/**
 * Handler for effects sent via socket emissions
 */
class SocketEffectHandler {
    /**
     * Adds the provided effect to an actor matching the provided UUID
     *
     * @param options - The options to add an effect
     * @returns A promise that resolves when the effect is added
     */
    async addEffect({ effectData, uuid }: IAddEffect): Promise<void> {
        const actor = findActorByUuid(uuid);
        const activeEffectsToApply = [effectData];

        if (!actor) return; // This should already be checked for before the socket

        // TODO this needs to do dynamic effects
        // if (effect.flags[Constants.MODULE_ID]?.[Constants.FLAGS.IS_DYNAMIC]) {
        //     await this._dynamicEffectsAdderDelegate.addDynamicEffects(
        //         effect,
        //         actor,
        //     );
        // }

        await actor.createEmbeddedDocuments(
            "ActiveEffect",
            activeEffectsToApply,
        );

        // TODO this needs to do sub effects
        // const subEffects =
        //     effect.flags[Constants.MODULE_ID]?.[Constants.FLAGS.SUB_EFFECTS];
        // if (subEffects) {
        //     // Apply all sub-effects with the original effect being the origin
        //     for (const subEffect of subEffects) {
        //         await game.dfreds.effectInterface.addEffectWith({
        //             effectData: subEffect,
        //             uuid,
        //             origin: this._effectHelpers.getId(effect.name),
        //         });
        //     }
        // }

        log(`Added effect ${effectData.name} to ${actor.name} - ${actor.id}`);
    }

    /**
     * Removes the effect with the provided name from an actor matching the
     * provided UUID
     *
     * @param options - The options to remove an effect
     * @returns A promise that resolves when the effect is removed
     */
    async removeEffect({
        effectId,
        effectName,
        uuid,
        origin,
    }: IRemoveEffect): Promise<void> {
        const actor = findActorByUuid(uuid);

        if (!actor) return; // This should already be checked for before the socket

        let effectToRemove: ActiveEffect<Actor<null>> | undefined;

        if (origin) {
            effectToRemove = actor.effects.find((activeEffect) => {
                return (
                    isEffectConvenient(activeEffect) &&
                    (activeEffect.id === effectId ||
                        activeEffect.name === effectName) &&
                    activeEffect.origin === origin
                );
            });
        } else {
            effectToRemove = actor.effects.find((activeEffect) => {
                return (
                    isEffectConvenient(activeEffect) &&
                    (activeEffect.id === effectId ||
                        activeEffect.name === effectName)
                );
            });
        }

        if (!effectToRemove) return;

        await effectToRemove.delete();

        log(
            `Removed effect ${effectToRemove.name} from ${actor.name} - ${actor.id}`,
        );
    }
}

export { SocketEffectHandler };
