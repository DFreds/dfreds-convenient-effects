import { ConvenientEffectsV2 } from "./ui/ce-app/convenient-effects-v2.ts";
import { MODULE_ID } from "./constants.ts";

class Keybindings {
    #TOGGLE_CONVENIENT_EFFECTS_APP = "toggleConvenientEffectsApp";
    #TOGGLE_CONVENIENT_EFFECTS_APP_POPOUT = "toggleConvenientEffectsAppPopout";

    register(): void {
        this.#registerToggleConvenientEffectsApp();
        this.#registerToggleConvenientEffectsAppPopout();
    }

    #registerToggleConvenientEffectsApp(): void {
        game.keybindings.register(
            MODULE_ID,
            this.#TOGGLE_CONVENIENT_EFFECTS_APP,
            {
                name: "ConvenientEffects.Keybinding.ToggleAppName",
                hint: "ConvenientEffects.Keybinding.ToggleAppHint",
                onDown: async () => {
                    const applications = foundry.applications.instances;

                    const convenientEffectsV2 = applications.get(
                        // @ts-expect-error The types provided by pf2e think this is a number
                        ConvenientEffectsV2.tabName,
                    );

                    if (!convenientEffectsV2) {
                        return;
                    }

                    const ceApp = convenientEffectsV2 as ConvenientEffectsV2;
                    if (ceApp.active) {
                        // @ts-expect-error foundry.ui is not defined
                        foundry.ui.sidebar.toggleExpanded();
                    } else {
                        ceApp.activate();
                    }
                },
            },
        );
    }

    #registerToggleConvenientEffectsAppPopout(): void {
        game.keybindings.register(
            MODULE_ID,
            this.#TOGGLE_CONVENIENT_EFFECTS_APP_POPOUT,
            {
                name: "ConvenientEffects.Keybinding.ToggleAppPopoutName",
                hint: "ConvenientEffects.Keybinding.ToggleAppPopoutHint",
                onDown: async () => {
                    const applications = foundry.applications.instances;

                    const convenientEffectsV2 = applications.get(
                        // @ts-expect-error The types provided by pf2e think this is a number
                        ConvenientEffectsV2.tabName,
                    );

                    if (!convenientEffectsV2) {
                        return;
                    }

                    const ceApp = convenientEffectsV2 as ConvenientEffectsV2;
                    if (ceApp.popout?.rendered) {
                        ceApp.popout.close();
                    } else {
                        ceApp.renderPopout();
                    }
                },
            },
        );
    }
}

export { Keybindings };
