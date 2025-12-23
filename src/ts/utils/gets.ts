import { ActorUUID } from "@common/documents/_module.mjs";
import { MODULE_ID } from "../constants.ts";
import { Flags } from "./flags.ts";

/**
 * Gets all UUIDs for selected or targeted tokens
 *
 * @param isPrioritizeTargets If true, will grab actor UUIDs by target instead of by controlled
 * @returns list of actor UUIDs for selected or targeted tokens
 */
function getActorUuids(isPrioritizeTargets: boolean): ActorUUID[] {
    if (isPrioritizeTargets && game.user.targets.size !== 0) {
        // Start with targets if prioritized
        return Array.from(game.user.targets).map(
            (target) => target.actor!.uuid,
        );
    } else if (canvas.tokens.controlled.length !== 0) {
        // Use controlled tokens if targets aren't prioritized
        return canvas.tokens.controlled.map((token) => token.actor!.uuid);
    } else if (game.user.targets.size !== 0) {
        // Use targets if not prioritized and no controlled tokens
        return Array.from(game.user.targets).map((token) => token.actor!.uuid);
    } else if (game.user.character) {
        // Use the default character for the user
        return [game.user.character.uuid as ActorUUID];
    } else {
        return [];
    }
}

function getItemType(): string {
    const types = Object.keys(CONFIG.Item.typeLabels);
    // Use the last type in the list because the first is usually "base" and that can be problematic
    return types[types.length - 1] ?? "";
}

function getApi(): EffectInterface {
    return (game.modules.get(MODULE_ID) as unknown as ConvenientEffectsModule)
        .api;
}

function isStackableDae({
    effectName,
    effect,
}: {
    effectName?: string;
    effect: ActiveEffect<any>;
}): boolean {
    if (!effectName) return false;

    const startsWithName = effect.name.startsWith(effectName);
    const stackableFlag = Flags.getStackableDae(effect);
    return (
        startsWithName &&
        (stackableFlag === "multi" ||
            stackableFlag === "count" ||
            stackableFlag === "countDeleteDecrement")
    );
}

// function effectsByActorMappings(): {
//     actor: Actor<any>;
//     effects: ActiveEffect<Actor<any>>;
// }[] {
//     return canvas.tokens.controlled
//         .filter((token) => {
//             const effects = token.actor.effects.filter(
//                 (activeEffect) => activeEffect.isTemporary,
//             );
//             return effects.length > 0;
//         })
//         .map((token) => {
//             const actor = token.actor;
//             const effects = token.actor.effects.filter(
//                 (activeEffect) => activeEffect.isTemporary,
//             );

//             return { actor, effects };
//         });
// }

export { getActorUuids, getItemType, getApi, isStackableDae };
