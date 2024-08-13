import { id as MODULE_ID } from "@static/module.json";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { findActorByUuid } from "../utils/finds.ts";
import { log } from "../logger.ts";
import { Mapping } from "../effects/mapping.ts";
import { Flags } from "../utils/flags.ts";
import Document from "types/foundry/common/abstract/document.js";

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
    #socket: SocketlibSocket;

    constructor() {
        this.#socket = socketlib.registerModule(MODULE_ID);
        this.#socket.register("addEffect", this.#onAddEffect.bind(this));
        this.#socket.register("removeEffect", this.#onRemoveEffect.bind(this));
    }

    async emitAddEffect(message: AddEffectMessageData): Promise<Document[]> {
        return this.#socket.executeAsGM("addEffect", message) as Promise<
            Document[]
        >;
    }

    async #onAddEffect({
        effectData,
        uuid,
    }: AddEffectMessageData): Promise<Document[]> {
        const actor = await findActorByUuid(uuid);
        const activeEffectsToApply = [effectData];

        if (!actor) return []; // This should already be checked for before the socket

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

        return createdEffects;
    }

    async emitRemoveEffect(message: RemoveEffectMessageData): Promise<void> {
        return this.#socket.executeAsGM(
            "removeEffect",
            message,
        ) as Promise<void>;
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
