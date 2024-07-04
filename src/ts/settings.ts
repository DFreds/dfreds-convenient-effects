import { id as MODULE_ID } from "@static/module.json";

class Settings {
    #USER_ROLES: Record<number, string> = {};

    // Settings keys
    #APP_CONTROLS_PERMISSION = "controlsPermission";
    #PRIORITIZE_TARGETS = "prioritizeTargets"; // TODO make this a checkbox in the app?

    // Non-config setting keys
    #EFFECTS_ITEM_ID = "customEffectsItemId"; // legacy key name
    #EFFECTS_VERSION = "hasInitializedEffects";

    constructor() {
        this.#USER_ROLES[CONST.USER_ROLES.PLAYER] = game.i18n.localize(
            "ConvenientEffects.SettingPlayer",
        );
        this.#USER_ROLES[CONST.USER_ROLES.TRUSTED] = game.i18n.localize(
            "ConvenientEffects.SettingTrustedPlayer",
        );
        this.#USER_ROLES[CONST.USER_ROLES.ASSISTANT] = game.i18n.localize(
            "ConvenientEffects.SettingAssistantGM",
        );
        this.#USER_ROLES[CONST.USER_ROLES.GAMEMASTER] = game.i18n.localize(
            "ConvenientEffects.SettingGameMaster",
        );
        this.#USER_ROLES[5] = game.i18n.localize(
            "ConvenientEffects.SettingNone",
        );
    }

    registerSettings(): void {
        this.#registerConfigSettings();
    }

    #registerConfigSettings() {
        this.#registerAppControlsPermission();
    }

    #registerAppControlsPermission() {
        game.settings.register(MODULE_ID, this.#APP_CONTROLS_PERMISSION, {
            name: "ConvenientEffects.SettingAppControlsPermissionName",
            hint: "ConvenientEffects.SettingAppControlsPermissionHint",
            scope: "world",
            config: true,
            default: CONST.USER_ROLES.GAMEMASTER,
            choices: this.#USER_ROLES,
            type: String,
            requiresReload: true,
        });
    }

    /* region Settings getters and setters */
    get appControlsPermission(): number {
        // TODO do we need to parseInt here?
        return parseInt(
            game.settings.get(
                MODULE_ID,
                this.#APP_CONTROLS_PERMISSION,
            )! as string,
        );
    }

    get effectsItemId(): string | undefined {
        const itemId = game.settings.get(MODULE_ID, this.#EFFECTS_ITEM_ID);
        if (itemId) {
            return itemId as string;
        } else {
            return undefined;
        }
    }

    async setEffectsItemId(itemId: string): Promise<unknown> {
        return game.settings.set(MODULE_ID, this.#EFFECTS_ITEM_ID, itemId);
    }

    get effectsVersion(): number {
        const hasInitializedEffects = game.settings.get(
            MODULE_ID,
            this.#EFFECTS_VERSION,
        ) as number | undefined;

        return hasInitializedEffects ?? -1;
    }

    async setEffectsVersion(value: number): Promise<unknown> {
        return game.settings.set(MODULE_ID, this.#EFFECTS_VERSION, value);
    }
}

export { Settings };
