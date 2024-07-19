import { Controls } from "../ui/controls.ts";
import { Listener } from "./index.ts";

/**
 * Add the controls for the app
 */
const GetSceneControlButtons: Listener = {
    listen(): void {
        Hooks.on("getSceneControlButtons", (controls: SceneControl[]) => {
            new Controls().initialize(controls);
        });
    },
};

export { GetSceneControlButtons };
