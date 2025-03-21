import { createConvenientEffect } from "src/ts/utils/creates.ts";
import { ItemEffects } from "../../effect-definition.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { acCover, movement } from "../changes/attributes.ts";
import { abilitySaveBonus } from "../changes/abilities.ts";
import { tokenMagic } from "../changes/macros.ts";
import {
    advantageSave,
    grantAdvantageAttack,
    grantDisadvantageAttack,
} from "../changes/midi-qol.ts";

function other(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Folders.Other,
            ),
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BonusAction.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BonusAction.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.CoverHalf.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.CoverHalf.description,
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
                EN_JSON.ConvenientEffects.Dnd.CoverThreeQuarters.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.CoverThreeQuarters.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.CoverTotal.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.CoverTotal.description,
            ),
            img: "modules/dfreds-convenient-effects/images/castle.svg",
            changes: [
                {
                    key: `flags.midi-qol.grants.attack.fail.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function encumbered(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Encumbered.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Encumbered.description,
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
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Dodge.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Dodge.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Flanked.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Flanked.description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Flanking.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Flanking.description,
            ),
            img: "icons/svg/sword.svg",
            changes: [
                {
                    key: `flags.midi-qol.advantage.attack.mwak`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.advantage.attack.msak`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function greatWeaponMaster(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.GreatWeaponMaster.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.GreatWeaponMaster.description,
            ),
            img: "icons/skills/melee/hand-grip-staff-yellow-brown.webp",
            changes: [
                {
                    key: "system.bonuses.mwak.attack",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "-5",
                },
                {
                    key: "system.bonuses.mwak.damage",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+10",
                },
            ],
        },
    });
}

function heavilyEncumbered(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HeavilyEncumbered.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.HeavilyEncumbered.description,
            ),
            img: "icons/svg/downgrade.svg",
            statuses: ["heavilyEncumbered"],
            changes: [
                {
                    key: "system.attributes.movement.all",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "-20",
                    priority: 25,
                },
                {
                    key: `flags.midi-qol.disadvantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.save.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.save.dex`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.ability.save.con`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function inspiration(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Inspiration.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Inspiration.description,
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
            changes: [
                {
                    key: `flags.midi-qol.advantage.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "1",
                },
            ],
        },
    });
}

function rangedDisadvantage(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.RangedDisadvantage.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.RangedDisadvantage.description,
            ),
            img: "modules/dfreds-convenient-effects/images/broken-arrow.svg",
            changes: [
                {
                    key: `flags.midi-qol.disadvantage.attack.rwak`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.disadvantage.attack.rsak`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function reaction(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Reaction.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Reaction.description,
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
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Ready.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Ready.description,
            ),
            img: "modules/dfreds-convenient-effects/images/ready.svg",
            flags: { dae: { specialDuration: ["turnStart"] } },
        },
    });
}

function sharpshooter(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Sharpshooter.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Sharpshooter.description,
            ),
            img: "icons/weapons/bows/shortbow-recurve-yellow.webp",
            changes: [
                {
                    key: "system.bonuses.rwak.attack",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "-5",
                },
                {
                    key: "system.bonuses.rwak.damage",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+10",
                },
            ],
        },
    });
}

export { other };
