import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { ItemSource } from "types/foundry/common/documents/item.js";
import { Flags } from "./flags.ts";

interface ICreateItemAddOns {
    item: PreCreate<ItemSource>;
    isBackup?: boolean;
    isViewable?: boolean;
    color?: string;
}

interface ICreateEffectAddOns {
    effect: PreCreate<ActiveEffectSource>;
    isBackup?: boolean;
    isTemporary?: boolean;
    isViewable?: boolean;
    isDynamic?: boolean;
    nestedEffectIds?: string[];
    subEffectIds?: string[];
    otherEffectIds?: string[];
}

function createConvenientItem({
    item,
    isBackup = false,
    isViewable = true,
    color,
}: ICreateItemAddOns): PreCreate<ItemSource> {
    Flags.setIsConvenient(item, true);
    Flags.setIsBackup(item, isBackup);
    Flags.setIsViewable(item, isViewable);

    if (color) {
        Flags.setFolderColor(item, color);
    }

    item.name = isBackup ? `${item.name} - Backup` : item.name;
    item.img =
        item.img ?? "modules/dfreds-convenient-effects/images/magic-palm.svg";

    return item;
}

function createConvenientEffect({
    effect,
    isBackup = false,
    isTemporary = true,
    isViewable = true,
    isDynamic = false,
    nestedEffectIds,
    subEffectIds,
    otherEffectIds,
}: ICreateEffectAddOns): PreCreate<ActiveEffectSource> {
    Flags.setCeEffectId(effect, createCeEffectId(effect.name));
    Flags.setIsConvenient(effect, true);
    Flags.setIsBackup(effect, isBackup);
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
        ? effect.description.includes("<p>")
            ? effect.description
            : `<p>${effect.description}</p>`
        : `<p></p>`;

    return effect;
}

function createCeEffectId(effectName?: string): string {
    return `ce-${effectName?.slugify()}`;
}

export { createCeEffectId, createConvenientItem, createConvenientEffect };
