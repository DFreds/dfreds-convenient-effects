import { createConvenientEffect } from "src/ts/utils/creates.ts";
import { ItemEffects } from "../../effect-definition.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";
import { Flags } from "src/ts/utils/flags.ts";
import { notEmpty } from "src/ts/utils/types.ts";
import { COLORS, SECONDS } from "src/ts/constants.ts";

function classFeatures(): ItemEffects {
    return {
        itemData: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Folders.ClassFeatures,
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
                EN_JSON.ConvenientEffects.Dnd.BardicInspiration.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BardicInspiration.description,
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
                EN_JSON.ConvenientEffects.Dnd.BardicInspirationD6.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BardicInspirationD6.description,
            ),
            img: "icons/skills/melee/unarmed-punch-fist.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.label`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "Bardic Inspiration",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d6",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.save.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d6",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.skill.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d6",
                },
            ],
        },
    });
}

function bardicInspirationD8(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BardicInspirationD8.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BardicInspirationD8.description,
            ),
            img: "icons/skills/melee/unarmed-punch-fist.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.label`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "Bardic Inspiration",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d8",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.save.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d8",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.skill.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d8",
                },
            ],
        },
    });
}

function bardicInspirationD10(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BardicInspirationD10.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BardicInspirationD10.description,
            ),
            img: "icons/skills/melee/unarmed-punch-fist.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.label`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "Bardic Inspiration",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d10",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.save.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d10",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.skill.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d10",
                },
            ],
        },
    });
}

function bardicInspirationD12(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BardicInspirationD12.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.BardicInspirationD12.description,
            ),
            img: "icons/skills/melee/unarmed-punch-fist.webp",
            duration: { seconds: SECONDS.IN_TEN_MINUTES },
            changes: [
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.label`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "Bardic Inspiration",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d12",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.save.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d12",
                },
                {
                    key: `flags.midi-qol.optional.bardic-inspiration.skill.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "+1d12",
                },
            ],
        },
    });
}

function channelDivinitySacredWeapon(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ChannelDivinitySacredWeapon.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ChannelDivinitySacredWeapon
                    .description,
            ),
            img: "icons/weapons/swords/sword-gold-holy.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: "system.bonuses.mwak.attack",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+max(1, @abilities.cha.mod)",
                },
                {
                    key: "system.bonuses.rwak.attack",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+max(1, @abilities.cha.mod)",
                },
                {
                    key: "ATL.light.dim",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "40",
                },
                {
                    key: "ATL.light.bright",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "20",
                },
                {
                    key: "ATL.light.color",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: COLORS.WHITE,
                },
                {
                    key: "ATL.light.alpha",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: "0.25",
                },
                {
                    key: "ATL.light.animation",
                    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                    value: '{"type": "sunburst", "speed": 2,"intensity": 4}',
                },
            ],
        },
    });
}

function channelDivinityTurnTheUnholy(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ChannelDivinityTurnTheUnholy.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ChannelDivinityTurnTheUnholy
                    .description,
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
                EN_JSON.ConvenientEffects.Dnd.ChannelDivinityTurnUndead.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.ChannelDivinityTurnUndead
                    .description,
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
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.KiEmptyBody.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.KiEmptyBody.description,
            ),
            img: "icons/magic/perception/silhouette-stealth-shadow.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: `flags.midi-qol.advantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.grants.disadvantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "physical",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "bludgeoning",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "piercing",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "slashing",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "silver",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "adamant",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "acid",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "cold",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "fire",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "lightning",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "necrotic",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "poison",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "psychic",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "radiant",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "thunder",
                },
            ],
        },
    });
}

function kiPatientDefense(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.KiPatientDefense.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.KiPatientDefense.description,
            ),
            img: "icons/magic/defensive/shield-barrier-glowing-blue.webp",
            flags: { dae: { specialDuration: ["turnStart"] } },
            changes: [
                {
                    key: `flags.midi-qol.grants.disadvantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.advantage.ability.save.dex`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
    });
}

function rage(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(EN_JSON.ConvenientEffects.Dnd.Rage.name),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.Rage.description,
            ),
            img: "icons/creatures/abilities/mouth-teeth-human.webp",
            duration: { seconds: SECONDS.IN_ONE_MINUTE },
            changes: [
                {
                    key: `flags.midi-qol.advantage.ability.check.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: `flags.midi-qol.advantage.ability.save.str`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "slashing",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "piercing",
                },
                {
                    key: "system.traits.dr.value",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "bludgeoning",
                },
                {
                    key: "system.bonuses.mwak.damage",
                    mode: CONST.ACTIVE_EFFECT_MODES.ADD,
                    value: "+ @scale.barbarian.rage-damage",
                },
                {
                    key: "macro.tokenMagic",
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "outline",
                },
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
                EN_JSON.ConvenientEffects.Dnd.RecklessAttack.name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.RecklessAttack.description,
            ),
            img: "icons/skills/melee/blade-tips-triple-bent-white.webp",
            flags: { dae: { specialDuration: ["turnStart"] } },
            changes: [
                {
                    key: `flags.midi-qol.grants.advantage.attack.all`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
        subEffectIds,
    });
}

function recklessAttackAdvantage(): PreCreate<ActiveEffectSource> {
    return createConvenientEffect({
        effect: {
            name: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.RecklessAttackAdvantageOnAttacks
                    .name,
            ),
            description: game.i18n.localize(
                EN_JSON.ConvenientEffects.Dnd.RecklessAttackAdvantageOnAttacks
                    .description,
            ),
            img: "icons/skills/melee/blade-tips-triple-bent-white.webp",
            duration: { turns: 1 },
            changes: [
                {
                    key: `flags.midi-qol.advantage.attack.mwak`,
                    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                    value: "1",
                },
            ],
        },
        isViewable: false,
    });
}

export { classFeatures };
