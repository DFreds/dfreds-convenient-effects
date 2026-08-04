import { ActiveEffectSource, BaseItem } from "@client/documents/_module.mjs";
import { DynamicEffectsHandler } from "../dynamic-effects-handler.ts";
import { getApi } from "../../utils/gets.ts";
import { SECONDS, SIZES_ORDERED } from "../../constants.ts";
import { addDamageResistance, addSize } from "./changes/traits.ts";
import { multiplyTokenScale } from "./changes/token.ts";
import { Flags } from "../../utils/flags.ts";
import { findIncrementParentOf } from "../../utils/finds.ts";

class DynamicEffectsHandlerDnd5e extends DynamicEffectsHandler {
    override systemId: string = "dnd5e";

    override async handleDynamicEffects(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>): Promise<void> {
        const ceEffectId = Flags.getCeEffectId(effect);
        if (!ceEffectId) return;

        switch (ceEffectId) {
            case this.#ceEffectIdForName("ConvenientEffects.Dnd.Aid.name"):
                await this.#addAidEffects(effect, actor);
                break;
            case this.#ceEffectIdForName("ConvenientEffects.Dnd.DivineWord.name"):
                await this.#addDivineWordEffects(effect, actor);
                break;
            case this.#ceEffectIdForName("ConvenientEffects.Dnd.Enlarge.name"):
                this.#addEnlargeEffects(effect, actor);
                break;
            case this.#ceEffectIdForName("ConvenientEffects.Dnd.Rage.name"):
                this.#addRageEffects(effect, actor);
                break;
            case this.#ceEffectIdForName("ConvenientEffects.Dnd.Reduce.name"):
                this.#addReduceEffects(effect, actor);
                break;
        }
    }

    override async handleActorUpdates(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
        { direction = 1 }: { direction?: 1 | -1 },
    ): Promise<void> {
        const ceEffectId = Flags.getCeEffectId(effect);
        if (!ceEffectId) return;

        switch (ceEffectId) {
            case this.#ceEffectIdForName("ConvenientEffects.Dnd.Exhaustion.name"):
                await this.#handleExhaustionUpdate(effect, actor, { direction });
                break;
        }
    }

    override async handleEffectDeletion(effect: ActiveEffect<any>, actor: Actor<any>): Promise<void> {
        const ceEffectId = Flags.getCeEffectId(effect);
        if (!ceEffectId) return;

        switch (ceEffectId) {
            case this.#ceEffectIdForName("ConvenientEffects.Dnd.Aid.name"):
                await this.#clampHpToMax(actor);
                break;
        }
    }

