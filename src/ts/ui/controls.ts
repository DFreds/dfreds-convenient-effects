import { Settings } from "../settings.ts";

class Controls {
    #settings: Settings;

    constructor() {
        this.#settings = new Settings();
    }

    initialize(controls: SceneControl[]): void {
        const tokenButton = controls.find(
            (control) => control.name === "token",
        );

        if (!tokenButton) return;

        tokenButton.tools.push(this.#convenientEffectsAppButton);
    }

    get #convenientEffectsAppButton(): SceneControlTool {
        return {
            name: "convenient-effects",
            title: "DFreds Convenient Effects",
            icon: "fas fa-hand-sparkles",
            toolclip: {
                src: "modules/dfreds-convenient-effects/images/toolclip-ce.webm",
                heading: "DFreds Convenient Effects",
                items: [
                    {
                        heading: "Convenient Effects",
                        reference: "CONTROLS.Click",
                    },
                ],
            },
            button: true,
            visible: this.#userAppControlsPermission,
            onClick: () => {
                this.#handleConvenientEffectsClick();
            },
        };
    }

    #handleConvenientEffectsClick() {
        new ConvenientEffectsApp().render(true);
    }

    get #userAppControlsPermission(): boolean {
        return game.user.role >= this.#settings.appControlsPermission;
    }
}

export { Controls };
