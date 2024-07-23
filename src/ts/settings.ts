import { id as MODULE_ID } from "@static/module.json";

class Settings {
    #USER_ROLES: Record<number, string> = {};

    // Settings keys
    #APP_CONTROLS_PERMISSION = "controlsPermission";
    // #PRIORITIZE_TARGETS = "prioritizeTargets"; // TODO make this a checkbox in the app?

    #RAN_MIGRATIONS = "ranMigrations";

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

    register(): void {
        this.#registerConfigSettings();
        this.#registerNonConfigSettings();
    }

    #registerConfigSettings(): void {
        this.#registerAppControlsPermission();
    }

    #registerNonConfigSettings(): void {
        this.#registerRanMigrations();
    }

    #registerAppControlsPermission(): void {
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

    #registerRanMigrations(): void {
        game.settings.register(MODULE_ID, this.#RAN_MIGRATIONS, {
            name: "Ran Migrations",
            scope: "world",
            config: false,
            default: [],
            type: Array,
        });
    }

    get appControlsPermission(): number {
        // TODO do we need to parseInt here?
        return parseInt(
            game.settings.get(
                MODULE_ID,
                this.#APP_CONTROLS_PERMISSION,
            )! as string,
        );
    }

    get ranMigrations(): string[] {
        const effectVersionsRun = game.settings.get(
            MODULE_ID,
            this.#RAN_MIGRATIONS,
        ) as string[] | undefined;

        return effectVersionsRun ?? [];
    }

    async addRanMigration(migrationKey: string): Promise<unknown> {
        let ranMigrations = this.ranMigrations;

        ranMigrations.push(migrationKey);

        ranMigrations = [...new Set(ranMigrations)]; // remove duplicates

        return game.settings.set(
            MODULE_ID,
            this.#RAN_MIGRATIONS,
            ranMigrations,
        );
    }

    async clearRanMigrations(): Promise<unknown> {
        return game.settings.set(MODULE_ID, this.#RAN_MIGRATIONS, []);
    }
}

export { Settings };
