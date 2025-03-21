import { createConvenientEffect } from "src/ts/utils/creates.ts";
import { ItemEffects } from "../../effect-definition.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Flags } from "src/ts/utils/flags.ts";
import { notEmpty } from "src/ts/utils/types.ts";
import { COLORS, SECONDS } from "src/ts/constants.ts";
import { tokenMagic } from "../changes/macros.ts";
import {
    advantageAbilityCheck,
    advantageAttack,
    advantageAbilitySave,
    grantAdvantageAttack,
    grantDisadvantageAttack,
    optionalAttack,
    optionalLabel,
    optionalSave,
    optionalSkill,
} from "../changes/midi-qol.ts";
import { atlLight } from "../changes/atl.ts";
import { attackBonus, damageBonus } from "../changes/bonuses.ts";
import { addDamageResistance } from "../changes/traits.ts";
import { invisible } from "./conditions.ts";

function classFeatures(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.Folders.ClassFeatures",
            ),
        },
        effects: [
            bardicInspiration(),
            bardicInspirationD6(),
            bardicInspirationD8(),
            bardicInspirationD10(),
            bardicInspirationD12(),
            channelDivinitySacredWeapon(),
            channelDivinityTurnTheUnholy(),
            channelDivinityTurnUndead(),
            kiEmptyBody(),
            kiPatientDefense(),
            rage(),
            recklessAttack(),
            recklessAttackAdvantage(),
        ],
    };
}

function bardicInspiration(): PreCreate<ActiveEffectSource> {
    const nestedEffectIds = [
        bardicInspirationD6(),
        bardicInspirationD8(),
        bardicInspirationD10(),
        bardicInspirationD12(),
    ]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BardicInspiration.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BardicInspiration.description",
            ),
            img: "icons/skills/melee/unarmed-punch-fist.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
        },
        nestedEffectIds,
    });
}

function bardicInspirationD6(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BardicInspirationD6.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BardicInspirationD6.description",
            ),
            img: "icons/skills/melee/unarmed-punch-fist.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                optionalLabel({
                    key: "bardic-inspiration",
                    label: "Bardic Inspiration",
                }),
                optionalAttack({
                    key: "bardic-inspiration",
                    attackType: "all",
                    value: "+1d6",
                }),
                optionalSave({
                    key: "bardic-inspiration",
                    saveType: "all",
                    value: "+1d6",
                }),
                optionalSkill({
                    key: "bardic-inspiration",
                    skillType: "all",
                    value: "+1d6",
                }),
            ],
        },
    });
}

function bardicInspirationD8(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BardicInspirationD8.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BardicInspirationD8.description",
            ),
            img: "icons/skills/melee/unarmed-punch-fist.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                optionalLabel({
                    key: "bardic-inspiration",
                    label: "Bardic Inspiration",
                }),
                optionalAttack({
                    key: "bardic-inspiration",
                    attackType: "all",
                    value: "+1d8",
                }),
                optionalSave({
                    key: "bardic-inspiration",
                    saveType: "all",
                    value: "+1d8",
                }),
                optionalSkill({
                    key: "bardic-inspiration",
                    skillType: "all",
                    value: "+1d8",
                }),
            ],
        },
    });
}

function bardicInspirationD10(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BardicInspirationD10.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BardicInspirationD10.description",
            ),
            img: "icons/skills/melee/unarmed-punch-fist.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                optionalLabel({
                    key: "bardic-inspiration",
                    label: "Bardic Inspiration",
                }),
                optionalAttack({
                    key: "bardic-inspiration",
                    attackType: "all",
                    value: "+1d10",
                }),
                optionalSave({
                    key: "bardic-inspiration",
                    saveType: "all",
                    value: "+1d10",
                }),
                optionalSkill({
                    key: "bardic-inspiration",
                    skillType: "all",
                    value: "+1d10",
                }),
            ],
        },
    });
}

function bardicInspirationD12(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.BardicInspirationD12.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.BardicInspirationD12.description",
            ),
            img: "icons/skills/melee/unarmed-punch-fist.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                optionalLabel({
                    key: "bardic-inspiration",
                    label: "Bardic Inspiration",
                }),
                optionalAttack({
                    key: "bardic-inspiration",
                    attackType: "all",
                    value: "+1d12",
                }),
                optionalSave({
                    key: "bardic-inspiration",
                    saveType: "all",
                    value: "+1d12",
                }),
                optionalSkill({
                    key: "bardic-inspiration",
                    skillType: "all",
                    value: "+1d12",
                }),
            ],
        },
    });
}

