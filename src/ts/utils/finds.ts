import { Flags } from "./flags.ts";

/**
 * Gets the actor object by the actor UUID
 *
 * @param uuid The actor UUID
 * @returns the actor that was found via the UUID or undefined if not found
 */
async function findActorByUuid(
    uuid: string,
): Promise<Actor<TokenDocument<any> | null> | undefined> {
    const actorToken = await fromUuid(uuid);

    if (!actorToken) return undefined;

    if (actorToken instanceof TokenDocument) {
        return actorToken.actor ?? undefined;
    } else if (actorToken instanceof Actor) {
        return actorToken;
    }

    return undefined;
}

function findActorByUuidSync(
    uuid: string,
): Actor<TokenDocument<any> | null> | undefined {
    const actorToken = fromUuidSync(uuid);

    if (!actorToken) return undefined;

    if (actorToken instanceof TokenDocument) {
        return actorToken.actor ?? undefined;
    } else if (actorToken instanceof Actor) {
        return actorToken;
    }

    return undefined;
}

function findEffectFolderItems(): Item<null>[] {
    return game.items
        .filter((item) => {
            const isConvenient = Flags.isConvenient(item);
            return isConvenient;
        })
        .sort((itemA, itemB) => {
            const nameA = itemA.name.toUpperCase(); // ignore upper and lowercase
            const nameB = itemB.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
}

function findEffectsForItem(itemId: string): ActiveEffect<Item<null>>[] {
    const item = game.items.get(itemId);

    if (!item) return [];

    return (
        item.effects
            .map((effect) => effect as ActiveEffect<Item<null>>)
            // TODO rethink below - maybe based on permissions?
            // .filter(
            //     (effect) => effect.getFlag(MODULE_ID, FLAGS.IS_VIEWABLE) ?? true,
            // )
            .sort((effectA, effectB) => {
                const nameA = effectA.name.toUpperCase(); // ignore upper and lowercase
                const nameB = effectB.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            })
    );
}

export {
    findActorByUuid,
    findActorByUuidSync,
    findEffectFolderItems,
    findEffectsForItem,
};
