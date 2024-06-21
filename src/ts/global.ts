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
        let game: Game<
            Actor<null>,
            Actors<Actor<null>>,
            ChatMessage,
            Combat,
            Item<null>,
            Macro,
            Scene,
            User
        >;
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
}