function channelDivinitySacredWeapon(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ChannelDivinitySacredWeapon.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ChannelDivinitySacredWeapon.description",
            ),
            img: "icons/weapons/swords/sword-gold-holy.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                attackBonus({
                    attackType: "mwak",
                    value: "+max(1, @abilities.cha.mod)",
                }),
                attackBonus({
                    attackType: "rwak",
                    value: "+max(1, @abilities.cha.mod)",
                }),
                atlLight({
                    lightType: "dim",
                    value: "40",
                }),
                atlLight({
                    lightType: "bright",
                    value: "20",
                }),
                atlLight({
                    lightType: "color",
                    value: COLORS.WHITE,
                }),
                atlLight({
                    lightType: "alpha",
                    value: "0.25",
                }),
                atlLight({
                    lightType: "animation",
                    value: '{"type": "sunburst", "speed": 2,"intensity": 4}',
                }),
            ],
        },
    });
}

function channelDivinityTurnTheUnholy(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ChannelDivinityTurnTheUnholy.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ChannelDivinityTurnTheUnholy.description",
            ),
            img: "icons/magic/fire/explosion-embers-evade-silhouette.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            flags: { dae: { specialDuration: ["isDamaged"] } },
        },
    });
}

function channelDivinityTurnUndead(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.ChannelDivinityTurnUndead.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.ChannelDivinityTurnUndead.description",
            ),
            img: "icons/magic/fire/flame-burning-creature-skeleton.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            flags: { dae: { specialDuration: ["isDamaged"] } },
        },
    });
}

function kiEmptyBody(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.KiEmptyBody.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.KiEmptyBody.description",
            ),
            img: "icons/magic/perception/silhouette-stealth-shadow.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                ...(invisible().changes ?? []),
                addDamageResistance({ damageType: "bludgeoning" }),
                addDamageResistance({ damageType: "piercing" }),
                addDamageResistance({ damageType: "slashing" }),
                addDamageResistance({ damageType: "acid" }),
                addDamageResistance({ damageType: "cold" }),
                addDamageResistance({ damageType: "fire" }),
                addDamageResistance({ damageType: "lightning" }),
                addDamageResistance({ damageType: "necrotic" }),
                addDamageResistance({ damageType: "poison" }),
                addDamageResistance({ damageType: "psychic" }),
                addDamageResistance({ damageType: "radiant" }),
                addDamageResistance({ damageType: "slashing" }),
                addDamageResistance({ damageType: "thunder" }),
            ],
        },
    });
}

function kiPatientDefense(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.KiPatientDefense.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.KiPatientDefense.description",
            ),
            img: "icons/magic/defensive/shield-barrier-glowing-blue.webp",
            flags: { dae: { specialDuration: ["turnStart"] } },
            changes: [
                grantDisadvantageAttack({ attackType: "all" }),
                advantageAbilitySave({ saveType: "dex" }),
            ],
        },
    });
}

function rage(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize("ConvenientEffects.Dnd.Rage.name"),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.Rage.description",
            ),
            img: "icons/creatures/abilities/mouth-teeth-human.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                advantageAbilityCheck({ abilityCheckType: "str" }),
                advantageAbilitySave({ saveType: "str" }),
                addDamageResistance({ damageType: "slashing" }),
                addDamageResistance({ damageType: "piercing" }),
                addDamageResistance({ damageType: "bludgeoning" }),
                damageBonus({
                    damageType: "mwak",
                    value: "+ @scale.barbarian.rage-damage",
                }),
                tokenMagic({ value: "outline" }),
            ],
        },
        isDynamic: true,
    });
}

function recklessAttack(): PreCreate<ActiveEffectSource> {
    const subEffectIds = [recklessAttackAdvantage()]
        .map((effect) => Flags.getCeEffectId(effect))
        .filter(notEmpty);
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RecklessAttack.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RecklessAttack.description",
            ),
            img: "icons/skills/melee/blade-tips-triple-bent-white.webp",
            flags: { dae: { specialDuration: ["turnStart"] } },
            changes: [grantAdvantageAttack({ attackType: "all" })],
        },
        subEffectIds,
    });
}

function recklessAttackAdvantage(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                "ConvenientEffects.Dnd.RecklessAttackAdvantageOnAttacks.name",
            ),
            description: game.i18n.localize(
                "ConvenientEffects.Dnd.RecklessAttackAdvantageOnAttacks.description",
            ),
            img: "icons/skills/melee/blade-tips-triple-bent-white.webp",
            duration: { turns: 1 },
            changes: [advantageAttack({ attackType: "mwak" })],
        },
        isViewable: false,
    });
}

export { classFeatures };
