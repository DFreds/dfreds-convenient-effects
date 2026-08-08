import type { DataField } from "@common/data/fields.mjs";
import { MODULE_ID } from "../constants.ts";
import { error } from "../logger.ts";
import { Listener } from "./index.ts";

const TriggersSetup: Listener = {
    listen(): void {
        Hooks.once("dfreds-triggers.setup" as any, (api: TriggersApi) => {
            api.registerAction(addEffectAction());
            api.registerAction(removeEffectAction());
            api.registerAction(toggleEffectAction());
        });
    },
};

function effectNameField(): DataField {
    return new foundry.data.fields.StringField({
        required: true,
        blank: true,
        initial: "",
        label: "ConvenientEffects.Triggers.EffectNameLabel",
        hint: "ConvenientEffects.Triggers.EffectNameHint",
    });
}

function targetUuidField(): DataField {
    return new foundry.data.fields.DocumentUUIDField({
        required: false,
        nullable: true,
        initial: null,
        label: "ConvenientEffects.Triggers.TargetUuidLabel",
        hint: "ConvenientEffects.Triggers.TargetUuidHint",
    });
}

function overlayField(): DataField {
    return new foundry.data.fields.BooleanField({
        initial: false,
        label: "ConvenientEffects.Triggers.OverlayLabel",
        hint: "ConvenientEffects.Triggers.OverlayHint",
    });
}

function resolveTargetUuid(config: Record<string, unknown>, context: TriggerContext): string | null {
    const configured = config.targetUuid as string | null;
    if (configured) return configured;

    return context.actor?.uuid ?? null;
}

function findApi(): EffectInterface | null {
    const api = (game.modules.get(MODULE_ID) as unknown as ConvenientEffectsModule | undefined)?.api;
    return api ?? null;
}

function resolveRun(
    config: Record<string, unknown>,
    context: TriggerContext,
    actionLabel: string,
): { api: EffectInterface; effectName: string; uuid: string } | null {
    const effectName = (config.effectName as string)?.trim();
    if (!effectName) return null;

    const api = findApi();
    if (!api) {
        error(`Cannot ${actionLabel} "${effectName}" because the effect interface is not ready yet`);
        return null;
    }

    const uuid = resolveTargetUuid(config, context);
    if (!uuid) {
        error(`Cannot ${actionLabel} "${effectName}" because the trigger has no actor to put it on`);
        return null;
    }

    return { api, effectName, uuid };
}

function summarizeEffectName(config: Record<string, unknown>, fallbackKey: string): string {
    return (config.effectName as string) || game.i18n.localize(fallbackKey);
}

function addEffectAction(): TriggerActionDefinition {
    return {
        id: `${MODULE_ID}.addEffect`,
        label: "ConvenientEffects.Triggers.AddEffect.Label",
        description: "ConvenientEffects.Triggers.AddEffect.Description",
        group: "effects",
        icon: "fa-solid fa-wand-magic-sparkles",
        runsOn: "gm",

        schema: () => ({
            effectName: effectNameField(),
            overlay: overlayField(),
            targetUuid: targetUuidField(),
        }),

        summarize: (config) => summarizeEffectName(config, "ConvenientEffects.Triggers.AddEffect.Label"),

        execute: async (config, context) => {
            const run = resolveRun(config, context, "add");
            if (!run) return;

            await run.api.addEffect({
                effectName: run.effectName,
                uuid: run.uuid,
                overlay: config.overlay === true,
            });
        },
    };
}

function removeEffectAction(): TriggerActionDefinition {
    return {
        id: `${MODULE_ID}.removeEffect`,
        label: "ConvenientEffects.Triggers.RemoveEffect.Label",
        description: "ConvenientEffects.Triggers.RemoveEffect.Description",
        group: "effects",
        icon: "fa-solid fa-wand-magic",
        runsOn: "gm",

        schema: () => ({
            effectName: effectNameField(),
            targetUuid: targetUuidField(),
        }),

        summarize: (config) => summarizeEffectName(config, "ConvenientEffects.Triggers.RemoveEffect.Label"),

        execute: async (config, context) => {
            const run = resolveRun(config, context, "remove");
            if (!run) return;

            await run.api.removeEffect({
                effectName: run.effectName,
                uuid: run.uuid,
            });
        },
    };
}

function toggleEffectAction(): TriggerActionDefinition {
    return {
        id: `${MODULE_ID}.toggleEffect`,
        label: "ConvenientEffects.Triggers.ToggleEffect.Label",
        description: "ConvenientEffects.Triggers.ToggleEffect.Description",
        group: "effects",
        icon: "fa-solid fa-arrows-rotate",
        runsOn: "gm",

        schema: () => ({
            effectName: effectNameField(),
            overlay: overlayField(),
            targetUuid: targetUuidField(),
        }),

        summarize: (config) => summarizeEffectName(config, "ConvenientEffects.Triggers.ToggleEffect.Label"),

        execute: async (config, context) => {
            const run = resolveRun(config, context, "toggle");
            if (!run) return;

            await run.api.toggleEffect({
                effectName: run.effectName,
                uuids: [run.uuid],
                overlay: config.overlay === true,
            });
        },
    };
}

export { TriggersSetup };
