import "../styles/style.scss"; // Keep or else vite will not include this
import { ThisModule } from "./api.ts";
import { HandlebarHelpers } from "./handlebar-helpers.ts";
import { Settings } from "./settings.ts";
import { id as MODULE_ID } from "@static/module.json";
import { libWrapper } from "@static/lib/shim.ts";

Hooks.once("init", () => {
    new Settings().registerSettings();
    new HandlebarHelpers().registerHelpers();

    (game.modules.get(MODULE_ID) as ThisModule).api = {
        test(): void {
            console.log("Cool");
        },
    };
});

Hooks.once("setup", () => {
    // Various examples

    libWrapper.register(
        MODULE_ID,
        "Canvas.prototype._onDrop",
        function (this: any, wrapped: AnyFunction, ...args: any) {
            console.log(this);
            wrapped(...args);
        },
    );
    libWrapper.register(
        MODULE_ID,
        "Application.prototype.bringToTop",
        function (this: Application, wrapped: () => void) {
            wrapped();
        },
    );
    libWrapper.register(
        MODULE_ID,
        "Application.prototype.minimize",
        function (this: Application, wrapped: () => Promise<boolean>) {
            const r = wrapped();
            r.then(() => console.log("yay"));
            return r;
        },
    );
    libWrapper.register(
        MODULE_ID,
        "Token.prototype._canDrag",
        function (this: any, wrapped: AnyFunction, ...args: any) {
            return wrapped(...args);
        },
        "WRAPPER",
    );
    libWrapper.register(
        MODULE_ID,
        "Token.prototype._onDragLeftStart",
        async function (
            this: Token,
            wrapped: (event: any) => any,
            event: Event,
        ) {
            const result = wrapped(event);
            return result;
        },
        "WRAPPER",
    );
    // Playlist overrides
    libWrapper.register(
        MODULE_ID,
        "Playlist.prototype._onSoundStart",
        _onSoundStartWrapper,
        "WRAPPER",
    );
});

export async function _onSoundStartWrapper(
    this: Playlist,
    wrapped: (sound: PlaylistSound<null>) => void,
    sound: PlaylistSound<null>,
): Promise<void> {
    wrapped(sound);
}
