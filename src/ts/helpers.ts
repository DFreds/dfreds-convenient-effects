import { id as MODULE_ID } from "@static/module.json";
import { ConvenientEffectsApp } from "./app/convenient-effects-app.ts";
import { Settings } from "./settings.ts";
import { FLAGS } from "./constants.ts";
import {
    ActiveEffectSource,
    EffectChangeData,
} from "types/foundry/common/documents/active-effect.js";

interface ICreateEffectAddOns {
    isDynamic: boolean; // TODO can we remove this??
    isViewable: boolean;
    atlChanges?: DeepPartial<EffectChangeData>[];
    tokenMagicChanges: DeepPartial<EffectChangeData>[];
    nestedEffects: DeepPartial<ActiveEffectSource>[]; // TODO just ids? not sure this would work... effects might not be created yet
    subEffects: DeepPartial<ActiveEffectSource>[]; // TODO just ids?
}

async function addToEffectData(
    effect: PreCreate<ActiveEffectSource>,
    {
        isDynamic = false,
        isViewable = true,
        atlChanges = [],
        tokenMagicChanges = [],
        nestedEffects = [],
        subEffects = [],
    }: ICreateEffectAddOns,
): Promise<void> {
    const effectFlags = effect.flags ?? {};
    const ceFlags: DeepPartial<DocumentFlags> = {};

    ceFlags[MODULE_ID] = {};
    ceFlags[MODULE_ID]![FLAGS.IS_CONVENIENT] = true;
    ceFlags[MODULE_ID]![FLAGS.IS_DYNAMIC] = isDynamic;
    ceFlags[MODULE_ID]![FLAGS.IS_VIEWABLE] = isViewable;
    ceFlags[MODULE_ID]![FLAGS.NESTED_EFFECTS] = nestedEffects;
    ceFlags[MODULE_ID]![FLAGS.SUB_EFFECTS] = subEffects;

    effect.flags = foundry.utils.mergeObject(ceFlags, effectFlags);

    const settings = new Settings();
    // if (settings.integrateWithAte) {
    effect.changes?.push(...atlChanges);
    // }

    // if (settings.integrateWithTokenMagic) {
    effect.changes?.push(...tokenMagicChanges);
    // }
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

/**
 * Finds the effect item
 *
 * @returns Returns the item for effects or null
 */
function findEffectsItem(): Item<any> | null {
    const settings = new Settings();

    const effectsItemId = settings.effectsItemId;
    if (!effectsItemId) return null;

    const effectsItem = game.items.get(effectsItemId);
    if (!effectsItem) return null;

    return effectsItem;
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
    addToEffectData,
    findActorByUuid,
    findEffectsItem,
    getActorUuids,
    isEffectConvenient,
    renderConvenientEffectsAppIfOpen,
};