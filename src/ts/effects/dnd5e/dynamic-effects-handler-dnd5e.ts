import { ActiveEffectSource, BaseItem } from "@client/documents/_module.mjs";
import { DynamicEffectsHandler } from "../dynamic-effects-handler.ts";
import { getApi } from "../../utils/gets.ts";
import { SECONDS, SIZES_ORDERED } from "../../constants.ts";
import { addDamageResistance, addSize } from "./changes/traits.ts";
import { tokenTexture } from "./changes/token.ts";
import { Flags } from "../../utils/flags.ts";
import { findIncrementParentOf } from "../../utils/finds.ts";

class DynamicEffectsHandlerDnd5e extends DynamicEffectsHandler {
    override systemId: string = "dnd5e";

    override async handleDynamicEffects(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>): Promise<void> {
        const ceEffectId = Flags.getCeEffectId(effect);
        if (!ceEffectId) return;

        switch (ceEffectId) {
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

    #ceEffectIdForName(nameKey: string): string | undefined {
        const definedEffect = getApi().findEffect({ effectName: game.i18n.localize(nameKey) });
        return definedEffect ? Flags.getCeEffectId(definedEffect) : undefined;
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
        const size = (actor.system as any).traits.size;
        const index = SIZES_ORDERED.indexOf(size);

        this.#addSizeChangeEffects(effect, Math.min(SIZES_ORDERED.length - 1, index + 1));
    }

    #addReduceEffects(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>) {
        const size = (actor.system as any).traits.size;
        const index = SIZES_ORDERED.indexOf(size);

        this.#addSizeChangeEffects(effect, Math.max(0, index - 1));
    }

    #addSizeChangeEffects(effect: PreCreate<ActiveEffectSource>, sizeIndex: number) {
        const size = SIZES_ORDERED[sizeIndex];
        const actorSizeObject = (CONFIG as any).DND5E.actorSizes[size];
        const tokenSize = actorSizeObject.token ?? actorSizeObject.dynamicTokenScale ?? 1;

        effect.changes = effect.changes ?? [];

        effect.changes.push(
            addSize({ value: size }),
            tokenTexture({ attribute: "scaleX", value: tokenSize }),
            tokenTexture({ attribute: "scaleY", value: tokenSize }),
        );
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
            effect.changes = effect.changes ?? [];
            effect.changes.push(
                ...[
                    addDamageResistance({ damageType: "bludgeoning" }),
                    addDamageResistance({ damageType: "piercing" }),
                    addDamageResistance({ damageType: "slashing" }),
                    addDamageResistance({ damageType: "acid" }),
                    addDamageResistance({ damageType: "cold" }),
                    addDamageResistance({ damageType: "fire" }),
                    addDamageResistance({ damageType: "force" }),
                    addDamageResistance({ damageType: "lightning" }),
                    addDamageResistance({ damageType: "necrotic" }),
                    addDamageResistance({ damageType: "poison" }),
                    addDamageResistance({ damageType: "radiant" }),
                    addDamageResistance({ damageType: "thunder" }),
                ],
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

        // Exhaustion is applied by updating the actor, so dnd5e (not CE) creates
        // the status effect. Carry the requested overlay through so it can be
        // applied to that effect once dnd5e syncs it.
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
        // dnd5e keeps its own overlay flag across level changes, so a non-overlay
        // update leaves any existing overlay untouched (letting it persist until
        // exhaustion is fully removed). Only act when overlay is requested.
        if (!overlay || newLevel < 1) {
            await actor.update({ "system.attributes.exhaustion": newLevel });
            return;
        }

        // dnd5e (re)creates its exhaustion effect asynchronously in response to
        // the level change and never marks it as an overlay. Flag it ourselves,
        // whether it already exists (raising the level) or is newly created.
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

        // If the effect already existed, no creation hook fires; flag it directly.
        const existing = (actor.effects as any).find((e: ActiveEffect<any>) => (e as any).statuses?.has("exhaustion"));
        if (existing && flagIfExhaustion(existing)) {
            Hooks.off("createActiveEffect", hookId);
        }

        // Safety cleanup so the hook never lingers if creation never happens.
        globalThis.setTimeout(() => Hooks.off("createActiveEffect", hookId), 2000);
    }
}

export { DynamicEffectsHandlerDnd5e };
