import { Listener } from "./index.ts";
import { Settings } from "../settings.ts";
import {
    isEffectConvenient,
    renderConvenientEffectsAppIfOpen,
} from "../helpers.ts";

/**
 * Handle removing any actor data changes when an active effect is deleted from an actor
 */
const DeleteActiveEffect: Listener = {
    listen(): void {
        Hooks.on("deleteActiveEffect", (activeEffect: any, _config, userId) => {
            if (game.user.id !== userId) return;

            const effect = activeEffect as ActiveEffect<any>;
            const settings = new Settings();
            if (settings.effectItemIds?.includes(effect.parent.id)) {
                renderConvenientEffectsAppIfOpen();
            }

            if (
                !isEffectConvenient(effect) ||
                !(effect?.parent instanceof Actor)
            ) {
                return;
            }

            // TODO do this when doing sub effects
            // Remove effects that were added due to this effect
            // const actor = effect.parent as Actor;
            // const effectIdsFromThisEffect = actor.effects
            //     .filter(
            //         (effect) =>
            //             effect.origin ===
            //             effectHelpers.getId(activeEffect.name),
            //     )
            //     .map((effect) => effect.id);

            // if (effectIdsFromThisEffect) {
            //     actor.deleteEmbeddedDocuments(
            //         "ActiveEffect",
            //         effectIdsFromThisEffect,
            //     );
            // }
        });
    },
};

export { DeleteActiveEffect };
