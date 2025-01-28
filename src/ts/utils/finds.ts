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

interface FindOptions {
    backup: boolean;
}

function findFolders({ backup }: FindOptions): Item<null>[] {
    return game.items
        .filter((folder) => {
            return (
                Flags.isConvenient(folder) && backup === Flags.isBackup(folder)
            );
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

function findFolder(
    folderId: string,
    { backup }: FindOptions,
): Item<null> | undefined {
    return game.items.find((folder) => {
        return (
            folder.id === folderId &&
            Flags.isConvenient(folder) &&
            backup === Flags.isBackup(folder)
        );
    });
}

function findAllEffects({ backup }: FindOptions): ActiveEffect<Item<null>>[] {
    return findFolders({ backup })
        .flatMap((folder) => findEffectsByFolder(folder.id, { backup }))
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

function findEffectsByFolder(
    folderId: string,
    { backup }: FindOptions,
): ActiveEffect<Item<null>>[] {
    const folder = findFolder(folderId, { backup });

    if (!folder) return [];

    return folder.effects
        .map((effect) => effect as ActiveEffect<Item<null>>)
        .filter((effect) => {
            return (
                Flags.isConvenient(effect) && backup === Flags.isBackup(effect)
            );
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

function findAllNestedEffectIds({ backup }: FindOptions): string[] {
    let nestedEffectIds = findAllEffects({ backup })
        .flatMap((effect) => Flags.getNestedEffectIds(effect))
        .filter(notEmpty);

    nestedEffectIds = [...new Set(nestedEffectIds)];

    return nestedEffectIds;
}

function findAllSubEffectIds({ backup }: FindOptions): string[] {
    let subEffectIds = findAllEffects({ backup })
        .flatMap((effect) => Flags.getSubEffectIds(effect))
        .filter(notEmpty);

    subEffectIds = [...new Set(subEffectIds)];

    return subEffectIds;
}

function findAllOtherEffectIds({ backup }: FindOptions): string[] {
    let otherEffectIds = findAllEffects({ backup })
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

function findEffectByCeId(ceId: string): ActiveEffect<any> | undefined {
    return findAllEffects({ backup: false }).find((effect) => {
        return Flags.getCeEffectId(effect) === ceId;
    });
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
    findEffectByCeId,
};
