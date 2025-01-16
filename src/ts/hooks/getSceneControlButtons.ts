import { Controls } from "../ui/controls.ts";
import { Listener } from "./index.ts";

/**
 * Add the controls for the app
 */
const GetSceneControlButtons: Listener = {
    listen(): void {
        // TODO replace with lib-dfreds-ui-extender
        Hooks.on("getSceneControlButtons", (controls: SceneControl[]) => {
            new Controls().initialize(controls);
        });
    },
};

export { GetSceneControlButtons };
