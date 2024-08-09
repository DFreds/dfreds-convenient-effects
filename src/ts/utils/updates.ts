import { Flags } from "./flags.ts";

function updateOldNestedIds(
    allEffects: ActiveEffect<Item<null>>[],
    oldCeEffectId: string | undefined,
    newCeEffectId: string,
): void {
    updateOldCeEffectIds({
        allEffects,
        oldCeEffectId,
        newCeEffectId,
        flagGetter: (effect) => {
            return Flags.getNestedEffectIds(effect);
        },
        flagSetter: async (effect, newIds) => {
            await Flags.setNestedEffectIds(effect, newIds);
        },
    });
}

function updateOldSubIds(
    allEffects: ActiveEffect<Item<null>>[],
    oldCeEffectId: string | undefined,
    newCeEffectId: string,
): void {
    updateOldCeEffectIds({
        allEffects,
        oldCeEffectId,
        newCeEffectId,
        flagGetter: (effect) => {
            return Flags.getSubEffectIds(effect);
        },
        flagSetter: async (effect, newIds) => {
            await Flags.setSubEffectIds(effect, newIds);
        },
    });
}

function updateOldOtherIds(
    allEffects: ActiveEffect<Item<null>>[],
    oldCeEffectId: string | undefined,
    newCeEffectId: string,
): void {
    updateOldCeEffectIds({
        allEffects,
        oldCeEffectId,
        newCeEffectId,
        flagGetter: (effect) => {
            return Flags.getOtherEffectIds(effect);
        },
        flagSetter: async (effect, newIds) => {
            await Flags.setOtherEffectIds(effect, newIds);
        },
    });
}

function updateOldCeEffectIds({
    allEffects,
    oldCeEffectId,
    newCeEffectId,
    flagGetter,
    flagSetter,
}: {
    allEffects: ActiveEffect<Item<null>>[];
    oldCeEffectId: string | undefined;
    newCeEffectId: string;
    flagGetter: (effect: ActiveEffect<any>) => string[] | undefined;
    flagSetter: (effect: ActiveEffect<any>, newIds: string[]) => Promise<any>;
}): void {
    allEffects
        .filter((effect) => {
            const ids = flagGetter(effect);

            return oldCeEffectId && ids?.includes(oldCeEffectId);
        })
        .forEach(async (effectWithOldAsNested) => {
            const ids = flagGetter(effectWithOldAsNested) ?? [];

            const indexToReplace = ids?.findIndex(
                (effectId) => effectId === oldCeEffectId,
            );

            if (indexToReplace !== -1) {
                const updatedIds = [...ids];
                updatedIds.splice(indexToReplace, 1, newCeEffectId);

                await flagSetter(effectWithOldAsNested, updatedIds);
            }
        });
}

export { updateOldNestedIds, updateOldSubIds, updateOldOtherIds };
