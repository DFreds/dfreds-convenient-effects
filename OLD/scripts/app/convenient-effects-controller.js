import Constants from "../constants.js";
import CustomEffectsHandler from "../effects/custom-effects-handler.js";
import DynamicEffectsAdderDelegate from "../systems/dynamic-effects-adder-delegate.js";
import FoundryHelpers from "../util/foundry-helpers.js";
import Settings from "../settings.js";

export default class ConvenientEffectsController {
    constructor(viewMvc) {
        this._customEffectsHandler = new CustomEffectsHandler();
        this._dynamicEffectsAdderDelegate = new DynamicEffectsAdderDelegate();
        this._foundryHelpers = new FoundryHelpers();
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
