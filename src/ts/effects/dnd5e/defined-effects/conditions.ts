import { createConvenientEffect } from "src/ts/utils/creates.ts";
import { ItemEffects } from "../../effect-definition.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Flags } from "src/ts/utils/flags.ts";
import { notEmpty } from "src/ts/utils/types.ts";
import { movement, exhaustion } from "../changes/attributes.ts";
import {
    advantageAttack,
    disadvantageAbilityCheck,
    disadvantageAttack,
    disadvantageAbilitySave,
    failAbilitySave,
    grantAdvantageAttack,
    grantDisadvantageAttack,
    grantCriticalRange,
} from "../changes/midi-qol.ts";
import { initiativeDisadv } from "../changes/dnd5e.ts";
import {
    addAllDamageResistance,
    addDamageImmunity,
} from "../changes/traits.ts";

function conditions(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.Folders.Conditions",
            ),
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

function blinded(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Blinded.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Blinded.description",
            ),
            img: "modules/dfreds-convenient-effects/images/blinded.svg",
            statuses: ["blinded"],
            changes: [
                disadvantageAttack({
                    attackType: "all",
                }),
                grantAdvantageAttack({
                    attackType: "all",
                }),
            ],
        },
    });
}

function charmed(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Charmed.name"),
            statuses: ["charmed"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Charmed.description",
            ),
            img: "modules/dfreds-convenient-effects/images/charmed.svg",
        },
    });
}

function concentrating(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.Concentrating.name",
            ),
            statuses: ["concentrating"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Concentrating.description",
            ),
            img: "modules/dfreds-convenient-effects/images/concentrating.svg",
        },
    });
}

function dead(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Dead.name"),
            statuses: ["dead"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Dead.description",
            ),
            img: "icons/svg/skull.svg",
        },
    });
}

function deafened(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Deafened.name"),
            statuses: ["deafened"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Deafened.description",
            ),
            img: "modules/dfreds-convenient-effects/images/deafened.svg",
        },
    });
}

function exhaustion1(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion1.name"),
            statuses: ["exhaustion"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Exhaustion1.description",
            ),
            img: "modules/dfreds-convenient-effects/images/exhaustion1.svg",
            flags: { dnd5e: { exhaustionLevel: 1 } },
            changes: [
                exhaustion({
                    value: "1",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "all",
                }),
                initiativeDisadv(),
            ],
        },
    });
}

function exhaustion2(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion2.name"),
            statuses: ["exhaustion"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Exhaustion2.description",
            ),
            img: "modules/dfreds-convenient-effects/images/exhaustion2.svg",
            flags: { dnd5e: { exhaustionLevel: 2 } },
            changes: [
                exhaustion({
                    value: "2",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "all",
                }),
                initiativeDisadv(),
                movement({
                    movementType: "all",
                    value: "*0.5",
                    priority: 25,
                }),
            ],
        },
    });
}

function exhaustion3(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion3.name"),
            statuses: ["exhaustion"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Exhaustion3.description",
            ),
            img: "modules/dfreds-convenient-effects/images/exhaustion3.svg",
            flags: { dnd5e: { exhaustionLevel: 3 } },
            changes: [
                exhaustion({
                    value: "3",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "all",
                }),
                initiativeDisadv(),
                movement({
                    movementType: "all",
                    value: "*0.5",
                    priority: 25,
                }),
                disadvantageAttack({
                    attackType: "all",
                }),
                disadvantageAbilitySave({
                    saveType: "all",
                }),
            ],
        },
    });
}

function exhaustion4(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion4.name"),
            statuses: ["exhaustion"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Exhaustion4.description",
            ),
            img: "modules/dfreds-convenient-effects/images/exhaustion4.svg",
            flags: { dnd5e: { exhaustionLevel: 4 } },
            changes: [
                exhaustion({
                    value: "4",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "all",
                }),
                initiativeDisadv(),
                movement({
                    movementType: "all",
                    value: "*0.5",
                    priority: 25,
                }),
                disadvantageAttack({
                    attackType: "all",
                }),
                disadvantageAbilitySave({
                    saveType: "all",
                }),
            ],
        },
    });
}

function exhaustion5(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Exhaustion5.name"),
            statuses: ["exhaustion"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Exhaustion5.description",
            ),
            img: "modules/dfreds-convenient-effects/images/exhaustion5.svg",
            flags: { dnd5e: { exhaustionLevel: 5 } },
            changes: [
                exhaustion({
                    value: "5",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "all",
                }),
                initiativeDisadv(),
                movement({
                    movementType: "all",
                    value: "0",
                    priority: 25,
                }),
                disadvantageAttack({
                    attackType: "all",
                }),
                disadvantageAbilitySave({
                    saveType: "all",
                }),
            ],
        },
    });
}

function frightened(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Frightened.name"),
            statuses: ["frightened"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Frightened.description",
            ),
            img: "modules/dfreds-convenient-effects/images/frightened.svg",
            changes: [
                disadvantageAttack({
                    attackType: "all",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "all",
                }),
            ],
        },
    });
}

