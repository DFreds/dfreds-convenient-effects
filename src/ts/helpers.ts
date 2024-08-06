import { ConvenientEffectsApp } from "./app/convenient-effects-app.ts";
import {
    ActiveEffectSource,
    EffectChangeData,
} from "types/foundry/common/documents/active-effect.js";
import { ItemSource } from "types/foundry/common/documents/item.js";
import { Settings } from "./settings.ts";
import { log } from "./logger.ts";
import { Flags } from "./utils/flags.ts";

interface ICreateItemAddOns {
    item: PreCreate<ItemSource>;
}

// TODO break out into other util funcs

// TODO method for hiding/showing individual effects/folder from players using IS_VIEWABLE
interface ICreateEffectAddOns {
    effect: PreCreate<ActiveEffectSource>;
    isTemporary?: boolean; // TODO determines if we add our own status
    isDynamic?: boolean;
    atlChanges?: DeepPartial<EffectChangeData>[];
    tokenMagicChanges?: DeepPartial<EffectChangeData>[];
    nestedEffects?: PreCreate<ActiveEffectSource>[];
    subEffects?: PreCreate<ActiveEffectSource>[];
    otherEffects?: PreCreate<ActiveEffectSource>[];
}

function createConvenientItem({
    item,
}: ICreateItemAddOns): PreCreate<ItemSource> {
    Flags.setIsConvenient(item, true); // TODO use to filter out of item directory
    Flags.setIsViewable(item, true);

    item.img =
        item.img ?? "modules/dfreds-convenient-effects/images/magic-palm.svg";

    return item;
}

function createConvenientEffect({
    effect,
    isTemporary = true,
    isDynamic = false,
    atlChanges = [],
    tokenMagicChanges = [],
    nestedEffects = [],
    subEffects = [],
    otherEffects = [],
}: ICreateEffectAddOns): PreCreate<ActiveEffectSource> {
    Flags.setCeEffectId(effect, createCeEffectId(effect));
    Flags.setIsConvenient(effect, true);
    Flags.setIsViewable(effect, true);
    Flags.setIsDynamic(effect, isDynamic);
    Flags.setNestedEffects(effect, nestedEffects);
    Flags.setSubEffects(effect, subEffects);
    Flags.setOtherEffects(effect, otherEffects);

    if (isTemporary) {
        log("isTemp"); // TODO remove or do something for making passive effects
    }

    const settings = new Settings();
    if (settings.integrateWithAte) {
        effect.changes?.push(...atlChanges);
    }

    if (settings.integrateWithTokenMagic) {
        effect.changes?.push(...tokenMagicChanges);
    }

    return effect;
}

function createCeEffectId(effect: PreCreate<ActiveEffectSource>): string {
    return `ce-${effect.name?.slugify({ strict: true })}`;
}

// TODO async this
/**
 * Gets the actor object by the actor UUID
 *
 * @param uuid The actor UUID
 * @returns the actor that was found via the UUID or undefined if not found
 */
function findActorByUuid(
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
        return [game.user.character.uuid];
    } else {
        return [];
    }
}

function getBaseType(): string {
    const types = Object.keys(CONFIG.Item.typeLabels);
    return types[0] ?? "";
}

/**
 * Re-renders the Convenient Effects application if it's open
 */
function renderConvenientEffectsAppIfOpen(): void {
    const openApps = Object.values(ui.windows);
    const ceApp = openApps.find((app) => app instanceof ConvenientEffectsApp);

    if (ceApp) {
        ceApp.render();
    }
}

export {
    createCeEffectId,
    createConvenientItem,
    createConvenientEffect,
    findActorByUuid,
    findEffectFolderItems,
    findEffectsForItem,
    getActorUuids,
    getBaseType,
    renderConvenientEffectsAppIfOpen,
};
