import { MODULE_ID } from "../constants.ts";
import { Sockets } from "../sockets/sockets.ts";
import { Listener } from "./index.ts";
import { EffectInterface } from "../effect-interface.ts";

const SocketlibReady: Listener = {
    listen(): void {
        Hooks.once("socketlib.ready", () => {
            const sockets = new Sockets();

            game.dfreds = game.dfreds || {};
            game.dfreds.effectInterface = new EffectInterface({
                sockets,
            });
            (game.modules.get(MODULE_ID) as ConvenientEffectsModule).api =
                new EffectInterface({
                    sockets,
                });
        });
    },
};

export { SocketlibReady };
