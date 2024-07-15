import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { EffectDefinition, MigrationType } from "./effect-definition.ts";
import { log } from "../logger.ts";
import { createConvenientEffect } from "../helpers.ts";

class EffectDefinitionDnd5e extends EffectDefinition {
    override systemId: string = "dnd5e";

    override get initialEffects(): Record<
        string,
        DeepPartial<ActiveEffectSource>[]
    > {
        return {
            Conditions: [
                createConvenientEffect({
                    effect: {
                        name: "Blinded",
                        description:
                            "- A blinded creature can't see and automatically fails any ability check that requires sight.<br/>- Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.",
                        img: "modules/dfreds-convenient-effects/images/blinded.svg",
                        statuses: ["blinded"],
                        changes: [
                            {
                                key: `flags.midi-qol.disadvantage.attack.all`,
                                mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                                value: "1",
                            },
                            {
                                key: `flags.midi-qol.grants.advantage.attack.all`,
                                mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                                value: "1",
                            },
                        ],
                    },
                }),
            ],
        };
    }

    override get migrations(): MigrationType[] {
        return [
            {
                key: "2024-07-15-sample-migration",
                date: new Date("2024-07-15"),
                func: async () => {
                    log("Sample migration running");
                },
            },
        ];
    }
}

export { EffectDefinitionDnd5e };
