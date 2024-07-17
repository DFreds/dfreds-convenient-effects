import { id as MODULE_ID } from "@static/module.json";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import {
    EffectDefinition,
    ItemEffects,
    MigrationType,
} from "../effect-definition.ts";
import { log } from "../../logger.ts";
import { createConvenientEffect } from "../../helpers.ts";
import { Settings } from "src/ts/settings.ts";
import { FLAGS } from "src/ts/constants.ts";

// TODO special: unconscious should apply prone with otherEffects
// TODO special: what to do with exhaustion?
class EffectDefinitionDnd5e extends EffectDefinition {
    override systemId: string = "dnd5e";

    override get initialItemEffects(): ItemEffects[] {
        return [this.#conditions];
    }

    override get migrations(): MigrationType[] {
        return [
            {
                key: "2024-07-15-sample-migration",
                date: new Date("2024-07-15"),
                func: async () => {
                    const settings = new Settings();
                    const itemIds = settings.effectItemIds;
                    const backupItemIds = game.items
                        .filter((item) => {
                            const backupItemId = item.getFlag(
                                MODULE_ID,
                                FLAGS.BACKUP_ID,
                            ) as string | undefined;

                            return backupItemId !== undefined;
                        })
                        .map((backupItem) => backupItem.id);
                    log("Sample migration running");
                },
            },
        ];
    }

    get #conditions(): ItemEffects {
        return {
            itemData: {
                name: "Conditions",
            },
            effects: [
                createConvenientEffect({
                    effect: this.#blinded,
                }),
            ],
        };
    }

    get #blinded(): PreCreate<ActiveEffectSource> {
        return {
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
        };
    }
}

export { EffectDefinitionDnd5e };
