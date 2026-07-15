import { ItemEffects } from "../../effect-definition.ts";
import { movement } from "../changes/attributes.ts";
import { attackBonus, checkBonus, saveBonus } from "../changes/bonuses.ts";
import { disadvantageAttack } from "../changes/midi-qol.ts";
import { ActiveEffectSource } from "@client/documents/_module.mjs";
import { EffectChangeData } from "@common/documents/active-effect.mjs";
import { createConvenientEffect } from "../../../utils/creates.ts";
import {
    blinded,
    charmed,
    concentrating,
    dead,
    deafened,
    frightened,
    incapacitated,
    invisible,
    paralyzed,
    petrified,
    poisoned,
    prone,
    restrained,
    stunned,
    unconscious,
    wounded,
} from "./conditions.ts";

function conditions2024(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Folders.Conditions2024"),
        },
        effects: [
            blinded(),
            charmed(),
            concentrating(),
            dead(),
            deafened(),
            exhaustion1(),
            exhaustion2(),
            exhaustion3(),
            exhaustion4(),
            exhaustion5(),
            frightened(),
            grappled(),
            incapacitated(),
            invisible(),
            paralyzed(),
            petrified(),
            poisoned(),
            prone(),
            restrained(),
            stunned(),
            unconscious(),
            wounded(),
        ],
    };
}

function exhaustionChanges(level: number): Partial<EffectChangeData>[] {
    const testPenalty = String(-2 * level);
    return [
        checkBonus({ value: testPenalty }),
        saveBonus({ value: testPenalty }),
        attackBonus({ attackType: "mwak", value: testPenalty }),
        attackBonus({ attackType: "msak", value: testPenalty }),
        attackBonus({ attackType: "rwak", value: testPenalty }),
        attackBonus({ attackType: "rsak", value: testPenalty }),
        movement({
            movementType: "all",
            value: String(-5 * level),
            priority: 25,
        }),
    ];
}

function exhaustion1(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion12024.name"),
            statuses: ["exhaustion"],
            description: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion12024.description"),
            img: "modules/dfreds-convenient-effects/images/exhaustion1.svg",
            flags: { dnd5e: { exhaustionLevel: 1 } },
            changes: exhaustionChanges(1),
        },
    });
}

function exhaustion2(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion22024.name"),
            statuses: ["exhaustion"],
            description: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion22024.description"),
            img: "modules/dfreds-convenient-effects/images/exhaustion2.svg",
            flags: { dnd5e: { exhaustionLevel: 2 } },
            changes: exhaustionChanges(2),
        },
    });
}

function exhaustion3(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion32024.name"),
            statuses: ["exhaustion"],
            description: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion32024.description"),
            img: "modules/dfreds-convenient-effects/images/exhaustion3.svg",
            flags: { dnd5e: { exhaustionLevel: 3 } },
            changes: exhaustionChanges(3),
        },
    });
}

function exhaustion4(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion42024.name"),
            statuses: ["exhaustion"],
            description: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion42024.description"),
            img: "modules/dfreds-convenient-effects/images/exhaustion4.svg",
            flags: { dnd5e: { exhaustionLevel: 4 } },
            changes: exhaustionChanges(4),
        },
    });
}

function exhaustion5(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion52024.name"),
            statuses: ["exhaustion"],
            description: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion52024.description"),
            img: "modules/dfreds-convenient-effects/images/exhaustion5.svg",
            flags: { dnd5e: { exhaustionLevel: 5 } },
            changes: exhaustionChanges(5),
        },
    });
}

function grappled(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Grappled2024.name"),
            statuses: ["grappled"],
            description: game.i18n.localize("ConvenientEffects.Dnd.Grappled2024.description"),
            img: "modules/dfreds-convenient-effects/images/grappled.svg",
            changes: [
                movement({
                    movementType: "all",
                    value: "0",
                    priority: 25,
                }),
                disadvantageAttack({
                    attackType: "all",
                }),
            ],
        },
    });
}

export { conditions2024, exhaustion1, exhaustion2, exhaustion3, exhaustion4, exhaustion5, grappled };
