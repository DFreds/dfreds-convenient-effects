import { Flags } from "./flags.ts";

interface CeEffectIdsFlag {
    flagGetter: (effect: ActiveEffect<any>) => string[] | undefined;
    flagSetter: (effect: ActiveEffect<any>, newIds: string[]) => Promise<any>;
}

const CE_EFFECT_IDS_FLAGS: CeEffectIdsFlag[] = [
    {
        flagGetter: (effect) => Flags.getNestedEffectIds(effect),
        flagSetter: (effect, newIds) => Flags.setNestedEffectIds(effect, newIds),
    },
    {
        flagGetter: (effect) => Flags.getSubEffectIds(effect),
        flagSetter: (effect, newIds) => Flags.setSubEffectIds(effect, newIds),
    },
    {
        flagGetter: (effect) => Flags.getOtherEffectIds(effect),
        flagSetter: (effect, newIds) => Flags.setOtherEffectIds(effect, newIds),
    },
    {
        flagGetter: (effect) => Flags.getIncrementEffectIds(effect),
        flagSetter: (effect, newIds) => Flags.setIncrementEffectIds(effect, newIds),
    },
];

function updateOldCeEffectIds(
    allEffects: ActiveEffect<Item<null>>[],
    oldCeEffectId: string | undefined,
    newCeEffectId: string,
): void {
    for (const { flagGetter, flagSetter } of CE_EFFECT_IDS_FLAGS) {
        allEffects
            .filter((effect) => {
                const ids = flagGetter(effect);

                return oldCeEffectId && ids?.includes(oldCeEffectId);
            })
            .forEach(async (effectWithOldAsNested) => {
                const ids = flagGetter(effectWithOldAsNested) ?? [];

                const indexToReplace = ids?.findIndex((effectId) => effectId === oldCeEffectId);

                if (indexToReplace !== -1) {
                    const updatedIds = [...ids];
                    updatedIds.splice(indexToReplace, 1, newCeEffectId);

                    await flagSetter(effectWithOldAsNested, updatedIds);
                }
            });
    }
}

export { updateOldCeEffectIds };
