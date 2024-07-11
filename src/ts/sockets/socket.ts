import { id as MODULE_ID } from "@static/module.json";
import { ActiveEffectSchema } from "types/foundry/common/documents/active-effect.js";
import { EffectHandler } from "../effects/effect-handler.ts";
import { log } from "../logger.ts";

const SOCKET_REQUESTS = {
    TOGGLE_EFFECT: "toggleEffect",
};

function activateSocketListener(): void {
    const effectHandler = new EffectHandler();

    game.socket.on(
        MODULE_ID,
        async (...[message, userId]: SocketEventParams) => {
            const sender = game.users.get(userId, { strict: true });
            const receiver = game.user;

            log(`Sender is ${sender.name} and receiver is ${receiver.name}`);

            if (!receiver.isGM) return; // Sender can be anyone, receiver should only execute as GM

            switch (message.request) {
                case SOCKET_REQUESTS.TOGGLE_EFFECT: {
                    await effectHandler.toggleEffect({
                        effectData: message.effectData,
                        overlay: message.overlay,
                        uuids: message.uuids,
                    });
                    break;
                }
                default: {
                    throw Error(
                        `Received unrecognized socket emission: ${message.request}`,
                    );
                }
            }
        },
    );
}

interface ToggleEffectMessage {
    request: "toggleEffect";
    effectData: SourceFromSchema<ActiveEffectSchema>;
    overlay: boolean;
    uuids: string[];
}

type SocketMessage = ToggleEffectMessage | { request?: never };
type SocketEventParams = [message: SocketMessage, userId: string];

export { activateSocketListener, SOCKET_REQUESTS, type SocketMessage };
