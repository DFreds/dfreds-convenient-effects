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
