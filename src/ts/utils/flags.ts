import { ActiveEffectSource, BaseActiveEffect, ItemSource } from "@client/documents/_module.mjs";
import { MODULE_ID, MODULE_IDS } from "../constants.ts";

class Flags {
    static #KEYS = {
        CE_EFFECT_ID: "ceEffectId",
        IS_BACKUP: "isBackup",
        IS_CONVENIENT: "isConvenient",
        IS_TEMPORARY: "isTemporary",
        IS_DYNAMIC: "isDynamic",
        IS_VIEWABLE: "isViewable",
        UPDATES_ACTOR: "updatesActor",
        NESTED_EFFECT_IDS: "nestedEffectIds",
        SUB_EFFECT_IDS: "subEffectIds",
        OTHER_EFFECT_IDS: "otherEffectIds",
        INCREMENT_EFFECT_IDS: "incrementEffectIds",
        FOLDER_COLOR: "folderColor",

        // DAE
        STACKABLE: "stackable",

        // Status Effects
        IS_STATUS_EFFECT: "isStatusEffect",
    };

    static #get<T>(document: object, key: string): T | undefined {
        return foundry.utils.getProperty(document, `flags.${MODULE_ID}.${key}`) as T | undefined;
    }

    static #setOnSource(source: object, key: string, value: unknown): boolean {
        return foundry.utils.setProperty(source, `flags.${MODULE_ID}.${key}`, value);
    }

    static async #set(document: object, key: string, value: unknown): Promise<any> {
        if (document instanceof ActiveEffect || document instanceof Item) {
            return document.setFlag(MODULE_ID, key, value);
        }
        return this.#setOnSource(document, key, value);
    }

    static getCeEffectId(
        effect: ActiveEffect<any> | BaseActiveEffect<any> | PreCreate<ActiveEffectSource>,
    ): string | undefined {
        return this.#get(effect, this.#KEYS.CE_EFFECT_ID);
    }

    static setCeEffectId(effect: object, ceEffectId: string): boolean {
        return this.#setOnSource(effect, this.#KEYS.CE_EFFECT_ID, ceEffectId);
    }

    static isBackup(document: ActiveEffect<any> | Item<null> | object): boolean | undefined {
        return this.#get(document, this.#KEYS.IS_BACKUP);
    }

    static async setIsBackup(document: ActiveEffect<any> | Item<null> | object, value: boolean): Promise<any> {
        return this.#set(document, this.#KEYS.IS_BACKUP, value);
    }

    static getFolderColor(item: Item<null> | PreCreate<ItemSource>): string | undefined {
        return this.#get(item, this.#KEYS.FOLDER_COLOR);
    }

    static async setFolderColor(item: Item<any> | PreCreate<ItemSource> | object, color: string): Promise<any> {
        return this.#set(item, this.#KEYS.FOLDER_COLOR, color);
    }

    static getNestedEffectIds(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): string[] | undefined {
        return this.#get(effect, this.#KEYS.NESTED_EFFECT_IDS);
    }

    static async setNestedEffectIds(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
        nestedEffectIds: string[],
    ): Promise<any> {
        return this.#set(effect, this.#KEYS.NESTED_EFFECT_IDS, nestedEffectIds);
    }

    static getSubEffectIds(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): string[] | undefined {
        return this.#get(effect, this.#KEYS.SUB_EFFECT_IDS);
    }

    static async setSubEffectIds(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
        subEffectIds: string[],
    ): Promise<any> {
        return this.#set(effect, this.#KEYS.SUB_EFFECT_IDS, subEffectIds);
    }

    static getOtherEffectIds(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): string[] | undefined {
        return this.#get(effect, this.#KEYS.OTHER_EFFECT_IDS);
    }

    static async setOtherEffectIds(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
        otherEffects: string[],
    ): Promise<any> {
        return this.#set(effect, this.#KEYS.OTHER_EFFECT_IDS, otherEffects);
    }

    /**
     * Checks if the document is flagged as convenient
     *
     * @param document - The effect to check
     * @returns true if it is convenient, false otherwise
     */
    static isConvenient(document: ActiveEffect<any> | Item<null> | object): boolean | undefined {
        return this.#get(document, this.#KEYS.IS_CONVENIENT);
    }

    static setIsConvenient(document: object, value: boolean): boolean {
        return this.#setOnSource(document, this.#KEYS.IS_CONVENIENT, value);
    }

    static isTemporary(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): boolean | undefined {
        return this.#get(effect, this.#KEYS.IS_TEMPORARY);
    }

    static setIsTemporary(effect: PreCreate<ActiveEffectSource>, value: boolean): boolean {
        return this.#setOnSource(effect, this.#KEYS.IS_TEMPORARY, value);
    }

    static isDynamic(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): boolean | undefined {
        return this.#get(effect, this.#KEYS.IS_DYNAMIC);
    }

    static setIsDynamic(effect: object, value: boolean): boolean {
        return this.#setOnSource(effect, this.#KEYS.IS_DYNAMIC, value);
    }

    static getIncrementEffectIds(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): string[] | undefined {
        return this.#get(effect, this.#KEYS.INCREMENT_EFFECT_IDS);
    }

    static async setIncrementEffectIds(
        effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>,
        incrementEffectIds: string[],
    ): Promise<any> {
        return this.#set(effect, this.#KEYS.INCREMENT_EFFECT_IDS, incrementEffectIds);
    }

    static isUpdatesActor(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): boolean | undefined {
        return this.#get(effect, this.#KEYS.UPDATES_ACTOR);
    }

    static setUpdatesActor(effect: object, value: boolean): boolean {
        return this.#setOnSource(effect, this.#KEYS.UPDATES_ACTOR, value);
    }

    static isViewable(document: ActiveEffect<any> | Item<null> | PreCreate<ActiveEffectSource>): boolean | undefined {
        return this.#get(document, this.#KEYS.IS_VIEWABLE);
    }

    static async setIsViewable(document: ActiveEffect<any> | Item<null> | object, value: boolean): Promise<any> {
        return this.#set(document, this.#KEYS.IS_VIEWABLE, value);
    }

    static getStackableDae(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): string | undefined {
        return foundry.utils.getProperty(effect, `flags.${MODULE_IDS.DAE}.${this.#KEYS.STACKABLE}`) as
            string | undefined;
    }

    static setIsStatusEffect(document: PreCreate<ItemSource> | PreCreate<ActiveEffectSource>, value: boolean): boolean {
        if (document.flags?.[MODULE_IDS.STATUS_EFFECTS]) {
            return foundry.utils.setProperty(
                document,
                `flags.${MODULE_IDS.STATUS_EFFECTS}.${this.#KEYS.IS_STATUS_EFFECT}`,
                value,
            );
        }
        return false;
    }
}

export { Flags };
