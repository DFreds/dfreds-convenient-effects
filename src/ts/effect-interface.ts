import { id as MODULE_ID } from "@static/module.json";
import BaseActiveEffect, {
    ActiveEffectSource,
} from "types/foundry/common/documents/active-effect.js";
import { Settings } from "./settings.ts";
import {
    findActorByUuid,
    findEffectsItem,
    getActorUuids,
    isEffectConvenient,
} from "./helpers.ts";
import { FLAGS } from "./constants.ts";

interface IFindEffect {
    /**
     * The effect ID
     */
    effectId?: string;

    /**
     * The effect name
     */
    effectName?: string;
}

interface IHasEffectApplied {
    /**
     * The effect ID
     */
    effectId?: string;

    /**
     * The effect name
     */
    effectName?: string;

    /**
     * The UUID of the actor
     */
    uuid: string;
}

interface IToggleEffect {
    /**
     * The effect ID
     */
    effectId?: string;

    /**
     * The effect name
     */
    effectName?: string;

    /**
     * Applies the effect as an overlay or not. Set to false by default
     */
    overlay: boolean;

    /**
     * The UUIDs of the actors. Set to an empty array by default
     */
    uuids: string[];
}

interface IAddEffect {
    /**
     * The ID of the effect to add. If defined, prioritized over `effectName` and
     * `effectData`.
     */
    effectId?: string;

    /**
     * The name of the effect to add. If defined, prioritized over
     * `effectData`.
     */
    effectName?: string;

    /**
     * The effect data to add. This is used to apply an effect that is NOT
     * already defined.
     */
    effectData?: PreCreate<ActiveEffectSource>;

    /**
     * The UUID of the actor
     */
    uuid: string;

    /**
     * The origin of the effect
     */
    origin?: string;

    /**
     * Applies the effect as an overlay or not. Set to false by default.
     */
    overlay: boolean;
}

interface IRemoveEffect {
    /**
     * The ID of the effect to remove. If defined, prioritized over `effectName`.
     */
    effectId?: string;

    /**
     * The name of the effect to remove
     */
    effectName?: string;

    /**
     * If defined, only removes the effect if the origin matches
     */
    origin?: string;
}

interface ICreateNewEffects {
    /**
     * The effects to create
     */
    effects: PreCreate<ActiveEffectSource>[];
}

class EffectInterface {
    #settings: Settings;
    #effectsItem: Item<null> | null;

    constructor() {
        this.#settings = new Settings();
        this.#effectsItem = findEffectsItem();
    }

    // TODO needs socket through GM probably
    /**
     * Searches through the list of available effects and returns one matching
     * either the effect ID or effect name.
     *
     * @param params - The parameters to find the effect
     * @returns The active effect or undefined if it can't be found
     */
    findEffect({
        effectId,
        effectName,
    }: IFindEffect): BaseActiveEffect<Item<null>> | undefined {
        if (!this.#effectsItem) return undefined;
        return Array(...this.#effectsItem.effects).find(
            (effect) => effect.id === effectId || effect.name === effectName,
        );
    }

    // TODO needs socket through GM probably
    /**
     * Checks to see if any of the current active effects applied to the actor
     * with the given UUID match the effect ID or name and are a convenient
     * effect
     *
     * @param options - The options to determine if the effect is applied
     * @returns true if the effect is applied to the actor and is a convenient
     * effect, false otherwise
     */
    hasEffectApplied({
        effectId,
        effectName,
        uuid,
    }: IHasEffectApplied): boolean {
        const actor = findActorByUuid(uuid);

        return (
            actor?.effects?.some(
                (effect) =>
                    isEffectConvenient(effect) &&
                    (effect.id === effectId || effect.name === effectName) &&
                    !effect.disabled,
            ) ?? false
        );
    }

    // TODO needs socket through GM probably
    async toggleEffect({
        effectId,
        effectName,
        overlay = false,
        uuids = [],
    }: IToggleEffect): Promise<void> {
        let actorUuids = uuids;
        if (actorUuids.length === 0) {
            actorUuids = getActorUuids(false); // TODO use setting for prioritize targets;
        }

        if (actorUuids.length === 0) {
            // TODO more descriptive error?
            ui.notifications.error(
                `Please select or target a token to toggle this effect`,
            );
            return;
        }

        const effect = this.findEffect({ effectId, effectName });

        // TODO more descriptive error?
        if (!effect) {
            ui.notifications.error("Cannot find effect");
        }

        // TODO handle nested effects
    }

    // TODO needs socket through GM probably
    async addEffect({
        effectId,
        effectName,
        effectData,
        uuid,
        origin,
        overlay = false,
    }: IAddEffect): Promise<void> {}

    // TODO needs socket through GM probably
    async removeEffect({
        effectId,
        effectName,
        origin,
    }: IRemoveEffect): Promise<void> {}

    // TODO needs socket through GM probably?
    async createNewEffects({ effects }: ICreateNewEffects): Promise<void> {}

    // TODO
    /**
     * Checks if the given effect has nested effects
     *
     * @param effect - the active effect to check the nested effects on
     * @returns true if the effect has a nested effect
     */
    hasNestedEffects(effect: ActiveEffect<Item<null>>): boolean {
        const nestedEffects =
            effect.getFlag(MODULE_ID, FLAGS.NESTED_EFFECTS) ?? [];

        return nestedEffects.length > 0;
    }

    async #getNestedEffectSelection(effect: ActiveEffect<any>) {
        const nestedEffectNames =
            effect.getFlag(MODULE_ID, FLAGS.NESTED_EFFECTS) ?? [];
        const nestedEffects = nestedEffectNames
            .map((nestedEffect) =>
                game.dfreds.effectInterface.findEffectByName(nestedEffect),
            )
            .filter((effect) => effect !== undefined);

        const content = await renderTemplate(
            "modules/dfreds-convenient-effects/templates/nested-effects-dialog.hbs",
            { parentEffect: effect, nestedEffects },
        );
        const choice = await Dialog.prompt(
            {
                title: effect.name,
                content: content,
                label: "Select Effect",
                callback: (html) => {
                    const htmlChoice = html
                        .find('select[name="effect-choice"]')
                        .val();
                    return htmlChoice;
                },
                rejectClose: false,
            },
            { width: 300 },
        );

        return nestedEffects.find(
            (nestedEffect) => nestedEffect.name === choice,
        );
    }
}

export { EffectInterface };
