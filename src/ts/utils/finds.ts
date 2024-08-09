import { Flags } from "./flags.ts";
import { notEmpty } from "./types.ts";

function findModuleById(moduleId: string): Module | undefined {
    return game.modules.get(moduleId);
}

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
            return Flags.isConvenient(folder);
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

function findAllEffects(): ActiveEffect<Item<null>>[] {
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

    return folder.effects
        .map((effect) => effect as ActiveEffect<Item<null>>)
        .filter((effect) => {
            return Flags.isConvenient(effect);
        })
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

function findAllNestedEffectIds(): string[] {
    let nestedEffectIds = findAllEffects()
        .flatMap((effect) => Flags.getNestedEffectIds(effect))
        .filter(notEmpty);

    nestedEffectIds = [...new Set(nestedEffectIds)];

    return nestedEffectIds;
}

function findAllSubEffectIds(): string[] {
    let subEffectIds = findAllEffects()
        .flatMap((effect) => Flags.getSubEffectIds(effect))
        .filter(notEmpty);

    subEffectIds = [...new Set(subEffectIds)];

    return subEffectIds;
}

function findAllOtherEffectIds(): string[] {
    let otherEffectIds = findAllEffects()
        .flatMap((effect) => Flags.getOtherEffectIds(effect))
        .filter(notEmpty);

    otherEffectIds = [...new Set(otherEffectIds)];

    return otherEffectIds;
}

async function findEffectByUuid(
    uuid: string,
): Promise<ActiveEffect<any> | undefined> {
    const document = await fromUuid(uuid);

    if (!(document instanceof ActiveEffect)) return;

    return document as ActiveEffect<any>;
}

export {
    findModuleById,
    findActorByUuid,
    findActorByUuidSync,
    findFolder,
    findFolders,
    findAllEffects,
    findEffectsByFolder,
    findAllNestedEffectIds,
    findAllSubEffectIds,
    findAllOtherEffectIds,
    findEffectByUuid,
};
