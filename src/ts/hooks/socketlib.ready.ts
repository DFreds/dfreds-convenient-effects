import { Sockets } from "../sockets/sockets.ts";
import { Listener } from "./index.ts";

const SocketlibReady: Listener = {
    listen(): void {
        Hooks.once("socketlib.ready", () => {
            game.dfreds = game.dfreds || {};
            game.dfreds.effectInterface = new EffectInterface({
                sockets: new Sockets(),
            });
        });
    },
};

export { SocketlibReady };
