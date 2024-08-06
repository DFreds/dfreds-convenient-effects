import { id as MODULE_ID } from "@static/module.json";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { ItemSource } from "types/foundry/common/documents/item.js";

class Flags {
    static #KEYS = {
        CE_EFFECT_ID: "ceEffectId",
        IS_CONVENIENT: "isConvenient",
        IS_DYNAMIC: "isDynamic",
        IS_VIEWABLE: "isViewable",
        NESTED_EFFECTS: "nestedEffects",
        SUB_EFFECTS: "subEffects",
        OTHER_EFFECTS: "otherEffects",
        FOLDER_COLOR: "folderColor",
    };

    static getCeEffectId(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
    ): string | undefined {
        if (effect instanceof ActiveEffect) {
            return effect.getFlag(MODULE_ID, this.#KEYS.CE_EFFECT_ID) as
                | string
                | undefined;
        } else {
            return foundry.utils.getProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.CE_EFFECT_ID}`,
            );
        }
    }

    static setCeEffectId(effect: object, ceEffectId: string): boolean {
        return foundry.utils.setProperty(
            effect,
            `flags.${MODULE_ID}.${this.#KEYS.CE_EFFECT_ID}`,
            ceEffectId,
        );
    }

    static getFolderColor(item: Item<null>): string {
        return (item.getFlag(MODULE_ID, this.#KEYS.FOLDER_COLOR) ??
            "") as string;
    }

    static async setFolderColor(
        item: Item<any> | PreCreate<ItemSource>,
        color: string,
    ): Promise<any> {
        if (item instanceof Item) {
            return item.setFlag(MODULE_ID, this.#KEYS.FOLDER_COLOR, color);
        } else if (item instanceof Object) {
            return foundry.utils.setProperty(
                item,
                `flags.${MODULE_ID}.${this.#KEYS.FOLDER_COLOR}`,
                color,
            );
        }
    }

    static getNestedEffects(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
    ): PreCreate<ActiveEffectSource>[] {
        if (effect instanceof ActiveEffect) {
            return (effect.getFlag(MODULE_ID, this.#KEYS.NESTED_EFFECTS) ??
                []) as PreCreate<ActiveEffectSource>[];
        } else {
            return (foundry.utils.getProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.NESTED_EFFECTS}`,
            ) ?? []) as PreCreate<ActiveEffectSource>[];
        }
    }

    static setNestedEffects(
        effect: object,
        nestedEffects: PreCreate<ActiveEffectSource>[],
    ): boolean {
        return foundry.utils.setProperty(
            effect,
            `flags.${MODULE_ID}.${this.#KEYS.NESTED_EFFECTS}`,
            nestedEffects,
        );
    }

    static getSubEffects(
        effect: PreCreate<ActiveEffectSource>,
    ): PreCreate<ActiveEffectSource>[] {
        return (foundry.utils.getProperty(
            effect,
            `flags.${MODULE_ID}.${this.#KEYS.SUB_EFFECTS}`,
        ) ?? []) as PreCreate<ActiveEffectSource>[];
    }

    static setSubEffects(
        effect: object,
        subEffects: PreCreate<ActiveEffectSource>[],
    ): boolean {
        return foundry.utils.setProperty(
            effect,
            `flags.${MODULE_ID}.${this.#KEYS.SUB_EFFECTS}`,
            subEffects,
        );
    }

    static getOtherEffects(
        effect: PreCreate<ActiveEffectSource>,
    ): PreCreate<ActiveEffectSource>[] {
        return (foundry.utils.getProperty(
            effect,
            `flags.${MODULE_ID}.${this.#KEYS.OTHER_EFFECTS}`,
        ) ?? []) as PreCreate<ActiveEffectSource>[];
    }

    static setOtherEffects(
        effect: object,
        otherEffects: PreCreate<ActiveEffectSource>[],
    ): boolean {
        return foundry.utils.setProperty(
            effect,
            `flags.${MODULE_ID}.${this.#KEYS.OTHER_EFFECTS}`,
            otherEffects,
        );
    }

    /**
     * Checks if the document is flagged as convenient
     *
     * @param effect - The effect to check
     * @returns true if it is convenient, false otherwise
     */
    static isConvenient(document: ActiveEffect<any> | Item<null>): boolean {
        return (
            (document.getFlag(
                MODULE_ID,
                this.#KEYS.IS_CONVENIENT,
            ) as boolean) ?? false
        );
    }

    static setIsConvenient(document: object, value: boolean): boolean {
        return foundry.utils.setProperty(
            document,
            `flags.${MODULE_ID}.${this.#KEYS.IS_CONVENIENT}`,
            value,
        );
    }

    static isDynamic(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
    ): boolean {
        if (effect instanceof ActiveEffect) {
            return (
                (effect.getFlag(MODULE_ID, this.#KEYS.IS_DYNAMIC) as boolean) ??
                false
            );
        } else {
            return (
                foundry.utils.getProperty(
                    effect,
                    `flags.${MODULE_ID}.${this.#KEYS.IS_DYNAMIC}`,
                ) ?? false
            );
        }
    }

    static setIsDynamic(effect: object, value: boolean): boolean {
        return foundry.utils.setProperty(
            effect,
            `flags.${MODULE_ID}.${this.#KEYS.IS_DYNAMIC}`,
            value,
        );
    }

    static isViewable(document: ActiveEffect<any> | Item<null>): boolean {
        return (
            (document.getFlag(MODULE_ID, this.#KEYS.IS_VIEWABLE) as boolean) ??
            false
        );
    }

    static setIsViewable(document: object, value: boolean): boolean {
        return foundry.utils.setProperty(
            document,
            `flags.${MODULE_ID}.${this.#KEYS.IS_VIEWABLE}`,
            value,
        );
    }
}

export { Flags };
