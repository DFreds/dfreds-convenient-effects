import { createConvenientEffect } from "src/ts/utils/creates.ts";
import { ItemEffects } from "../../effect-definition.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { acCover, movement } from "../changes/attributes.ts";
import { abilitySaveBonus } from "../changes/abilities.ts";
import { tokenMagic } from "../changes/macros.ts";
import {
    advantage,
    advantageAttack,
    advantageSave,
    disadvantageAttack,
    disadvantageSave,
    grantAdvantageAttack,
    grantDisadvantageAttack,
    grantFailAttack,
} from "../changes/midi-qol.ts";
import { attackBonus, damageBonus } from "../changes/bonuses.ts";

function other(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Folders.Other"),
        },
        effects: [
            bonusAction(),
            coverHalf(),
            coverThreeQuarters(),
            coverTotal(),
            encumbered(),
            dodge(),
            flanked(),
            flanking(),
            greatWeaponMaster(),
            heavilyEncumbered(),
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
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BonusAction.description",
            ),
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
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.CoverHalf.description",
            ),
            img: "modules/dfreds-convenient-effects/images/broken-wall.svg",
            tint: "#dae34f",
            changes: [
                acCover({
                    value: "+2",
                }),
                abilitySaveBonus({
                    ability: "dex",
                    value: "+2",
                }),
            ],
        },
    });
}

function coverThreeQuarters(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.CoverThreeQuarters.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.CoverThreeQuarters.description",
            ),
            img: "modules/dfreds-convenient-effects/images/brick-wall.svg",
            changes: [
                acCover({
                    value: "+5",
                }),
                abilitySaveBonus({
                    ability: "dex",
                    value: "+5",
                }),
            ],
        },
    });
}

function coverTotal(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.CoverTotal.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.CoverTotal.description",
            ),
            img: "modules/dfreds-convenient-effects/images/castle.svg",
            changes: [grantFailAttack({ attackType: "all" })],
        },
    });
}

function encumbered(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Encumbered.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Encumbered.description",
            ),
            img: "icons/svg/down.svg",
            statuses: ["encumbered"],
            changes: [
                movement({
                    movementType: "all",
                    value: "-10",
                    priority: 25,
                }),
            ],
        },
    });
}

function dodge(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Dodge.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Dodge.description",
            ),
            img: "modules/dfreds-convenient-effects/images/dodging.svg",
            statuses: ["dodging"],
            flags: { dae: { specialDuration: ["turnStart"] } },
            changes: [
                grantDisadvantageAttack({
                    attackType: "all",
                }),
                advantageSave({
                    saveType: "dex",
                }),
                tokenMagic({
                    value: "Evade Stance",
                }),
            ],
        },
    });
}

function flanked(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Flanked.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Flanked.description",
            ),
            img: "modules/dfreds-convenient-effects/images/encirclement.svg",
            changes: [
                grantAdvantageAttack({
                    attackType: "mwak",
                }),
                grantAdvantageAttack({
                    attackType: "msak",
                }),
            ],
        },
    });
}

function flanking(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Flanking.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Flanking.description",
            ),
            img: "icons/svg/sword.svg",
            changes: [
                advantageAttack({
                    attackType: "mwak",
                }),
                advantageAttack({
                    attackType: "msak",
                }),
            ],
        },
    });
}

function greatWeaponMaster(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.GreatWeaponMaster.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.GreatWeaponMaster.description",
            ),
            img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
            changes: [
                attackBonus({
                    attackType: "mwak",
                    value: "-5",
                }),
                damageBonus({
                    damageType: "mwak",
                    value: "+10",
                }),
            ],
        },
    });
}

function heavilyEncumbered(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.HeavilyEncumbered.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.HeavilyEncumbered.description",
            ),
            img: "icons/svg/downgrade.svg",
            statuses: ["heavilyEncumbered"],
            changes: [
                movement({
                    movementType: "all",
                    value: "-20",
                    priority: 25,
                }),
                disadvantageAttack({
                    attackType: "all",
                }),
                disadvantageSave({
                    saveType: "str",
                }),
                disadvantageSave({
                    saveType: "dex",
                }),
                disadvantageSave({
                    saveType: "con",
                }),
            ],
        },
    });
}

function inspiration(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Inspiration.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Inspiration.description",
            ),
            img: "icons/magic/control/buff-luck-fortune-green.webp",
            flags: {
                dae: {
                    specialDuration: [
                        "1Action",
                        "isSave",
                        "isCheck",
                        "isSkill",
                    ],
                },
            },
            changes: [advantage()],
        },
    });
}

function rangedDisadvantage(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RangedDisadvantage.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RangedDisadvantage.description",
            ),
            img: "modules/dfreds-convenient-effects/images/broken-arrow.svg",
            changes: [
                disadvantageAttack({
                    attackType: "rwak",
                }),
                disadvantageAttack({
                    attackType: "rsak",
                }),
            ],
        },
    });
}

function reaction(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Reaction.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Reaction.description",
            ),
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
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Ready.description",
            ),
            img: "modules/dfreds-convenient-effects/images/ready.svg",
            flags: { dae: { specialDuration: ["turnStart"] } },
        },
    });
}

function sharpshooter(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Sharpshooter.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Sharpshooter.description",
            ),
            img: "icons/weapons/bows/shortbow-recurve-yellow.webp",
            changes: [
                attackBonus({
                    attackType: "rwak",
                    value: "-5",
                }),
                damageBonus({
                    damageType: "rwak",
                    value: "+10",
                }),
            ],
        },
    });
}

export { other };
