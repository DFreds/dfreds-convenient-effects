import { ConvenientEffectsApp } from "./app/convenient-effects-app.ts";
import { MODULE_ID } from "./constants.ts";

class Keybindings {
    #TOGGLE_CONVENIENT_EFFECTS_APP = "toggleConvenientEffectsApp";

    register(): void {
        this.#registerToggleConvenientEffectsApp();
    }

    #registerToggleConvenientEffectsApp(): void {
        game.keybindings.register(
            MODULE_ID,
            this.#TOGGLE_CONVENIENT_EFFECTS_APP,
            {
                name: EN_JSON.ConvenientEffects.KeybindingToggleAppName,
                hint: EN_JSON.ConvenientEffects.KeybindingToggleAppHint,
                onDown: async () => {
                    const openApps = Object.values(ui.windows);
                    const ceApp = openApps.find(
                        (app) => app instanceof ConvenientEffectsApp,
                    );

                    if (ceApp) {
                        await ceApp.close();
                    } else {
                        new ConvenientEffectsApp().render(true);
                    }
                },
            },
        );
    }
}

export { Keybindings };
