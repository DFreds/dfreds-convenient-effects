import { SECONDS, SIZES_ORDERED } from "src/ts/constants.ts";
import { DynamicEffectsHandler } from "../dynamic-effects-handler.ts";
import { ActiveEffectSource } from "types/foundry/common/documents/active-effect.js";

class DynamicEffectsHandlerDnd5e extends DynamicEffectsHandler {
    override systemId: string = "dnd5e";

    override async handleDynamicEffects(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
    ): Promise<void> {
        if (!effect.name) return;

        switch (effect.name.toLowerCase()) {
            case "divine word":
                await this.#addDivineWordEffects(effect, actor);
                break;
            case "enlarge":
                this.#addEnlargeEffects(effect, actor);
                break;
            case "rage":
                this.#addRageEffects(effect, actor);
                break;
            case "reduce":
                this.#addReduceEffects(effect, actor);
                break;
        }
    }

    async #addDivineWordEffects(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
    ): Promise<void> {
        // @ts-expect-error Attributes is defined
        const remainingHp = actor.system.attributes.hp.value;
        const origin = effect._id as ActiveEffectOrigin;

        if (remainingHp <= 20) {
            await actor.update({
                "system.attributes.hp.value": 0,
            });
            await game.dfreds.effectInterface.addEffect({
                effectName: "Dead",
                uuid: actor.uuid,
                overlay: true,
            });
            effect.description = "Killed instantly";
        } else if (remainingHp <= 30) {
            await game.dfreds.effectInterface.addEffect({
                effectName: "Blinded",
                uuid: actor.uuid,
                origin,
            });
            await game.dfreds.effectInterface.addEffect({
                effectName: "Deafened",
                uuid: actor.uuid,
                origin,
            });
            await game.dfreds.effectInterface.addEffect({
                effectName: "Stunned",
                uuid: actor.uuid,
                origin,
            });
            effect.description = "Blinded, deafened, and stunned for 1 hour";
            effect.duration = effect.duration ?? {};
            effect.duration.seconds = SECONDS.IN_ONE_HOUR;
        } else if (remainingHp <= 40) {
            await game.dfreds.effectInterface.addEffect({
                effectName: "Blinded",
                uuid: actor.uuid,
                origin,
            });
            await game.dfreds.effectInterface.addEffect({
                effectName: "Deafened",
                uuid: actor.uuid,
                origin,
            });
            effect.description = "Deafened and blinded for 10 minutes";
            effect.duration = effect.duration ?? {};
            effect.duration.seconds = SECONDS.IN_TEN_MINUTES;
        } else if (remainingHp <= 50) {
            await game.dfreds.effectInterface.addEffect({
                effectName: "Deafened",
                uuid: actor.uuid,
                origin,
            });
            effect.description = "Deafened for 1 minute";
            effect.duration = effect.duration ?? {};
            effect.duration.seconds = SECONDS.IN_ONE_MINUTE;
        }
    }

    #addEnlargeEffects(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
    ) {
        const size = (actor.system as any).traits.size;
        const index = SIZES_ORDERED.indexOf(size);

        this.#addSizeChangeEffects(
            effect,
            Math.min(SIZES_ORDERED.length - 1, index + 1),
        );
    }

    #addReduceEffects(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
    ) {
        const size = (actor.system as any).traits.size;
        const index = SIZES_ORDERED.indexOf(size);

        this.#addSizeChangeEffects(effect, Math.max(0, index - 1));
    }

    #addSizeChangeEffects(
        effect: PreCreate<ActiveEffectSource>,
        sizeIndex: number,
    ) {
        const size = SIZES_ORDERED[sizeIndex];
        const tokenSize = (CONFIG as any).DND5E.actorSizes[size];

        effect.changes = effect.changes ?? [];

        effect.changes.push({
            key: "system.traits.size",
            mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
            value: size,
        });

        if (this.settings.integrateWithAte) {
            effect.changes.push(
                ...[
                    {
                        key: "ATL.width",
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: tokenSize,
                    },
                    {
                        key: "ATL.height",
                        mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                        value: tokenSize,
                    },
                ],
            );
        }
    }

    #addRageEffects(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>) {
        const barbarianClass = actor.items.find(
            (item) => item.type === "class" && item.name === "Barbarian",
        );

        if (!barbarianClass) {
            ui.notifications.warn("Selected actor is not a Barbarian");
            return;
        }

        this.#addResistancesIfBearTotem(effect, actor, barbarianClass);
        this.#determineIfPersistentRage(effect, barbarianClass);
    }

    #addResistancesIfBearTotem(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
        barbarianClass: Item<Actor<null>>,
    ) {
        const isTotemWarrior =
            (barbarianClass as any).subclass?.identifier ===
            "path-of-the-totem-warrior";
        const hasBearTotemSpirit = actor.items.find(
            (item) =>
                item.type === "feat" && item.name === "Totem Spirit: Bear",
        );

        if (isTotemWarrior && hasBearTotemSpirit) {
            effect.changes = effect.changes ?? [];
            effect.changes.push(
                ...[
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
                        value: "force",
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
                        value: "physical",
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
            );
        }
    }

    #determineIfPersistentRage(
        effect: PreCreate<ActiveEffectSource>,
        barbarianClass: Item<Actor<null>>,
    ) {
        if ((barbarianClass.system as any).levels > 14) {
            effect.duration = effect.duration ?? {};
            effect.duration.seconds = null;
            effect.duration.rounds = null;
            effect.duration.turns = null;
        }
    }
}

export { DynamicEffectsHandlerDnd5e };
