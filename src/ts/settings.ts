import { id as MODULE_ID } from "@static/module.json";

class Settings {
    // Settings keys
    #DUMMY = "dummy";

    registerSettings(): void {
        game.settings.register(MODULE_ID, this.#DUMMY, {
            name: "Some dummy setting",
            hint: "Some dummy hint",
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
        });
    }

    get dummy(): Boolean {
        return game.settings.get(MODULE_ID, this.#DUMMY) as Boolean;
    }
}

export { Settings };
