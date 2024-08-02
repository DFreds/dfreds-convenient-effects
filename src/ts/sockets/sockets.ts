import { id as MODULE_ID } from "@static/module.json";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { findActorByUuid, isEffectConvenient } from "../helpers.ts";
import { log } from "../logger.ts";

interface AddEffectMessage {
    request: "addEffect";
    data: AddEffectMessageData;
}

interface RemoveEffectMessage {
    request: "removeEffect";
    data: RemoveEffectMessageData;
}

type SocketMessage =
    | AddEffectMessage
    | RemoveEffectMessage
    | { request?: never };
type SocketEventParams = [message: SocketMessage, userId: string];

interface AddEffectMessageData {
    /**
     * The effect data to add
     */
    effectData: DeepPartial<ActiveEffectSource>;

    /**
     * The UUID of the actor to add the effect to
     */
    uuid: string;
}

interface RemoveEffectMessageData {
    /**
     * The ID of the effect to remove
     */
    effectId?: string;

    /**
     * The name of the effect to remove
     */
    effectName?: string;

    /**
     * The UUID of the actor to remove the effect from
     */
    uuid: string;

    /**
     * Only removes the effect if the origin matches. If undefined, removes any
     * effect with the matching ID or name
     */
    origin?: ActiveEffectOrigin | null;
}

class Sockets {
    #identifier: string;

    constructor() {
        this.#identifier = `module.${MODULE_ID}`;
        this.#activateSocketListener();
    }

    #activateSocketListener(): void {
        game.socket.on(
            this.#identifier,
            async (...[message, userId]: SocketEventParams) => {
                const sender = game.users.get(userId, { strict: true });
                const receiver = game.user;

                log(
                    `Sender is ${sender.name} and receiver is ${receiver.name}`,
                );

                if (!receiver.isGM) return; // Sender can be anyone, receiver should only execute as GM

                switch (message.request) {
                    case "addEffect": {
                        await this.#onAddEffect(message.data);
                        break;
                    }
                    case "removeEffect": {
                        await this.#onRemoveEffect(message.data);
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

    #emitAsGm({
        message,
        handler,
    }: {
        message: SocketMessage;
        handler: () => void | Promise<void>;
    }): void {
        if (game.user.isGM) {
            handler(); // execute locally
        } else {
            if (!game.users.activeGM) {
                throw Error();
            }

            game.socket.emit(this.#identifier, message);
        }
    }

    emitAddEffect(message: AddEffectMessage): void {
        this.#emitAsGm({
            message,
            handler: this.#onAddEffect.bind(this, message.data),
        });
    }

    async #onAddEffect({
        effectData,
        uuid,
    }: AddEffectMessageData): Promise<void> {
        const actor = findActorByUuid(uuid);
        const activeEffectsToApply = [effectData];

        if (!actor) return; // This should already be checked for before the socket

        // TODO this needs to do dynamic effects
        // if (effect.flags[Constants.MODULE_ID]?.[Constants.FLAGS.IS_DYNAMIC]) {
        //     await this._dynamicEffectsAdderDelegate.addDynamicEffects(
        //         effect,
        //         actor,
        //     );
        // }

        await actor.createEmbeddedDocuments(
            "ActiveEffect",
            activeEffectsToApply,
            {
                keepId: true,
                keepEmbeddedIds: true,
            },
        );

        // TODO this needs to do sub effects
        // const subEffects =
        //     effect.flags[Constants.MODULE_ID]?.[Constants.FLAGS.SUB_EFFECTS];
        // if (subEffects) {
        //     // Apply all sub-effects with the original effect being the origin
        //     for (const subEffect of subEffects) {
        //         await game.dfreds.effectInterface.addEffectWith({
        //             effectData: subEffect,
        //             uuid,
        //             origin: this._effectHelpers.getId(effect.name),
        //         });
        //     }
        // }

        log(`Added effect ${effectData.name} to ${actor.name} - ${actor.id}`);
    }

    emitRemoveEffect(message: RemoveEffectMessage): void {
        this.#emitAsGm({
            message,
            handler: this.#onRemoveEffect.bind(this, message.data),
        });
    }

    async #onRemoveEffect({
        effectId,
        effectName,
        uuid,
        origin,
    }: RemoveEffectMessageData): Promise<void> {
        const actor = findActorByUuid(uuid);

        if (!actor) return; // This should already be checked for before the socket

        let effectToRemove: ActiveEffect<Actor<null>> | undefined;

        if (origin) {
            effectToRemove = actor.effects.find((activeEffect) => {
                return (
                    isEffectConvenient(activeEffect) &&
                    (activeEffect.id === effectId ||
                        activeEffect.name === effectName) &&
                    activeEffect.origin === origin
                );
            });
        } else {
            effectToRemove = actor.effects.find((activeEffect) => {
                return (
                    isEffectConvenient(activeEffect) &&
                    (activeEffect.id === effectId ||
                        activeEffect.name === effectName)
                );
            });
        }

        if (!effectToRemove) return;

        await effectToRemove.delete();

        log(
            `Removed effect ${effectToRemove.name} from ${actor.name} - ${actor.id}`,
        );
    }
}

export { Sockets };
export type { SocketMessage };
