import { Listener } from "./index.ts";
import { renderConvenientEffectsAppIfOpen } from "../helpers.ts";
import { Flags } from "../utils/flags.ts";

/**
 * Handle removing any actor data changes when an active effect is deleted from an actor
 */
const DeleteActiveEffect: Listener = {
    listen(): void {
        Hooks.on(
            "deleteActiveEffect",
            (activeEffect: any, _metadata, _userId) => {
                const effect = activeEffect as ActiveEffect<any>;

                if (
                    Flags.isConvenient(effect) &&
                    effect.parent instanceof Item &&
                    Flags.isConvenient(effect.parent)
                ) {
                    renderConvenientEffectsAppIfOpen();
                }

                if (effect.parent instanceof Actor) {
                    // Remove effects that were added due to this effect
                    const actor = effect.parent as Actor;
                    const effectIdsFromThisEffect = actor.effects
                        .filter((effect) => effect.origin === activeEffect.id)
                        .map((effect) => effect.id);

                    if (effectIdsFromThisEffect) {
                        actor.deleteEmbeddedDocuments(
                            "ActiveEffect",
                            effectIdsFromThisEffect,
                        );
                    }
                }
            },
        );
    },
};

export { DeleteActiveEffect };
