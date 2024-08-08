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

function findFolders(): Item<null>[] {
    return game.items
        .filter((folder) => {
            const isConvenient = Flags.isConvenient(folder);
            return isConvenient;
        })
        .sort((folderA, folderB) => {
            const nameA = folderA.name.toUpperCase(); // ignore upper and lowercase
            const nameB = folderB.name.toUpperCase(); // ignore upper and lowercase
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

function findFolder(folderId: string): Item<null> | undefined {
    return game.items.find((folder) => {
        return folder.id === folderId && Flags.isConvenient(folder);
    });
}

function findEffects(): ActiveEffect<Item<null>>[] {
    return findFolders()
        .flatMap((folder) => findEffectsByFolder(folder.id))
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
        });
}

function findEffectsByFolder(folderId: string): ActiveEffect<Item<null>>[] {
    const folder = findFolder(folderId);

    if (!folder) return [];

    return (
        folder.effects
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
    findFolder,
    findFolders,
    findEffects,
    findEffectsByFolder,
};
