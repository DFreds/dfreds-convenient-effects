import { EffectDefinition, ItemEffects } from "../effect-definition.ts";
import { classFeatures } from "./defined-effects/class-features.ts";
import { conditions } from "./defined-effects/conditions.ts";
import { equipment } from "./defined-effects/equipment.ts";
import { magicItems } from "./defined-effects/magic-items.ts";
import { other } from "./defined-effects/other.ts";
import { spells } from "./defined-effects/spells.ts";
import { migrateOldCustomEffects } from "./migrations/2024-08-14-migrate-old-custom-effects.ts";
import { migrateDnd5eItemType } from "./migrations/2026-03-18-migrate-dnd5e-item-type.ts";
import {
    isDnd5eWithLeveledConditions,
    migrateLeveledExhaustion,
} from "./migrations/2026-09-15-migrate-leveled-exhaustion.ts";

class EffectDefinitionDnd5e extends EffectDefinition {
    override systemId: string = "dnd5e";

    override version: number = 4;

    override get initialItemEffects(): ItemEffects[] {
        return [conditions(), spells(), classFeatures(), equipment(), magicItems(), other()];
    }

    override get migrations(): MigrationType[] {
        // Registered only when supported, since a skipped migration is marked as ran and would never run after the
        // world upgrades to dnd5e 6.0
        return [
            migrateOldCustomEffects,
            migrateDnd5eItemType,
            ...(isDnd5eWithLeveledConditions() ? [migrateLeveledExhaustion] : []),
        ];
    }
}

export { EffectDefinitionDnd5e };
