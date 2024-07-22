import { EffectDefinition } from "./effect-definition.ts";
import { EffectDefinitionDnd5e } from "./dnd5e/effect-definition-dnd5e.ts";
import { log } from "../logger.ts";

class Mapping {
    #SYSTEM_DEFINITION_MAP: Record<string, EffectDefinition> = {
        dnd5e: new EffectDefinitionDnd5e(),
        sw5e: new EffectDefinitionDnd5e(),
    };

    fetchMappingForSystemId(systemId: string): EffectDefinition | undefined {
        const systemDefinition = this.#SYSTEM_DEFINITION_MAP[systemId];
        log(systemDefinition);

        return systemDefinition;
    }
}

export { Mapping };