    #ceEffectIdForName(nameKey: string): string | undefined {
        const definedEffect = getApi().findEffect({ effectName: game.i18n.localize(nameKey) });
        return definedEffect ? Flags.getCeEffectId(definedEffect) : undefined;
    }

    async #addAidEffects(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>): Promise<void> {
        const tempMaxIncrease = this.#getTempMaxHpIncrease(effect);
        if (!tempMaxIncrease) return;

        const currentHp = foundry.utils.getProperty(actor, "system.attributes.hp.value") as number | undefined;
        if (typeof currentHp !== "number") return;

        await actor.update({
            "system.attributes.hp.value": currentHp + tempMaxIncrease,
        });
    }

    #getTempMaxHpIncrease(effect: PreCreate<ActiveEffectSource>): number {
        return (effect.system?.changes ?? [])
            .filter((change) => change.key === "system.attributes.hp.tempmax")
            .reduce((total, change) => {
                const value = Number(change.value);
                return Number.isFinite(value) ? total + value : total;
            }, 0);
    }

    async #clampHpToMax(actor: Actor<any>): Promise<void> {
        const storedHp = foundry.utils.getProperty(actor._source, "system.attributes.hp.value") as number | undefined;
        const preparedHp = foundry.utils.getProperty(actor, "system.attributes.hp.value") as number | undefined;

        if (typeof storedHp !== "number" || typeof preparedHp !== "number") return;
        if (storedHp <= preparedHp) return;

        await actor.update({
            "system.attributes.hp.value": preparedHp,
        });
    }

    async #addDivineWordEffects(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>): Promise<void> {
        // @ts-expect-error Attributes is defined
        const remainingHp = actor.system.attributes.hp.value;
        const origin = effect._id as ActiveEffectOrigin;

        if (remainingHp <= 20) {
            await actor.update({
                "system.attributes.hp.value": 0,
            });
            await getApi().addEffect({
                effectName: game.i18n.localize("ConvenientEffects.Dnd.Dead.name"),
                uuid: actor.uuid,
                overlay: true,
            });
            effect.description = game.i18n.localize("ConvenientEffects.Dnd.DivineWord.dead");
        } else if (remainingHp <= 30) {
            await getApi().addEffect({
                effectName: game.i18n.localize("ConvenientEffects.Dnd.Blinded.name"),
                uuid: actor.uuid,
                origin,
            });
            await getApi().addEffect({
                effectName: game.i18n.localize("ConvenientEffects.Dnd.Deafened.name"),
                uuid: actor.uuid,
                origin,
            });
            await getApi().addEffect({
                effectName: game.i18n.localize("ConvenientEffects.Dnd.Stunned.name"),
                uuid: actor.uuid,
                origin,
            });
            effect.description = game.i18n.localize("ConvenientEffects.Dnd.DivineWord.stunned");
            effect.duration = effect.duration ?? {};
            effect.duration.value = SECONDS.IN_ONE_HOUR;
            effect.duration.units = "seconds";
        } else if (remainingHp <= 40) {
            await getApi().addEffect({
                effectName: game.i18n.localize("ConvenientEffects.Dnd.Blinded.name"),
                uuid: actor.uuid,
                origin,
            });
            await getApi().addEffect({
                effectName: game.i18n.localize("ConvenientEffects.Dnd.Deafened.name"),
                uuid: actor.uuid,
                origin,
            });
            effect.description = game.i18n.localize("ConvenientEffects.Dnd.DivineWord.blinded");
            effect.duration = effect.duration ?? {};
            effect.duration.value = SECONDS.IN_TEN_MINUTES;
            effect.duration.units = "seconds";
        } else if (remainingHp <= 50) {
            await getApi().addEffect({
                effectName: game.i18n.localize("ConvenientEffects.Dnd.Deafened.name"),
                uuid: actor.uuid,
                origin,
            });
            effect.description = game.i18n.localize("ConvenientEffects.Dnd.DivineWord.deafened");
            effect.duration = effect.duration ?? {};
            effect.duration.value = SECONDS.IN_ONE_MINUTE;
            effect.duration.units = "seconds";
        }
    }

    #addEnlargeEffects(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>) {
        const index = this.#currentSizeIndex(actor);

        this.#addSizeChangeEffects(effect, index, Math.min(SIZES_ORDERED.length - 1, index + 1));
    }

    #addReduceEffects(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>) {
        const index = this.#currentSizeIndex(actor);
        this.#addSizeChangeEffects(effect, index, Math.max(0, index - 1));
    }

    #currentSizeIndex(actor: Actor<any>): number {
        const size = (actor.system as any).traits?.size;
        const index = SIZES_ORDERED.indexOf(size);

        return index === -1 ? SIZES_ORDERED.indexOf("med") : index;
    }

    #drawnSizeOf(size: string): number {
        const actorSizeObject = (CONFIG as any).DND5E.actorSizes[size];
        if (!actorSizeObject) return 1;

        return (actorSizeObject.token ?? 1) * (actorSizeObject.dynamicTokenScale ?? 1);
    }

    #addSizeChangeEffects(effect: PreCreate<ActiveEffectSource>, fromIndex: number, toIndex: number) {
        const toSize = SIZES_ORDERED[toIndex];

        const system = (effect.system ??= {});
        system.changes = system.changes ?? [];
        system.changes.push(addSize({ value: toSize }));

        // Scale to relative size we started with
        const scale = this.#drawnSizeOf(toSize) / this.#drawnSizeOf(SIZES_ORDERED[fromIndex]);
        if (scale === 1) return;

        system.changes.push(...multiplyTokenScale({ value: scale }));
    }

    #addRageEffects(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>) {
        const barbarianClass = actor.items.find((item) => item.type === "class" && item.name === "Barbarian");

        if (!barbarianClass) {
            ui.notifications.warn(game.i18n.localize("ConvenientEffects.Dnd.Rage.notABarbarian"));
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
        const isTotemWarrior = (barbarianClass as any).subclass?.identifier === "path-of-the-totem-warrior";
        const hasBearTotemSpirit = actor.items.find(
            (item) =>
                item.type === "feat" && item.name === game.i18n.localize("ConvenientEffects.Dnd.Rage.bearTotemFeat"),
        );

        if (isTotemWarrior && hasBearTotemSpirit) {
            const system = (effect.system ??= {});
            system.changes = system.changes ?? [];

            const additionalDamageTypeResistances = [
                "acid",
                "cold",
                "fire",
                "force",
                "lightning",
                "necrotic",
                "poison",
                "radiant",
                "thunder",
            ] as const;

            system.changes.push(
                ...additionalDamageTypeResistances.map((damageType) => addDamageResistance({ damageType })),
            );
        }
    }

    #determineIfPersistentRage(effect: PreCreate<ActiveEffectSource>, barbarianClass: BaseItem<Actor<null>>) {
        if ((barbarianClass.system as any).levels > 14) {
            effect.duration = effect.duration ?? {};
            effect.duration.value = null;
            effect.duration.units = null;
        }
    }

    async #handleExhaustionUpdate(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
        { direction }: { direction: 1 | -1 },
    ): Promise<void> {
        const ceEffectId = Flags.getCeEffectId(effect);
        if (!ceEffectId) return;

        const exhaustionId = this.#ceEffectIdForName("ConvenientEffects.Dnd.Exhaustion.name");
        if (!exhaustionId) return;

        const overlay = !!foundry.utils.getProperty(effect, "flags.core.overlay");

        if (ceEffectId === exhaustionId) {
            await this.#modifyExhaustion(actor, direction, overlay);
            return;
        }

        const incrementParent = findIncrementParentOf(ceEffectId, { backup: false });
        if (!incrementParent || Flags.getCeEffectId(incrementParent) !== exhaustionId) return;

        const memberIds = Flags.getIncrementEffectIds(incrementParent) ?? [];
        const memberIndex = memberIds.indexOf(ceEffectId);
        if (memberIndex === -1) return;

        await this.#jumpExhaustion(actor, memberIndex + 1, overlay);
    }

    async #modifyExhaustion(actor: Actor<any>, direction: 1 | -1, overlay: boolean): Promise<void> {
        const maxLevel = ((CONFIG as any).DND5E?.conditionTypes?.exhaustion?.levels as number | undefined) ?? 6;
        const currentLevel = (foundry.utils.getProperty(actor, "system.attributes.exhaustion") as number) ?? 0;
        const newLevel = Math.min(Math.max(currentLevel + direction, 0), maxLevel);

        if (newLevel === currentLevel) return;

        await this.#updateExhaustionLevel(actor, newLevel, overlay);
    }

    async #jumpExhaustion(actor: Actor<any>, level: number, overlay: boolean): Promise<void> {
        const maxLevel = ((CONFIG as any).DND5E?.conditionTypes?.exhaustion?.levels as number | undefined) ?? 6;
        const currentLevel = (foundry.utils.getProperty(actor, "system.attributes.exhaustion") as number) ?? 0;
        const targetLevel = Math.min(Math.max(level, 0), maxLevel);
        const newLevel = currentLevel === targetLevel ? 0 : targetLevel;

        if (newLevel === currentLevel) return;

        await this.#updateExhaustionLevel(actor, newLevel, overlay);
    }

    async #updateExhaustionLevel(actor: Actor<any>, newLevel: number, overlay: boolean): Promise<void> {
        if (!overlay || newLevel < 1) {
            await actor.update({ "system.attributes.exhaustion": newLevel });
            return;
        }

        const flagIfExhaustion = (candidate: ActiveEffect<any>): boolean => {
            const isExhaustion = candidate.parent === actor && !!(candidate as any).statuses?.has("exhaustion");
            if (isExhaustion) {
                void candidate.update({ "flags.core.overlay": true });
            }
            return isExhaustion;
        };

        const hookId = Hooks.on("createActiveEffect", (candidate: unknown) => {
            if (flagIfExhaustion(candidate as ActiveEffect<any>)) Hooks.off("createActiveEffect", hookId);
        });

        await actor.update({ "system.attributes.exhaustion": newLevel });

        const existing = (actor.effects as any).find((e: ActiveEffect<any>) => (e as any).statuses?.has("exhaustion"));
        if (existing && flagIfExhaustion(existing)) {
            Hooks.off("createActiveEffect", hookId);
        }

        globalThis.setTimeout(() => Hooks.off("createActiveEffect", hookId), 2000);
    }
}

export { DynamicEffectsHandlerDnd5e };
