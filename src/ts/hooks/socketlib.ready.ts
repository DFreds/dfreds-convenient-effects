import { MODULE_ID } from "../constants.ts";
import { Sockets } from "../sockets/sockets.ts";
import { Listener } from "./index.ts";
import { EffectInterface } from "../effect-interface.ts";

const SocketlibReady: Listener = {
    listen(): void {
        Hooks.once("socketlib.ready", () => {
            game.dfreds = game.dfreds || {};
            game.dfreds.effectInterface = new EffectInterface({
                sockets: new Sockets(),
            });
            (game.modules.get(MODULE_ID) as ConvenientEffectsModule).api =
                new EffectInterface({
                    sockets: new Sockets(),
                });
        });
    },
};

export { SocketlibReady };
