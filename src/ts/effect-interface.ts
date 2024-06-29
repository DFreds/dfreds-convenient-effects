import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";

class EffectInterface {
    findEffectById(effectId: string): ActiveEffect<null> | null {
        return null;
    }

    findEffectByName(effectName: string): ActiveEffect<null> | null {
        return null;
    }

    hasEffectApplied({
        effectId,
        effectName,
        uuid,
    }: {
        effectId?: string;
        effectName?: string;
        uuid: string;
    }): boolean {
        return false;
    }

    async toggleEffect({
        effectId,
        effectName,
        overlay = false,
        uuids = [],
    }: {
        effectId?: string;
        effectName?: string;
        overlay: boolean;
        uuids: string[];
    }): Promise<void> {
        let actorUuids = uuids;
        if (actorUuids.length === 0) {
        }
    }

    async addEffect({
        effectId,
        effectName,
        uuid,
        origin,
        overlay = false,
        metadata,
    }: {
        effectId?: string;
        effectName?: string;
        uuid: string;
        origin?: string;
        overlay: boolean;
        metadata: object;
    }): Promise<void> {}

    async addEffectWith({
        effectData,
        uuid,
        origin,
        overlay = false,
    }: {
        effectData: PreCreate<ActiveEffectSource>;
        uuid: string;
        origin?: string;
        overlay: boolean;
    }): Promise<void> {}

    async removeEffect({
        effectId,
        effectName,
        origin,
    }: {
        effectId?: string;
        effectName?: string;
        origin?: string;
    }): Promise<void> {}

    async createNewCustomEffectsWith({
        effects,
    }: {
        effects: PreCreate<ActiveEffectSource>[];
    }): Promise<void> {}
}

export { EffectInterface };
