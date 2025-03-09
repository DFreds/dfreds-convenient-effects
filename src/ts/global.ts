import EnJSON from "@static/lang/en.json" with { type: "json" };
import { EffectInterface } from "./effect-interface.ts";
import { Sockets } from "./sockets/sockets.ts";

declare global {
    namespace globalThis {
        let CONFIG: Config<
            AmbientLightDocument<Scene | null>,
            ActiveEffect<null>,
            Actor<null>,
            ActorDelta<null>,
            ChatLog,
            ChatMessage,
            Combat,
            Combatant<null, null>,
            CombatTracker<null>,
            CompendiumDirectory,
            Hotbar,
            Item<null>,
            Macro,
            MeasuredTemplateDocument<null>,
            RegionDocument<null>,
            RegionBehavior<null>,
            TileDocument<null>,
            TokenDocument<Scene | null>,
            WallDocument<null>,
            Scene,
            User<Actor<null>>,
            EffectsCanvasGroup
        >;
        let canvas: Canvas;
        let game: GameDFreds;
        let ui: FoundryUI<
            ActorDirectory<Actor<null>>,
            ItemDirectory<Item<null>>,
            ChatLog,
            CompendiumDirectory,
            CombatTracker<Combat | null>,
            Hotbar
        >;
    }

    type AnyFunction = (...args: any) => any;
    type AnyAsyncFunction = (...args: any) => Promise<any>;

    type ActiveEffectOrigin =
        | `Actor.${string}`
        | `Scene.${string}.Token.${string}.Actor.${string}`
        | `Compendium.${string}.Actor.${string}`
        | `Item.${string}`
        | `Compendium.${string}.Item.${string}`;

    interface GameDFreds
        extends Game<
            Actor<null>,
            Actors<Actor<null>>,
            ChatMessage,
            Combat,
            Item<null>,
            Macro,
            Scene,
            User<Actor<null>>
        > {
        dfreds: {
            effectInterface: EffectInterface;
            sockets: Sockets;
        };
    }

    const BUILD_MODE: "development" | "stage" | "production";
    const EN_JSON: typeof EnJSON;
}
