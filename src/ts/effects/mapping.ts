import { EffectDefinition } from "./effect-definition.ts";
import { EffectDefinitionDnd5e } from "./dnd5e/effect-definition-dnd5e.ts";
import { log } from "../logger.ts";

class Mapping {
    #SYSTEM_DEFINITION_MAP: Record<string, EffectDefinition> = {
        dnd5e: new EffectDefinitionDnd5e(),
        sw5e: new EffectDefinitionDnd5e(),
    };

    findMappingForSystemId(): EffectDefinition | undefined {
        log(`System ID is ${game.system.id}`);
        const systemDefinition = this.#SYSTEM_DEFINITION_MAP[game.system.id];

        if (!systemDefinition) {
            log(`No system definition available for system ${game.system.id}`);
            return;
        }

        return systemDefinition;
    }
}

export { Mapping };
