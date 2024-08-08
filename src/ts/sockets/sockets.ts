import { id as MODULE_ID } from "@static/module.json";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { findActorByUuid } from "../utils/finds.ts";
import { log } from "../logger.ts";
import { Mapping } from "../effects/mapping.ts";
import { Flags } from "../utils/flags.ts";

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
    effectData: PreCreate<ActiveEffectSource>;

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
                throw Error("No active GM, unable to socket through a GM");
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
        const actor = await findActorByUuid(uuid);
        const activeEffectsToApply = [effectData];

        if (!actor) return; // This should already be checked for before the socket

        const isDynamic = Flags.isDynamic(effectData);
        if (isDynamic) {
            const mapping = new Mapping();
            const systemDefinition = mapping.findSystemDefinitionForSystemId();

            await systemDefinition?.dynamicEffectsHandler?.handleDynamicEffects(
                effectData,
                actor,
            );
        }

        const createdEffects = await actor.createEmbeddedDocuments(
            "ActiveEffect",
            activeEffectsToApply,
            {
                keepId: true,
                keepEmbeddedIds: true,
            },
        );

        const subEffectIds = Flags.getSubEffectIds(effectData);
        if (subEffectIds && subEffectIds.length > 0) {
            // Apply all sub-effects with the original effect being the origin
            for (const subEffectId of subEffectIds) {
                await game.dfreds.effectInterface.addEffect({
                    effectId: subEffectId,
                    uuid,
                    origin: createdEffects[0].id as ActiveEffectOrigin,
                });
            }
        }

        const otherEffectIds = Flags.getOtherEffectIds(effectData);
        if (otherEffectIds && otherEffectIds.length > 0) {
            // Apply all other effects with no origin
            for (const otherEffectId of otherEffectIds) {
                await game.dfreds.effectInterface.addEffect({
                    effectId: otherEffectId,
                    uuid,
                });
            }
        }

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
        const actor = await findActorByUuid(uuid);

        if (!actor) return; // This should already be checked for before the socket

        const effectToRemove = actor.effects.find((activeEffect) => {
            const isConvenient = Flags.isConvenient(activeEffect);
            const isMatchingId = activeEffect.id === effectId;
            const isMatchingName = activeEffect.name === effectName;
            const isMatchingCeId =
                Flags.getCeEffectId(activeEffect) === effectId;

            const matches =
                isConvenient &&
                (isMatchingId || isMatchingName || isMatchingCeId);

            return origin ? matches && activeEffect.origin === origin : matches;
        });

        if (!effectToRemove) return;

        await effectToRemove.delete();

        log(
            `Removed effect ${effectToRemove.name} from ${actor.name} - ${actor.id}`,
        );
    }
}

export { Sockets };
export type { SocketMessage };
