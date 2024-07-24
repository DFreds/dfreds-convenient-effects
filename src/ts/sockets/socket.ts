import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { SocketEffectHandler } from "./socket-effect-handler.ts";
import { log } from "../logger.ts";

function activateSocketListener(): void {
    game.socket.on(
        SocketEffectHandler.IDENTIFIER,
        async (...[message, userId]: SocketEventParams) => {
            const socketEffectHandler = new SocketEffectHandler();
            const sender = game.users.get(userId, { strict: true });
            const receiver = game.user;

            log(`Sender is ${sender.name} and receiver is ${receiver.name}`);

            if (!receiver.isGM) return; // Sender can be anyone, receiver should only execute as GM

            switch (message.request) {
                case "addEffect": {
                    await socketEffectHandler.addEffect({
                        effectData: message.effectData,
                        uuid: message.uuid,
                    });
                    break;
                }
                case "removeEffect": {
                    await socketEffectHandler.removeEffect({
                        effectId: message.effectId,
                        effectName: message.effectName,
                        uuid: message.uuid,
                        origin: message.origin,
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

interface AddEffectMessage {
    request: "addEffect";
    effectData: DeepPartial<ActiveEffectSource>;
    uuid: string;
}

interface RemoveEffectMessage {
    request: "removeEffect";
    effectId?: string;
    effectName?: string;
    uuid: string;
    origin?: ActiveEffectOrigin | null;
}

type SocketMessage =
    | AddEffectMessage
    | RemoveEffectMessage
    | { request?: never };
type SocketEventParams = [message: SocketMessage, userId: string];

export { activateSocketListener, type SocketMessage };
