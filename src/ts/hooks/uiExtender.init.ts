import { MODULE_ID } from "../constants.ts";
import { Listener } from "./index.ts";
import { ConvenientEffectsV2 } from "../ui/ce-app/convenient-effects-v2.ts";
import { Settings } from "../settings.ts";

const UiExtenderInit: Listener = {
    listen(): void {
        Hooks.once("uiExtender.init", (uiExt: any) => {
            const uiExtender = uiExt as UiExtender;
            uiExtender.registerDirectory({
                moduleId: MODULE_ID,
                id: ConvenientEffectsV2.tabName,
                tooltip: "ConvenientEffects.AppName",
                icon: "fas fa-hand-sparkles",
                order: 5,
                applicationClass: ConvenientEffectsV2,
                predicate: () => {
                    const settings = new Settings();
                    const hasAppPermission =
                        game.user.role >= settings.appControlsPermission;
                    return hasAppPermission;
                },
            });
        });
    },
};

export { UiExtenderInit };
