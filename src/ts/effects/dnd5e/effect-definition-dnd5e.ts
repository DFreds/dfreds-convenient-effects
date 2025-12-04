import { EffectDefinition, ItemEffects } from "../effect-definition.ts";
import { migrateOldCustomEffects } from "./migrations/2024-08-14-migrate-old-custom-effects.ts";
import { classFeatures } from "./defined-effects/class-features.ts";
import { conditions } from "./defined-effects/conditions.ts";
import { equipment } from "./defined-effects/equipment.ts";
import { magicItems } from "./defined-effects/magic-items.ts";
import { other } from "./defined-effects/other.ts";
import { spells } from "./defined-effects/spells.ts";

class EffectDefinitionDnd5e extends EffectDefinition {
    override systemId: string = "dnd5e";

    override get initialItemEffects(): ItemEffects[] {
        return [
            conditions(),
            spells(),
            classFeatures(),
            equipment(),
            magicItems(),
            other(),
        ];
    }

    override get migrations(): MigrationType[] {
        return [migrateOldCustomEffects];
    }
}

export { EffectDefinitionDnd5e };
