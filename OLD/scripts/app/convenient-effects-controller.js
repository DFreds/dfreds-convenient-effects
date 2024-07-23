import Constants from "../constants.js";
import CustomEffectsHandler from "../effects/custom-effects-handler.js";
import DynamicEffectsAdderDelegate from "../systems/dynamic-effects-adder-delegate.js";
import FoundryHelpers from "../util/foundry-helpers.js";
import Settings from "../settings.js";

/**
 * Controller class that handles events from the app and manipulating the underlying Foundry data
 */
export default class ConvenientEffectsController {
    /**
     * Initializes the controller and its dependencies
     *
     * @param {ConvenientEffectsApp} viewMvc - the app that the controller can interact with
     */
    constructor(viewMvc) {
        this._viewMvc = viewMvc;

        this._customEffectsHandler = new CustomEffectsHandler();
        this._dynamicEffectsAdderDelegate = new DynamicEffectsAdderDelegate();
        this._foundryHelpers = new FoundryHelpers();
        this._settings = new Settings();
    }

    /**
     * Handles clicks on the create effect button
     *
     * @param {MouseEvent} event
     */
    async onCreateEffectClick(event) {
        await this._customEffectsHandler.createNewCustomEffect();
    }

    /**
     * Handle editing the custom effect
     *
     * @param {jQuery} effectItem - jQuery element representing the effect list item
     */
    async onEditEffectClick(effectItem) {
        const effectName = effectItem.data().effectName;
        const customEffect = this._customEffectsHandler
            .getCustomEffects()
            .find((effect) => effect.name == effectName);

        await this._customEffectsHandler.editCustomEffect(customEffect);
    }

    /**
     * Handle deleting the custom effect
     *
     * @param {jQuery} effectItem - jQuery element representing the effect list item
     */
    async onDeleteEffectClick(effectItem) {
        const effectName = effectItem.data().effectName;
        const customEffect = this._customEffectsHandler
            .getCustomEffects()
            .find((effect) => effect.name == effectName);

        await this._customEffectsHandler.deleteCustomEffect(customEffect);
        this._viewMvc.render();
    }

    /**
     * Checks if the provided effect is custom
     *
     * @param {jQuery} effectItem - jQuery element representing the effect list item
     * @returns true if the effect is custom
     */
    isCustomEffect(effectItem) {
        const effectName = effectItem.data().effectName;
        return this._customEffectsHandler.isCustomEffect(effectName);
    }

    /**
     * Checks if the player is allowed to change custom effects
     *
     * @returns true if the player is allowed to change custom effects
     */
    get isPlayerAllowedCustomEffects() {
        return this._settings.allowPlayerCustomEffects;
    }

    /**
     * Handles clicks on effect items by toggling them on or off on selected tokens
     *
     * @param {MouseEvent} event - event that corresponds to clicking an effect item
     */
    async onEffectClick(event) {
        const effectName = this._findNearestEffectName(event);
        await game.dfreds.effectInterface.toggleEffect(effectName);
    }

    _findNearestEffectName(event) {
        return $(event.target)
            .closest("[data-effect-name], .convenient-effect")
            .data()?.effectName;
    }

    /**
     * Handle toggling effects as overlays
     *
     * @param {jQuery} effectItem - jQuery element representing the effect list item
     */
    async onToggleOverlay(effectItem) {
        const effectName = effectItem.data().effectName;
        await game.dfreds.effectInterface.toggleEffect(effectName, {
            overlay: true,
        });
    }

    /**
     * Handle duplicating an effect and adding as a custom effect
     *
     * @param {jQuery} effectItem - jQuery element representing the effect list item
     */
    async onDuplicateAsCustom(effectItem) {
        const effectName = effectItem.data().effectName;

        const effect = game.dfreds.effects.all.find(
            (effect) => effect.name === effectName,
        );

        await this._customEffectsHandler.duplicateExistingEffect(effect);

        this._viewMvc.render();
    }

    /**
     * Handle clicks on the export custom effects button
     *
     * @param {MouseEvent} event - event that corresponds to clicking the export
     */
    async onExportCustomEffectsClick(event) {
        event.stopPropagation();
        await this._customEffectsHandler.exportCustomEffectsToJson();
    }

    /**
     * Handle clicks on the import custom effects button
     *
     * @param {MouseEvent} event - event that corresponds to clicking the export
     */
    async onImportCustomEffectsClick(event) {
        event.stopPropagation();
        await this._customEffectsHandler.importCustomEffectsFromJson();
        this._viewMvc.render();
    }

    /**
     * Handles starting the drag for effect items
     * For non-nested effects, populates the dataTransfer with Foundry's expected
     * ActiveEffect type and data to make non-nested effects behave as core does
     *
     * @param {DragEvent} event - event that corresponds to the drag start
     */
    onEffectDragStart(event) {
        const effectName = event.target.dataset.effectName;

        const effect = game.dfreds.effectInterface.findEffectByName(effectName);

        // special handling for nested effects
        if (game.dfreds.effectInterface.hasNestedEffects(effect)) {
            event.dataTransfer.setData(
                "text/plain",
                JSON.stringify({
                    effectName,
                }),
            );
            return;
        }

        event.dataTransfer.setData(
            "text/plain",
            JSON.stringify({
                effectName,
                type: "ActiveEffect",
                data: effect,
            }),
        );
    }
}
