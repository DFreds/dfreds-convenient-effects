import { ConvenientEffectsV2 } from "./ui/ce-app/convenient-effects-v2.ts";
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
                name: "ConvenientEffects.Keybinding.ToggleAppName",
                hint: "ConvenientEffects.Keybinding.ToggleAppHint",
                onDown: async () => {
                    const applications = foundry.applications.instances;

                    const convenientEffectsV2 = applications.get(
                        // @ts-expect-error The types provided by pf2e think this is a number
                        "convenient-effects-v2",
                    );

                    if (convenientEffectsV2) {
                        (convenientEffectsV2 as ConvenientEffectsV2).close();
                    } else {
                        new ConvenientEffectsV2().render(true);
                    }
                },
            },
        );
    }
}

export { Keybindings };
