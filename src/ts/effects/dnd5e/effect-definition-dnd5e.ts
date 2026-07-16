import { EffectDefinition, ItemEffects } from "../effect-definition.ts";
import { classFeatures } from "./defined-effects/class-features.ts";
import { conditions } from "./defined-effects/conditions.ts";
import { conditions2024 } from "./defined-effects/conditions-2024.ts";
import { equipment } from "./defined-effects/equipment.ts";
import { magicItems } from "./defined-effects/magic-items.ts";
import { other } from "./defined-effects/other.ts";
import { spells } from "./defined-effects/spells.ts";
import { migrateOldCustomEffects } from "./migrations/2024-08-14-migrate-old-custom-effects.ts";
import { migrateDnd5eItemType } from "./migrations/2026-03-18-migrate-dnd5e-item-type.ts";

class EffectDefinitionDnd5e extends EffectDefinition {
    override systemId: string = "dnd5e";

    override version: number = 1;

    override get initialItemEffects(): ItemEffects[] {
        return [conditions(), conditions2024(), spells(), classFeatures(), equipment(), magicItems(), other()];
    }

    override get migrations(): MigrationType[] {
        return [migrateOldCustomEffects, migrateDnd5eItemType];
    }
}

export { EffectDefinitionDnd5e };
