import { renderAppIfOpen } from "../ui/render-app-if-open.ts";
import { Listener } from "./index.ts";
import { Flags } from "../utils/flags.ts";
import { Mapping } from "../effects/mapping.ts";

/**
 * Handle removing any actor data changes when an active effect is deleted from an actor
 */
const DeleteActiveEffect: Listener = {
    listen(): void {
        Hooks.on("deleteActiveEffect", (activeEffect: any, _metadata: any, _userId: any) => {
            const effect = activeEffect as ActiveEffect<any>;

            if (Flags.isConvenient(effect) && effect.parent instanceof Item && Flags.isConvenient(effect.parent)) {
                renderAppIfOpen();
            }

            if (game.user === game.users.activeGM && effect.parent instanceof Actor) {
                // Remove effects that were added due to this effect
                const actor = effect.parent as Actor;
                const effectIdsFromThisEffect = actor.effects
                    .filter((effect) => effect.origin === activeEffect.id)
                    .map((effect) => effect.id);

                if (effectIdsFromThisEffect && effectIdsFromThisEffect.length > 0) {
                    actor.deleteEmbeddedDocuments("ActiveEffect", effectIdsFromThisEffect);
                }

                // Undo any actor data changes that were made when applied
                if (Flags.isConvenient(effect)) {
                    const systemDefinition = new Mapping().findSystemDefinitionForSystemId();
                    systemDefinition?.dynamicEffectsHandler?.handleEffectDeletion?.(effect, actor);
                }
            }
        });
    },
};

export { DeleteActiveEffect };
