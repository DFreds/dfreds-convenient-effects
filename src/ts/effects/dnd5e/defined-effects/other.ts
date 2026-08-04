import { ItemEffects } from "../../effect-definition.ts";
import { abilitySaveMode } from "../changes/abilities.ts";
import { tokenMagic } from "../changes/macros.ts";
import {
    advantage,
    advantageAttack,
    disadvantageAttack,
    grantAdvantageAttack,
    grantDisadvantageAttack,
    grantFailAttack,
} from "../changes/midi-qol.ts";
import { attackBonus, damageBonus } from "../changes/bonuses.ts";
import { movementHover } from "../changes/attributes.ts";
import { tokenMovementAction } from "../changes/token.ts";
import { ActiveEffectSource } from "@client/documents/_module.mjs";
import { createConvenientEffect } from "../../../utils/creates.ts";

function other(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Folders.Other"),
        },
        effects: [
            bonusAction(),
            burrowing(),
            coverHalf(),
            coverThreeQuarters(),
            coverTotal(),
            encumbered(),
            dodge(),
            exceedingCarryingCapacity(),
            flanked(),
            flanking(),
            flying(),
            greatWeaponMaster(),
            heavilyEncumbered(),
            hovering(),
            inspiration(),
            rangedDisadvantage(),
            reaction(),
            ready(),
            sharpshooter(),
        ],
    };
}

function bonusAction(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.BonusAction.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.BonusAction.description"),
            img: "modules/dfreds-convenient-effects/images/bonus-action.svg",
            flags: {
                dae: {
                    specialDuration: ["turnStart", "shortRest", "longRest"],
                },
            },
        },
    });
}

function coverHalf(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.CoverHalf.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.CoverHalf.description"),
            img: "modules/dfreds-convenient-effects/images/broken-wall.svg",
            tint: "#dae34f",
            statuses: ["coverHalf"],
        },
    });
}

function coverThreeQuarters(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.CoverThreeQuarters.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.CoverThreeQuarters.description"),
            img: "modules/dfreds-convenient-effects/images/brick-wall.svg",
            statuses: ["coverThreeQuarters"],
        },
    });
}

function coverTotal(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.CoverTotal.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.CoverTotal.description"),
            img: "modules/dfreds-convenient-effects/images/castle.svg",
            statuses: ["coverTotal"],
            system: {
                changes: [grantFailAttack({ attackType: "all" })],
            },
        },
    });
}

function encumbered(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Encumbered.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Encumbered.description"),
            img: "icons/svg/down.svg",
            // The speed reduction comes from dnd5e's handling of the status
            statuses: ["encumbered"],
        },
    });
}

function exceedingCarryingCapacity(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.ExceedingCarryingCapacity.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.ExceedingCarryingCapacity.description"),
            img: "icons/svg/downgrade.svg",
            statuses: ["exceedingCarryingCapacity"],
        },
    });
}

function burrowing(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Burrowing.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Burrowing.description"),
            img: "systems/dnd5e/icons/svg/statuses/burrowing.svg",
            statuses: ["burrowing"],
            system: {
                changes: [tokenMovementAction({ value: "burrow" })],
            },
        },
    });
}

function flying(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Flying.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Flying.description"),
            img: "systems/dnd5e/icons/svg/statuses/flying.svg",
            statuses: ["flying"],
            system: {
                changes: [tokenMovementAction({ value: "fly" })],
            },
        },
    });
}

function hovering(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Hovering.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Hovering.description"),
            img: "systems/dnd5e/icons/svg/statuses/hovering.svg",
            statuses: ["hovering"],
            system: {
                changes: [movementHover({ value: true })],
            },
        },
    });
}

function dodge(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Dodge.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Dodge.description"),
            img: "modules/dfreds-convenient-effects/images/dodging.svg",
            statuses: ["dodging"],
            flags: { dae: { specialDuration: ["turnStart"] } },
            system: {
                changes: [
                    grantDisadvantageAttack({
                        attackType: "all",
                    }),
                    abilitySaveMode({ ability: "dex", value: "1" }),
                    tokenMagic({
                        value: "Evade Stance",
                    }),
                ],
            },
        },
    });
}

function flanked(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Flanked.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Flanked.description"),
            img: "modules/dfreds-convenient-effects/images/encirclement.svg",
            system: {
                changes: [
                    grantAdvantageAttack({
                        attackType: "mwak",
                    }),
                    grantAdvantageAttack({
                        attackType: "msak",
                    }),
                ],
            },
        },
    });
}

function flanking(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Flanking.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Flanking.description"),
            img: "icons/svg/sword.svg",
            system: {
                changes: [
                    advantageAttack({
                        attackType: "mwak",
                    }),
                    advantageAttack({
                        attackType: "msak",
                    }),
                ],
            },
        },
    });
}

function greatWeaponMaster(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.GreatWeaponMaster.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.GreatWeaponMaster.description"),
            img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
            system: {
                changes: [
                    attackBonus({
                        actionType: "mwak",
                        value: "-5",
                    }),
                    damageBonus({
                        actionType: "mwak",
                        value: "+10",
                    }),
                ],
            },
        },
    });
}

function heavilyEncumbered(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.HeavilyEncumbered.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.HeavilyEncumbered.description"),
            img: "icons/svg/downgrade.svg",
            // The speed reduction comes from dnd5e's handling of the status
            statuses: ["heavilyEncumbered"],
            system: {
                changes: [
                    disadvantageAttack({
                        attackType: "all",
                    }),
                    abilitySaveMode({ ability: "str", value: "-1" }),
                    abilitySaveMode({ ability: "dex", value: "-1" }),
                    abilitySaveMode({ ability: "con", value: "-1" }),
                ],
            },
        },
    });
}

function inspiration(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Inspiration.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Inspiration.description"),
            img: "icons/magic/control/buff-luck-fortune-green.webp",
            flags: {
                dae: {
                    specialDuration: ["1Action", "isSave", "isCheck", "isSkill"],
                },
            },
            system: {
                changes: [advantage()],
            },
        },
    });
}

function rangedDisadvantage(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.RangedDisadvantage.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.RangedDisadvantage.description"),
            img: "modules/dfreds-convenient-effects/images/broken-arrow.svg",
            system: {
                changes: [
                    disadvantageAttack({
                        attackType: "rwak",
                    }),
                    disadvantageAttack({
                        attackType: "rsak",
                    }),
                ],
            },
        },
    });
}

function reaction(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Reaction.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Reaction.description"),
            img: "modules/dfreds-convenient-effects/images/reaction.svg",
            flags: {
                dae: {
                    specialDuration: ["turnStart", "shortRest", "longRest"],
                },
            },
        },
    });
}

function ready(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Ready.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Ready.description"),
            img: "modules/dfreds-convenient-effects/images/ready.svg",
            flags: { dae: { specialDuration: ["turnStart"] } },
        },
    });
}

function sharpshooter(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Sharpshooter.name"),
            description: game.i18n.localize("ConvenientEffects.Dnd.Sharpshooter.description"),
            img: "icons/weapons/bows/shortbow-recurve-yellow.webp",
            system: {
                changes: [
                    attackBonus({
                        actionType: "rwak",
                        value: "-5",
                    }),
                    damageBonus({
                        actionType: "rwak",
                        value: "+10",
                    }),
                ],
            },
        },
    });
}

export { other };
