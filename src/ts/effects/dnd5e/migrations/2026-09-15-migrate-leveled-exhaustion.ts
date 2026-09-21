import { MODULE_ID } from "../../../constants.ts";
import { error, log } from "../../../logger.ts";
import { findAllEffects } from "../../../utils/finds.ts";
import { Flags } from "../../../utils/flags.ts";

/**
 * Whether the world is running dnd5e 6.0 or later, which added leveled conditions
 */
function isDnd5eWithLeveledConditions(): boolean {
    return game.system.id === "dnd5e" && !foundry.utils.isNewerVersion("6.0.0", game.system.version);
}

const migration: MigrationType = {
    key: "2026-09-15-migrate-leveled-exhaustion",
    date: new Date("2026-09-15"),
    func: async (): Promise<boolean> => {
        if (!isDnd5eWithLeveledConditions()) return true;

        log("Migrating exhaustion to a leveled status...");

        try {
            const effects = findAllEffects({ backup: false });

            // The old built-in exhaustion chain is the only effect that both updates the actor and has increment
            // members. Matching on that instead of the name keeps this working for translated effect IDs.
            const exhaustionParents = effects.filter(
                (effect) => Flags.isUpdatesActor(effect) && (Flags.getIncrementEffectIds(effect)?.length ?? 0) > 0,
            );
            const memberIds = new Set(exhaustionParents.flatMap((effect) => Flags.getIncrementEffectIds(effect) ?? []));

            const referencedIds = new Set(
                effects
                    .filter((effect) => !exhaustionParents.includes(effect))
                    .flatMap((effect) => [
                        ...(Flags.getIncrementEffectIds(effect) ?? []),
                        ...(Flags.getNestedEffectIds(effect) ?? []),
                        ...(Flags.getSubEffectIds(effect) ?? []),
                        ...(Flags.getOtherEffectIds(effect) ?? []),
                    ]),
            );

            for (const parent of exhaustionParents) {
                await parent.unsetFlag(MODULE_ID, "updatesActor");
                await parent.unsetFlag(MODULE_ID, "incrementEffectIds");
                await parent.update({
                    description: `<p>${game.i18n.localize("ConvenientEffects.Dnd.Exhaustion.description")}</p>`,
                });
            }

            const membersToDelete = effects.filter((effect) => {
                const ceEffectId = Flags.getCeEffectId(effect);
                return (
                    !!ceEffectId &&
                    memberIds.has(ceEffectId) &&
                    !!Flags.isUpdatesActor(effect) &&
                    !referencedIds.has(ceEffectId)
                );
            });

            await Promise.all(membersToDelete.map((effect) => effect.delete()));

            log(`Migrated ${exhaustionParents.length} exhaustion effects and removed ${membersToDelete.length} levels`);
        } catch (err: any) {
            error(`Error migrating exhaustion to a leveled status. ${err.message}`);
            return false;
        }

        return true;
    },
};

export { isDnd5eWithLeveledConditions, migration as migrateLeveledExhaustion };
