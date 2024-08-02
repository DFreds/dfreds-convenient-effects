import Settings from "./settings.js";
import { addNestedEffectsToEffectConfig } from "./ui/add-nested-effects-to-effect-config.js";

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
