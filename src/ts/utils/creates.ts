import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { ItemSource } from "types/foundry/common/documents/item.js";
import { Flags } from "./flags.ts";

interface ICreateItemAddOns {
    item: PreCreate<ItemSource>;
}

// TODO should we take a bottom up approach instead of top down?  i.e. instead of a parent defining its nested effects, should a child define its parent nested id?
interface ICreateEffectAddOns {
    effect: PreCreate<ActiveEffectSource>;
    isTemporary?: boolean;
    isViewable?: boolean;
    isDynamic?: boolean;
    nestedEffectIds?: string[];
    subEffectIds?: string[];
    otherEffectIds?: string[];
}

function createConvenientItem({
    item,
}: ICreateItemAddOns): PreCreate<ItemSource> {
    Flags.setIsConvenient(item, true);
    Flags.setIsViewable(item, true);

    item.img =
        item.img ?? "modules/dfreds-convenient-effects/images/magic-palm.svg";

    return item;
}

function createConvenientEffect({
    effect,
    isTemporary = true,
    isViewable = true,
    isDynamic = false,
    nestedEffectIds,
    subEffectIds,
    otherEffectIds,
}: ICreateEffectAddOns): PreCreate<ActiveEffectSource> {
    Flags.setCeEffectId(effect, createCeEffectId(effect.name));
    Flags.setIsConvenient(effect, true);
    Flags.setIsTemporary(effect, isTemporary);
    Flags.setIsViewable(effect, isViewable);
    Flags.setIsDynamic(effect, isDynamic);

    if (nestedEffectIds) {
        Flags.setNestedEffectIds(effect, nestedEffectIds);
    }
    if (subEffectIds) {
        Flags.setSubEffectIds(effect, subEffectIds);
    }
    if (otherEffectIds) {
        Flags.setOtherEffectIds(effect, otherEffectIds);
    }

    effect.description = effect.description
        ? `<p>${effect.description}</p>`
        : `<p></p>`;

    return effect;
}

function createCeEffectId(effectName?: string): string {
    return `ce-${effectName?.slugify({ strict: true })}`;
}

export { createCeEffectId, createConvenientItem, createConvenientEffect };
