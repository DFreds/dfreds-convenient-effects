import { ActiveEffectSource } from "@client/documents/_module.mjs";
import { LeveledEffectsHandler } from "../leveled-effects-handler.ts";
import { createCeEffectId } from "../../utils/creates.ts";
import { Flags } from "../../utils/flags.ts";

class LeveledEffectsHandlerDnd5e extends LeveledEffectsHandler {
    override systemId: string = "dnd5e";

    #STATUS_IDS_BY_NAME_KEY: Record<string, string> = {
        "ConvenientEffects.Dnd.Exhaustion.name": "exhaustion",
    };

    override isLeveled(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): boolean {
        return !!this.#statusIdFor(effect);
    }

    override async changeLevel(
        effect: PreCreate<ActiveEffectSource>,
        actor: Actor<any>,
        { levels, overlay }: { levels: number; overlay: boolean },
    ): Promise<void> {
        const statusId = this.#statusIdFor(effect);
        if (!statusId) return;

        const currentLevel = this.#currentLevel(actor, statusId);

        if (levels === 0 || (levels < 0 && currentLevel === 0)) return;

        if (!this.#hasSystemLevels(statusId)) {
            await this.#changeExhaustionAttribute(actor, statusId, currentLevel + levels);
            return;
        }

        const result = await (actor as any).toggleStatusEffect(statusId, { levels });

        if (overlay && currentLevel === 0 && result instanceof ActiveEffect) {
            await result.update({ "flags.core.overlay": true });
        }
    }

    override async removeLevels(effect: PreCreate<ActiveEffectSource>, actor: Actor<any>): Promise<void> {
        const statusId = this.#statusIdFor(effect);
        if (!statusId) return;

        await this.changeLevel(effect, actor, { levels: -this.#currentLevel(actor, statusId), overlay: false });
    }

    override isApplied(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>, actor: Actor<any>): boolean {
        const statusId = this.#statusIdFor(effect);
        return !!statusId && this.#currentLevel(actor, statusId) > 0;
    }

    #statusIdFor(effect: ActiveEffect<any> | PreCreate<ActiveEffectSource>): string | undefined {
        const ceEffectId = Flags.getCeEffectId(effect);
        if (!ceEffectId) return undefined;

        const nameKey = Object.keys(this.#STATUS_IDS_BY_NAME_KEY).find(
            (key) => createCeEffectId(game.i18n.localize(key)) === ceEffectId,
        );
        return nameKey ? this.#STATUS_IDS_BY_NAME_KEY[nameKey] : undefined;
    }

    #hasSystemLevels(statusId: string): boolean {
        return Number.isFinite((CONFIG as any).DND5E?.conditionTypes?.[statusId]?.levels);
    }

    #currentLevel(actor: Actor<any>, statusId: string): number {
        const system = actor.system as any;
        if (this.#hasSystemLevels(statusId)) return system.conditions?.[statusId] ?? 0;
        return statusId === "exhaustion" ? (system.attributes?.exhaustion ?? 0) : 0;
    }

    async #changeExhaustionAttribute(actor: Actor<any>, statusId: string, level: number): Promise<void> {
        if (statusId !== "exhaustion") return;

        const maxLevel = ((CONFIG as any).DND5E?.conditionTypes?.exhaustion?.levels as number | undefined) ?? 6;
        await actor.update({ "system.attributes.exhaustion": Math.clamp(level, 0, maxLevel) });
    }
}

export { LeveledEffectsHandlerDnd5e };