function grappled(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Grappled.name"),
            statuses: ["grappled"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Grappled.description",
            ),
            img: "modules/dfreds-convenient-effects/images/grappled.svg",
            changes: [
                movement({
                    movementType: "all",
                    value: "0",
                    priority: 25,
                }),
            ],
        },
    });
}

function incapacitated(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.Incapacitated.name",
            ),
            statuses: ["incapacitated"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Incapacitated.description",
            ),
            img: "modules/dfreds-convenient-effects/images/incapacitated.svg",
        },
    });
}

function invisible(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Invisible.name"),
            statuses: ["invisible"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Invisible.description",
            ),
            img: "modules/dfreds-convenient-effects/images/invisible.svg",
            changes: [
                advantageAttack({
                    attackType: "all",
                }),
                grantDisadvantageAttack({
                    attackType: "all",
                }),
            ],
        },
    });
}

function paralyzed(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [incapacitated()]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Paralyzed.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Paralyzed.description",
            ),
            img: "modules/dfreds-convenient-effects/images/paralyzed.svg",
            statuses: ["paralyzed"],
            changes: [
                failAbilitySave({
                    saveType: "str",
                }),
                failAbilitySave({
                    saveType: "dex",
                }),
                grantAdvantageAttack({
                    attackType: "all",
                }),
                grantCriticalRange({
                    range: "5",
                }),
                movement({
                    movementType: "all",
                    value: "0",
                    priority: 25,
                }),
            ],
        },
        subEffectIds,
    });
}

function petrified(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [incapacitated()]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Petrified.name"),
            statuses: ["petrified"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Petrified.description",
            ),
            img: "modules/dfreds-convenient-effects/images/petrified.svg",
            changes: [
                grantAdvantageAttack({
                    attackType: "all",
                }),
                failAbilitySave({
                    saveType: "str",
                }),
                failAbilitySave({
                    saveType: "dex",
                }),
                addDamageImmunity({
                    damageType: "poison",
                }),
                addAllDamageResistance(),
                movement({
                    movementType: "all",
                    value: "0",
                    priority: 25,
                }),
            ],
        },
        subEffectIds,
    });
}

function poisoned(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Poisoned.name"),
            statuses: ["poisoned"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Poisoned.description",
            ),
            img: "modules/dfreds-convenient-effects/images/poisoned.svg",
            changes: [
                disadvantageAttack({
                    attackType: "all",
                }),
                disadvantageAbilityCheck({
                    abilityCheckType: "all",
                }),
            ],
        },
    });
}

function prone(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Prone.name"),
            statuses: ["prone"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Prone.description",
            ),
            img: "modules/dfreds-convenient-effects/images/prone.svg",
            changes: [
                grantAdvantageAttack({
                    attackType: "mwak",
                }),
                grantAdvantageAttack({
                    attackType: "msak",
                }),
                grantDisadvantageAttack({
                    attackType: "rwak",
                }),
                grantDisadvantageAttack({
                    attackType: "rsak",
                }),
                disadvantageAttack({
                    attackType: "all",
                }),
                movement({
                    movementType: "all",
                    value: "*0.5",
                    priority: 25,
                }),
            ],
        },
    });
}

function restrained(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Restrained.name"),
            statuses: ["restrained"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Restrained.description",
            ),
            img: "modules/dfreds-convenient-effects/images/restrained.svg",
            changes: [
                disadvantageAbilitySave({
                    saveType: "dex",
                }),
                disadvantageAttack({
                    attackType: "all",
                }),
                advantageAttack({
                    attackType: "all",
                }),
                movement({
                    movementType: "all",
                    value: "0",
                    priority: 25,
                }),
            ],
        },
    });
}

function stunned(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [incapacitated()]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Stunned.name"),
            statuses: ["stunned"],
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Stunned.description",
            ),
            img: "modules/dfreds-convenient-effects/images/stunned.svg",
            changes: [
                failAbilitySave({
                    saveType: "str",
                }),
                failAbilitySave({
                    saveType: "dex",
                }),
                grantAdvantageAttack({
                    attackType: "all",
                }),
            ],
        },
        subEffectIds,
    });
}

function unconscious(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [incapacitated()]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            statuses: ["unconscious"],
            name: game.i18n.localize("ConvenientEffects.Dnd.Unconscious.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Unconscious.description",
            ),
            img: "icons/svg/unconscious.svg",
            changes: [
                failAbilitySave({
                    saveType: "str",
                }),
                failAbilitySave({
                    saveType: "dex",
                }),
                grantAdvantageAttack({
                    attackType: "all",
                }),
                grantCriticalRange({
                    range: "5",
                }),
                movement({
                    movementType: "all",
                    value: "0",
                    priority: 25,
                }),
            ],
        },
        subEffectIds,
    });
}

function wounded(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Wounded.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Wounded.description",
            ),
            img: "modules/dfreds-convenient-effects/images/wounded.svg",
        },
    });
}

export {
    conditions,
    blinded,
    charmed,
    concentrating,
    dead,
    deafened,
    exhaustion1,
    exhaustion2,
    exhaustion3,
    exhaustion4,
    exhaustion5,
    frightened,
    grappled,
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
};
