import Constants from "./constants.js";
import Controls from "./ui/controls.js";
import EffectDefinitionsDelegate from "./systems/effect-definitions-delegate.js";
import EffectHelpers from "./effects/effect-helpers.js";
import EffectInterface from "./effect-interface.js";
import FoundryHelpers from "./util/foundry-helpers.js";
import HandlebarHelpers from "./ui/handlebar-helpers.js";
import MacroHandler from "./ui/macro-handler.js";
import Settings from "./settings.js";
import StatusEffects from "./effects/status-effects.js";
import TextEnrichers from "./ui/text-enrichers.js";
import { addNestedEffectsToEffectConfig } from "./ui/add-nested-effects-to-effect-config.js";
import { libWrapper } from "./lib/shim.js";
import { removeCustomItemFromSidebar } from "./ui/remove-custom-item-from-sidebar.js";

/**
 * Handle setting up the API when socket lib is ready
 */
Hooks.once("socketlib.ready", () => {
    game.dfreds.effects = new EffectDefinitionsDelegate();
    game.dfreds.statusEffects = new StatusEffects();
});

/**
 * Handle setting up the lib wrapper overrides
 */
Hooks.once("setup", () => {
    libWrapper.register(
        Constants.MODULE_ID,
        "TokenHUD.prototype._onToggleEffect",
        function (wrapper, ...args) {
            game.dfreds.statusEffects.onToggleEffect({
                token: this.object,
                wrapper,
                args,
            });
        },
    );

    libWrapper.register(
        Constants.MODULE_ID,
        "TokenHUD.prototype._getStatusEffectChoices",
        function (wrapper, ...args) {
            const token = this.object;
            return game.dfreds.statusEffects.getStatusEffectChoices({
                token,
                wrapper,
                args,
            });
        },
    );

    libWrapper.register(
        Constants.MODULE_ID,
        "TokenHUD.prototype.refreshStatusIcons",
        function (wrapper, ...args) {
            const tokenHud = this;
            game.dfreds.statusEffects.refreshStatusIcons(tokenHud);
        },
    );

    game.dfreds.effects.initialize();
    game.dfreds.statusEffects.initialize();

    Hooks.callAll(`${Constants.MODULE_ID}.ready`);
});

/**
 * Handle changing the rendered active effect config
 */
Hooks.on(
    "renderActiveEffectConfig",
    async (activeEffectConfig, $html, _data) => {
        const settings = new Settings();

        // Only add nested effects if the effect exists on the custom effect item
        if (
            !activeEffectConfig.object.parent ||
            activeEffectConfig.object.parent.id != settings.customEffectsItemId
        )
            return;
        addNestedEffectsToEffectConfig(activeEffectConfig, $html);
    },
);

/**
 * Handle re-rendering the ConvenientEffectsApp if it is open and a custom convenient active effect sheet is closed
 */
Hooks.on("closeActiveEffectConfig", (activeEffectConfig, _html) => {
    const settings = new Settings();

    // Only re-render if the effect exists on the custom effect
    if (activeEffectConfig.object.parent?.id != settings.customEffectsItemId)
        return;

    const foundryHelpers = new FoundryHelpers();
    foundryHelpers.renderConvenientEffectsAppIfOpen();
});

/**
 * Handle dropping an effect onto the hotbar
 */
Hooks.on("hotbarDrop", (_bar, data, slot) => {
    if (!data.effectName) return;
    delete data.type; // This stops dnd5e from creating its own macro by obscuring that the drop data is an ActiveEffect
    const macroHandler = new MacroHandler();
    macroHandler.createMacro(data, slot);
});

/**
 * Handle dropping an effect onto an actor sheet
 */
Hooks.on("dropActorSheetData", (actor, _actorSheetCharacter, data) => {
    if (!data.effectName) return;

    const effect = game.dfreds.effectInterface.findEffectByName(
        data.effectName,
    );

    // core will handle the drop since we are not using a nested effect
    if (!game.dfreds.effectInterface.hasNestedEffects(effect)) return;

    game.dfreds.effectInterface.addEffect({
        effectName: data.effectName,
        uuid: actor.uuid,
    });
});
