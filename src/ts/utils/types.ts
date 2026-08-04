import { EffectChangeData } from "@common/documents/active-effect.mjs";

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

/**
 * Foundry v14 moved effect changes out of the document schema and into system
 * data, which is typed as a bare object because its shape depends on the effect
 * subtype. This describes the part we rely on.
 */
interface EffectSystemData {
    changes?: Partial<EffectChangeData>[];
}

/** The system data of an effect, creating it if the effect does not have any yet. */
function effectSystem(effect: { system?: object }): EffectSystemData {
    return (effect.system ??= {}) as EffectSystemData;
}

export { effectSystem, notEmpty };
export type { EffectSystemData };
