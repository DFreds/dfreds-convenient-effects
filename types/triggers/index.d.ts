export {};

import type { DataSchema } from "@common/abstract/_types.mjs";
import type Document from "@common/abstract/document.mjs";

declare global {
    /**
     * The part of the DFreds Triggers registration API this module uses.
     *
     * Only the pieces needed to register an action are declared. The full API is
     * documented in the Triggers developer guide.
     */
    export interface TriggersApi {
        registerAction(definition: TriggerActionDefinition): void;
    }

    export interface TriggersModule extends Module {
        api: TriggersApi;
    }

    /**
     * What a trigger hands to an action when it runs.
     *
     * Every name is always present, but only the ones the trigger's event provides
     * hold a value; the rest are null.
     */
    export interface TriggerContext {
        event: string;
        document?: Document;
        actor?: Actor | null;
        token?: TokenDocument | null;
        item?: Item | null;
        effect?: ActiveEffect | null;
        combat?: Combat | null;
        combatant?: Combatant | null;
        region?: RegionDocument | null;
        scene?: Scene | null;
        user: User;
        changed?: Record<string, unknown>;
        previous?: Record<string, unknown>;
        depth: number;
        statusId?: string;

        /** The trigger that matched. Carries more than this, which no action here reads. */
        trigger: { id: string; name: string };
    }

    export interface TriggerActionDefinition {
        /** Namespaced with this module's id, so it cannot collide with another's */
        id: string;

        /** A localization key, shown in the action picker */
        label: string;

        /** A localization key for one sentence saying what the action does, shown under its title */
        description: string;

        /** Which heading the action sits under in the picker */
        group: "effects" | "documents" | "chat" | "combat" | "audioVisual" | "flow" | "advanced" | "debug";

        /** A Font Awesome class */
        icon: string;

        /** `gm` runs once on the active gamemaster, `client` forwards it to players */
        runsOn: "gm" | "client";

        /** Builds the action's form. Must return fresh field instances on every call. */
        schema: () => DataSchema;

        /** The one line shown on the collapsed action card */
        summarize: (config: Record<string, unknown>) => string;

        execute: (config: Record<string, unknown>, context: TriggerContext) => Promise<void>;

        isAvailable?: () => boolean;
    }
}
