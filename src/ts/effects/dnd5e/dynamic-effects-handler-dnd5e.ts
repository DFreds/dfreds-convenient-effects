import { ActiveEffectSource, BaseItem } from "@client/documents/_module.mjs";
import { DynamicEffectsHandler } from "../dynamic-effects-handler.ts";
import { getApi } from "../../utils/gets.ts";
import { SECONDS, SIZES_ORDERED } from "../../constants.ts";

class DynamicEffectsHandlerDnd5e extends DynamicEffectsHandler {
    override systemId: string = "dnd5e";

    override async handleDynamicEffects(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
    ): Promise<void> {
        if (!effect.name) return;

        switch (effect.name.toLowerCase()) {
            case game.i18n
                .localize("ConvenientEffects.Dnd.DivineWord.name")
                .toLowerCase():
                await this.#addDivineWordEffects(effect, actor);
                break;
            case game.i18n
                .localize("ConvenientEffects.Dnd.Enlarge.name")
                .toLowerCase():
                this.#addEnlargeEffects(effect, actor);
                break;
            case game.i18n
                .localize("ConvenientEffects.Dnd.Rage.name")
                .toLowerCase():
                this.#addRageEffects(effect, actor);
                break;
            case game.i18n
                .localize("ConvenientEffects.Dnd.Reduce.name")
                .toLowerCase():
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
            await getApi().addEffect({
                effectName: game.i18n.localize(
                    "ConvenientEffects.Dnd.Dead.name",
                ),
                uuid: actor.uuid,
                overlay: true,
            });
            effect.description = game.i18n.localize(
                "ConvenientEffects.Dnd.DivineWord.dead",
            );
        } else if (remainingHp <= 30) {
            await getApi().addEffect({
                effectName: game.i18n.localize(
                    "ConvenientEffects.Dnd.Blinded.name",
                ),
                uuid: actor.uuid,
                origin,
            });
            await getApi().addEffect({
                effectName: game.i18n.localize(
                    "ConvenientEffects.Dnd.Deafened.name",
                ),
                uuid: actor.uuid,
                origin,
            });
            await getApi().addEffect({
                effectName: game.i18n.localize(
                    "ConvenientEffects.Dnd.Stunned.name",
                ),
                uuid: actor.uuid,
                origin,
            });
            effect.description = game.i18n.localize(
                "ConvenientEffects.Dnd.DivineWord.stunned",
            );
            effect.duration = effect.duration ?? {};
            effect.duration.value = SECONDS.IN_ONE_HOUR;
            effect.duration.units = "seconds";
        } else if (remainingHp <= 40) {
            await getApi().addEffect({
                effectName: game.i18n.localize(
                    "ConvenientEffects.Dnd.Blinded.name",
                ),
                uuid: actor.uuid,
                origin,
            });
            await getApi().addEffect({
                effectName: game.i18n.localize(
                    "ConvenientEffects.Dnd.Deafened.name",
                ),
                uuid: actor.uuid,
                origin,
            });
            effect.description = game.i18n.localize(
                "ConvenientEffects.Dnd.DivineWord.blinded",
            );
            effect.duration = effect.duration ?? {};
            effect.duration.value = SECONDS.IN_TEN_MINUTES;
            effect.duration.units = "seconds";
        } else if (remainingHp <= 50) {
            await getApi().addEffect({
                effectName: game.i18n.localize(
                    "ConvenientEffects.Dnd.Deafened.name",
                ),
                uuid: actor.uuid,
                origin,
            });
            effect.description = game.i18n.localize(
                "ConvenientEffects.Dnd.DivineWord.deafened",
            );
            effect.duration = effect.duration ?? {};
            effect.duration.value = SECONDS.IN_ONE_MINUTE;
            effect.duration.units = "seconds";
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
        const actorSizeObject = (CONFIG as any).DND5E.actorSizes[size];
        const tokenSize = actorSizeObject.token ?? 1;

        effect.changes = effect.changes ?? [];

        effect.changes.push(
            {
                key: "system.traits.size",
                type: "override",
                value: size,
            },
            {
                key: "ATL.width",
                type: "override",
                value: tokenSize,
            },
            {
                key: "ATL.height",
                type: "override",
                value: tokenSize,
            },
        );
    }

    #addRageEffects(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>) {
        const barbarianClass = actor.items.find(
            (item) => item.type === "class" && item.name === "Barbarian",
        );

        if (!barbarianClass) {
            ui.notifications.warn(
                game.i18n.localize("ConvenientEffects.Dnd.Rage.notABarbarian"),
            );
            return;
        }

        this.#addResistancesIfBearTotem(effect, actor, barbarianClass);
        this.#determineIfPersistentRage(effect, barbarianClass);
    }

    #addResistancesIfBearTotem(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
        barbarianClass: BaseItem<Actor<null>>,
    ) {
        const isTotemWarrior =
            (barbarianClass as any).subclass?.identifier ===
            "path-of-the-totem-warrior";
        const hasBearTotemSpirit = actor.items.find(
            (item) =>
                item.type === "feat" &&
                item.name ===
                    game.i18n.localize(
                        "ConvenientEffects.Dnd.Rage.bearTotemFeat",
                    ),
        );

        if (isTotemWarrior && hasBearTotemSpirit) {
            effect.changes = effect.changes ?? [];
            effect.changes.push(
                ...[
                    {
                        key: "system.traits.dr.value",
                        type: "add",
                        value: "acid",
                    },
                    {
                        key: "system.traits.dr.value",
                        type: "add",
                        value: "cold",
                    },
                    {
                        key: "system.traits.dr.value",
                        type: "add",
                        value: "fire",
                    },
                    {
                        key: "system.traits.dr.value",
                        type: "add",
                        value: "force",
                    },
                    {
                        key: "system.traits.dr.value",
                        type: "add",
                        value: "lightning",
                    },
                    {
                        key: "system.traits.dr.value",
                        type: "add",
                        value: "necrotic",
                    },
                    {
                        key: "system.traits.dr.value",
                        type: "add",
                        value: "poison",
                    },
                    {
                        key: "system.traits.dr.value",
                        type: "add",
                        value: "physical",
                    },
                    {
                        key: "system.traits.dr.value",
                        type: "add",
                        value: "radiant",
                    },
                    {
                        key: "system.traits.dr.value",
                        type: "add",
                        value: "thunder",
                    },
                ],
            );
        }
    }

    #determineIfPersistentRage(
        effect: PreCreate<ActiveEffectSource>,
        barbarianClass: BaseItem<Actor<null>>,
    ) {
        if ((barbarianClass.system as any).levels > 14) {
            effect.duration = effect.duration ?? {};
            effect.duration.value = null;
            effect.duration.units = null;
        }
    }
}

export { DynamicEffectsHandlerDnd5e };
