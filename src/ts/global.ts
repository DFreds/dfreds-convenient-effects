import type ActorDirectory from "@client/applications/sidebar/tabs/actor-directory.d.mts";
import type ChatLog from "@client/applications/sidebar/tabs/chat.d.mts";
import type CombatTracker from "@client/applications/sidebar/tabs/combat-tracker.d.mts";
import type CompendiumDirectory from "@client/applications/sidebar/tabs/compendium-directory.d.mts";
import type ItemDirectory from "@client/applications/sidebar/tabs/item-directory.d.mts";
import type Hotbar from "@client/applications/ui/hotbar.d.mts";
import type Canvas from "@client/canvas/board.d.mts";
import type EffectsCanvasGroup from "@client/canvas/groups/effects.d.mts";
import type Config from "@client/config.d.mts";
import type Actors from "@client/documents/collections/actors.d.mts";
import type WallDocument from "@client/documents/wall.d.mts";
import type Game from "@client/game.d.mts";
import type { FoundryUI } from "@client/ui.d.mts";

type ConfiguredConfig = Config<
    AmbientLightDocument<Scene | null>,
    ActiveEffect<Actor | Item | null>,
    Actor,
    ActorDelta<TokenDocument>,
    ChatLog,
    ChatMessage,
    Combat,
    Combatant<Combat | null, TokenDocument>,
    CombatTracker<Combat | null>,
    CompendiumDirectory,
    Hotbar<Macro>,
    Item,
    Macro,
    MeasuredTemplateDocument,
    RegionDocument,
    RegionBehavior,
    TileDocument<Scene | null>,
    TokenDocument,
    WallDocument<Scene | null>,
    Scene,
    User,
    EffectsCanvasGroup
>;

declare global {
    const CONFIG: ConfiguredConfig;
    const canvas: Canvas;

    namespace globalThis {
        const game: Game<
            Actor<null>,
            Actors<Actor<null>>,
            ChatMessage,
            Combat,
            Item<null>,
            Macro,
            Scene,
            User
        >;

        const ui: FoundryUI<
            ActorDirectory,
            ItemDirectory,
            ChatLog,
            CompendiumDirectory,
            CombatTracker,
            Hotbar<Macro>
        >;
    }

    const BUILD_MODE: "development" | "stage" | "production";
}
