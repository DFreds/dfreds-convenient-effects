import { ActiveEffectSchema } from "types/foundry/common/documents/active-effect.js";
import { findActorByUuid, isEffectConvenient } from "../helpers.ts";

interface IToggleEffect {
    effectData: SourceFromSchema<ActiveEffectSchema>;
    overlay: boolean;
    uuids: string[];
}

interface IHasEffectApplied {
    effectData: SourceFromSchema<ActiveEffectSchema>;
    uuid: string;
}

interface IAddEffect {
    effectData: SourceFromSchema<ActiveEffectSchema>;
    overlay: boolean;
    uuid: string;
}

interface IRemoveEffect {
    effectData: SourceFromSchema<ActiveEffectSchema>;
    uuid: string;
    origin?: string | null;
}

class EffectHandler {
    async toggleEffect({
        effectData,
        overlay,
        uuids,
    }: IToggleEffect): Promise<void> {
        for (const uuid of uuids) {
            if (this.hasEffectApplied({ effectData, uuid })) {
                // TODO if has effect applied, remove it
                await this.removeEffect({ effectData, uuid });
            } else {
                await this.addEffect({ effectData, overlay, uuid });
            }
        }
    }

    hasEffectApplied({ effectData, uuid }: IHasEffectApplied): boolean {
        const actor = findActorByUuid(uuid);
        return (
            actor?.effects?.some(
                (activeEffect) =>
                    isEffectConvenient(activeEffect) &&
                    (activeEffect?.id === effectData._id ||
                        activeEffect?.name === effectData.name) &&
                    !activeEffect?.disabled,
            ) ?? false
        );
    }

    async addEffect({ effectData, overlay, uuid }: IAddEffect): Promise<void> {}

    async removeEffect({
        effectData,
        uuid,
        origin,
    }: IRemoveEffect): Promise<void> {}
}
export { EffectHandler };
