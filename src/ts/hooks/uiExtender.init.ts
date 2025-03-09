import { MODULE_ID } from "../constants.ts";
import { Listener } from "./index.ts";
import { Settings } from "../settings.ts";
import { ConvenientEffectsApp } from "../app/convenient-effects-app.ts";

const UiExtenderInit: Listener = {
    listen(): void {
        Hooks.once("uiExtender.init", (uiExt: any) => {
            const uiExtender = uiExt as UiExtender;
            const settings = new Settings();

            uiExtender.registerSceneControl({
                moduleId: MODULE_ID,
                name: "token",
                predicate: () => {
                    return game.user.role >= settings.appControlsPermission;
                },
                tool: {
                    name: "convenient-effects",
                    title: EN_JSON.ConvenientEffects.AppName,
                    icon: "fas fa-hand-sparkles",
                    toolclip: {
                        src: "modules/dfreds-convenient-effects/images/toolclip-ce.webm",
                        heading: EN_JSON.ConvenientEffects.AppName,
                        items: [
                            {
                                heading: EN_JSON.ConvenientEffects.AppName,
                                reference: "CONTROLS.Click",
                            },
                        ],
                    },
                    button: true,
                    visible: true,
                    onClick: () => {
                        new ConvenientEffectsApp().render(true);
                    },
                },
            });
        });
    },
};

export { UiExtenderInit };
