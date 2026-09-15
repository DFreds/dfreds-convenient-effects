import { DynamicEffectsHandler } from "./dynamic-effects-handler.ts";
import { EffectDefinition } from "./effect-definition.ts";
import { EffectDefinitionDnd5e } from "./dnd5e/effect-definition-dnd5e.ts";
import { log } from "../logger.ts";
import { DynamicEffectsHandlerDnd5e } from "./dnd5e/dynamic-effects-handler-dnd5e.ts";
import { LeveledEffectsHandler } from "./leveled-effects-handler.ts";
import { LeveledEffectsHandlerDnd5e } from "./dnd5e/leveled-effects-handler-dnd5e.ts";

interface SystemDefinition {
    effectDefinition: EffectDefinition;
    dynamicEffectsHandler?: DynamicEffectsHandler;
    leveledEffectsHandler?: LeveledEffectsHandler;
}

class Mapping {
    #SYSTEM_DEFINITION_MAP: Record<string, SystemDefinition> = {
        dnd5e: {
            effectDefinition: new EffectDefinitionDnd5e(),
            dynamicEffectsHandler: new DynamicEffectsHandlerDnd5e(),
            leveledEffectsHandler: new LeveledEffectsHandlerDnd5e(),
        },
        sw5e: {
            effectDefinition: new EffectDefinitionDnd5e(),
            dynamicEffectsHandler: new DynamicEffectsHandlerDnd5e(),
            leveledEffectsHandler: new LeveledEffectsHandlerDnd5e(),
        },
    };

    findSystemDefinitionForSystemId(): SystemDefinition | undefined {
        log(`System ID is ${game.system.id}`);
        const systemDefinition = this.#SYSTEM_DEFINITION_MAP[game.system.id];

        if (!systemDefinition) {
            log(`No system definition available for system ${game.system.id}`);
            return;
        }

        return systemDefinition;
    }
}

// Cached because this is checked for every effect when rendering the app
let cachedLeveledEffectsHandler: { handler: LeveledEffectsHandler | undefined } | undefined;

function findLeveledEffectsHandler(): LeveledEffectsHandler | undefined {
    cachedLeveledEffectsHandler ??= {
        handler: new Mapping().findSystemDefinitionForSystemId()?.leveledEffectsHandler,
    };
    return cachedLeveledEffectsHandler.handler;
}

export { Mapping, findLeveledEffectsHandler };
