import {
    ActiveEffectSource,
    BaseActiveEffect,
    ItemSource,
} from "@client/documents/_module.mjs";
import { MODULE_ID } from "../constants.ts";

class Flags {
    static #KEYS = {
        CE_EFFECT_ID: "ceEffectId",
        IS_BACKUP: "isBackup",
        IS_CONVENIENT: "isConvenient",
        IS_TEMPORARY: "isTemporary",
        IS_DYNAMIC: "isDynamic",
        IS_VIEWABLE: "isViewable",
        NESTED_EFFECT_IDS: "nestedEffectIds",
        SUB_EFFECT_IDS: "subEffectIds",
        OTHER_EFFECT_IDS: "otherEffectIds",
        FOLDER_COLOR: "folderColor",
    };

    static getCeEffectId(
        effect:
            | ActiveEffect<any>
            | BaseActiveEffect<any>
            | PreCreate<ActiveEffectSource>,
    ): string | undefined {
        if (effect instanceof ActiveEffect) {
            return effect.getFlag(MODULE_ID, this.#KEYS.CE_EFFECT_ID) as
                | string
                | undefined;
        } else {
            return foundry.utils.getProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.CE_EFFECT_ID}`,
            ) as string | undefined;
        }
    }

    static setCeEffectId(effect: object, ceEffectId: string): boolean {
        return foundry.utils.setProperty(
            effect,
            `flags.${MODULE_ID}.${this.#KEYS.CE_EFFECT_ID}`,
            ceEffectId,
        );
    }

    static isBackup(
        document: ActiveEffect<any> | Item<null> | object,
    ): boolean | undefined {
        if (document instanceof ActiveEffect || document instanceof Item) {
            return document.getFlag(MODULE_ID, this.#KEYS.IS_BACKUP) as
                | boolean
                | undefined;
        } else {
            return foundry.utils.getProperty(
                document,
                `flags.${MODULE_ID}.${this.#KEYS.IS_BACKUP}`,
            ) as boolean | undefined;
        }
    }

    static async setIsBackup(
        document: ActiveEffect<any> | Item<null> | object,
        value: boolean,
    ): Promise<any> {
        if (document instanceof ActiveEffect || document instanceof Item) {
            return document.setFlag(MODULE_ID, this.#KEYS.IS_BACKUP, value);
        } else {
            return foundry.utils.setProperty(
                document,
                `flags.${MODULE_ID}.${this.#KEYS.IS_BACKUP}`,
                value,
            );
        }
    }

    static getFolderColor(item: Item<null>): string {
        return (item.getFlag(MODULE_ID, this.#KEYS.FOLDER_COLOR) ??
            "") as string;
    }

    static async setFolderColor(
        item: Item<any> | PreCreate<ItemSource> | object,
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

    static getNestedEffectIds(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
    ): string[] | undefined {
        if (effect instanceof ActiveEffect) {
            return effect.getFlag(MODULE_ID, this.#KEYS.NESTED_EFFECT_IDS) as
                | string[]
                | undefined;
        } else {
            return foundry.utils.getProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.NESTED_EFFECT_IDS}`,
            ) as string[] | undefined;
        }
    }

    static async setNestedEffectIds(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
        nestedEffectIds: string[],
    ): Promise<any> {
        if (effect instanceof ActiveEffect) {
            return effect.setFlag(
                MODULE_ID,
                this.#KEYS.NESTED_EFFECT_IDS,
                nestedEffectIds,
            );
        } else {
            return foundry.utils.setProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.NESTED_EFFECT_IDS}`,
                nestedEffectIds,
            );
        }
    }

    static getSubEffectIds(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
    ): string[] | undefined {
        if (effect instanceof ActiveEffect) {
            return effect.getFlag(MODULE_ID, this.#KEYS.SUB_EFFECT_IDS) as
                | string[]
                | undefined;
        } else {
            return foundry.utils.getProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.SUB_EFFECT_IDS}`,
            ) as string[] | undefined;
        }
    }

    static async setSubEffectIds(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
        subEffectIds: string[],
    ): Promise<any> {
        if (effect instanceof ActiveEffect) {
            return effect.setFlag(
                MODULE_ID,
                this.#KEYS.SUB_EFFECT_IDS,
                subEffectIds,
            );
        } else {
            return foundry.utils.setProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.SUB_EFFECT_IDS}`,
                subEffectIds,
            );
        }
    }

    static getOtherEffectIds(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
    ): string[] | undefined {
        if (effect instanceof ActiveEffect) {
            return effect.getFlag(MODULE_ID, this.#KEYS.OTHER_EFFECT_IDS) as
                | string[]
                | undefined;
        } else {
            return foundry.utils.getProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.OTHER_EFFECT_IDS}`,
            ) as string[] | undefined;
        }
    }

    static async setOtherEffectIds(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
        otherEffects: string[],
    ): Promise<any> {
        if (effect instanceof ActiveEffect) {
            return effect.setFlag(
                MODULE_ID,
                this.#KEYS.OTHER_EFFECT_IDS,
                otherEffects,
            );
        } else {
            return foundry.utils.setProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.OTHER_EFFECT_IDS}`,
                otherEffects,
            );
        }
    }

    /**
     * Checks if the document is flagged as convenient
     *
     * @param effect - The effect to check
     * @returns true if it is convenient, false otherwise
     */
    static isConvenient(
        document: ActiveEffect<any> | Item<null> | object,
    ): boolean | undefined {
        if (document instanceof ActiveEffect || document instanceof Item) {
            return document.getFlag(MODULE_ID, this.#KEYS.IS_CONVENIENT) as
                | boolean
                | undefined;
        } else {
            return foundry.utils.getProperty(
                document,
                `flags.${MODULE_ID}.${this.#KEYS.IS_CONVENIENT}`,
            ) as boolean | undefined;
        }
    }

    static setIsConvenient(document: object, value: boolean): boolean {
        return foundry.utils.setProperty(
            document,
            `flags.${MODULE_ID}.${this.#KEYS.IS_CONVENIENT}`,
            value,
        );
    }

    static isTemporary(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
    ): boolean | undefined {
        if (effect instanceof ActiveEffect) {
            return effect.getFlag(MODULE_ID, this.#KEYS.IS_TEMPORARY) as
                | boolean
                | undefined;
        } else {
            return foundry.utils.getProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.IS_TEMPORARY}`,
            ) as boolean | undefined;
        }
    }

    static setIsTemporary(
        effect: PreCreate<ActiveEffectSource>,
        value: boolean,
    ): boolean {
        return foundry.utils.setProperty(
            effect,
            `flags.${MODULE_ID}.${this.#KEYS.IS_TEMPORARY}`,
            value,
        );
    }

    static isDynamic(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
    ): boolean | undefined {
        if (effect instanceof ActiveEffect) {
            return effect.getFlag(MODULE_ID, this.#KEYS.IS_DYNAMIC) as
                | boolean
                | undefined;
        } else {
            return foundry.utils.getProperty(
                effect,
                `flags.${MODULE_ID}.${this.#KEYS.IS_DYNAMIC}`,
            ) as boolean | undefined;
        }
    }

    static setIsDynamic(effect: object, value: boolean): boolean {
        return foundry.utils.setProperty(
            effect,
            `flags.${MODULE_ID}.${this.#KEYS.IS_DYNAMIC}`,
            value,
        );
    }

    static isViewable(
        document:
            | ActiveEffect<any>
            | Item<null>
            | PreCreate<ActiveEffectSource>,
    ): boolean | undefined {
        if (document instanceof ActiveEffect || document instanceof Item) {
            return document.getFlag(MODULE_ID, this.#KEYS.IS_VIEWABLE) as
                | boolean
                | undefined;
        } else {
            return foundry.utils.getProperty(
                document,
                `flags.${MODULE_ID}.${this.#KEYS.IS_VIEWABLE}`,
            ) as boolean | undefined;
        }
    }

    static async setIsViewable(
        document: ActiveEffect<any> | Item<null> | object,
        value: boolean,
    ): Promise<any> {
        if (document instanceof ActiveEffect || document instanceof Item) {
            return document.setFlag(MODULE_ID, this.#KEYS.IS_VIEWABLE, value);
        } else {
            return foundry.utils.setProperty(
                document,
                `flags.${MODULE_ID}.${this.#KEYS.IS_VIEWABLE}`,
                value,
            );
        }
    }
}

export { Flags };
