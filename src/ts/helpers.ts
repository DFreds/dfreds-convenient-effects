import { id as MODULE_ID } from "@static/module.json";
import { ConvenientEffectsApp } from "./app/convenient-effects-app.ts";
import { FLAGS } from "./constants.ts";
import {
    ActiveEffectSource,
    EffectChangeData,
} from "types/foundry/common/documents/active-effect.js";
import { ItemFlags, ItemSource } from "types/foundry/common/documents/item.js";

interface ICreateItemAddOns {
    item: PreCreate<ItemSource>;
}

interface ICreateEffectAddOns {
    effect: PreCreate<ActiveEffectSource>;
    isTemporary?: boolean; // TODO determines if we add our own status
    isDynamic?: boolean; // TODO can we remove this??
    isViewable?: boolean;
    atlChanges?: DeepPartial<EffectChangeData>[];
    tokenMagicChanges?: DeepPartial<EffectChangeData>[];
    nestedEffects?: DeepPartial<ActiveEffectSource>[]; // TODO just ids? not sure this would work... effects might not be created yet
    subEffects?: DeepPartial<ActiveEffectSource>[]; // TODO just ids?
    otherEffects?: DeepPartial<ActiveEffectSource>[]; // TODO just ids? this is for effects that should not be tied to the initial effect (i.e. prone being applied when unconscious)
}

function createConvenientItem({
    item,
}: ICreateItemAddOns): PreCreate<ItemSource> {
    const itemFlags = item.flags ?? {};
    const ceFlags: DeepPartial<ItemFlags> = {};

    ceFlags[MODULE_ID] = {};
    ceFlags[MODULE_ID]![FLAGS.IS_CONVENIENT] = true; // TODO use to filter from item directory
    ceFlags[MODULE_ID]![FLAGS.IS_VIEWABLE] = true; // TODO use to hide in app

    item.flags = foundry.utils.mergeObject(ceFlags, itemFlags);
    item.img =
        item.img ?? "modules/dfreds-convenient-effects/images/magic-palm.svg";

    return item;
}

function createConvenientEffect({
    effect,
    isTemporary = true,
    isDynamic = false,
    isViewable = true,
    atlChanges = [],
    tokenMagicChanges = [],
    nestedEffects = [],
    subEffects = [],
}: ICreateEffectAddOns): PreCreate<ActiveEffectSource> {
    const effectFlags = effect.flags ?? {};
    const ceFlags: DeepPartial<DocumentFlags> = {};

    ceFlags[MODULE_ID] = {};
    ceFlags[MODULE_ID]![FLAGS.IS_CONVENIENT] = true;
    ceFlags[MODULE_ID]![FLAGS.IS_DYNAMIC] = isDynamic;
    ceFlags[MODULE_ID]![FLAGS.IS_VIEWABLE] = isViewable;
    ceFlags[MODULE_ID]![FLAGS.NESTED_EFFECTS] = nestedEffects;
    ceFlags[MODULE_ID]![FLAGS.SUB_EFFECTS] = subEffects;

    effect.flags = foundry.utils.mergeObject(ceFlags, effectFlags);

    const statusesArray = Array.from(effect.statuses ?? []);
    if (isTemporary) {
        statusesArray.unshift(`convenient-effect-${effect.name}`.slugify());
    }
    effect.statuses = statusesArray;

    // const settings = new Settings();
    // if (settings.integrateWithAte) {
    effect.changes?.push(...atlChanges);
    // }

    // if (settings.integrateWithTokenMagic) {
    effect.changes?.push(...tokenMagicChanges);
    // }

    return effect;
}

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

function findAllEffectFolderItems(): Item<any>[] {
    return game.items.filter((item) => isItemConvenient(item));
}

function findEffectFolderItems(): Item<any>[] {
    return game.items
        .filter((item) => {
            const isConvenient = isItemConvenient(item);
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

/**
 * Checks if the effect is flagged as convenient
 *
 * @param activeEffect - The effect to check
 * @returns true if it is convenient, false otherwise
 */
function isEffectConvenient(activeEffect: ActiveEffect<any>): boolean {
    return (
        (activeEffect.getFlag(MODULE_ID, FLAGS.IS_CONVENIENT) as boolean) ??
        false
    );
}

function isItemConvenient(item: Item<any>): boolean {
    return (item.getFlag(MODULE_ID, FLAGS.IS_CONVENIENT) as boolean) ?? false;
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
    createConvenientItem,
    createConvenientEffect,
    findActorByUuid,
    findAllEffectFolderItems,
    findEffectFolderItems,
    getActorUuids,
    isEffectConvenient,
    isItemConvenient,
    renderConvenientEffectsAppIfOpen,
};
