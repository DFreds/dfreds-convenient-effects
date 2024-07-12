import { EffectDefinition } from "./effect-definition.ts";
import { EffectDefinitionDnd5e } from "./effect-definition-dnd5e.ts";

const SYSTEM_DEFINITION_MAP: Record<string, EffectDefinition> = {
    dnd5e: new EffectDefinitionDnd5e(),
    sw5e: new EffectDefinitionDnd5e(),
};

export { SYSTEM_DEFINITION_MAP };
