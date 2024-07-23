import { id as MODULE_ID } from "@static/module.json";

class Settings {
    #USER_ROLES: Record<number, string> = {};

    // Settings keys
    #APP_CONTROLS_PERMISSION = "controlsPermission";
    // #PRIORITIZE_TARGETS = "prioritizeTargets"; // TODO make this a checkbox in the app?

    // Non-config setting keys
    #EFFECT_ITEM_IDs = "effectItemIds";
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

    #registerConfigSettings() {
        this.#registerAppControlsPermission();
    }

    #registerNonConfigSettings(): void {
        this.#registerEffectItemIds();
        this.#registerRanMigrations();
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

    #registerEffectItemIds(): void {
        game.settings.register(MODULE_ID, this.#EFFECT_ITEM_IDs, {
            name: "Effect Item IDs",
            scope: "world",
            config: false,
            default: [],
            type: Array,
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

    get effectItemIds(): string[] | undefined {
        const itemIds = game.settings.get(MODULE_ID, this.#EFFECT_ITEM_IDs);
        if (itemIds) {
            return itemIds as string[];
        } else {
            return undefined;
        }
    }

    async addEffectItemId(itemId: string): Promise<unknown> {
        let effectItemIds = this.effectItemIds;

        if (!effectItemIds) return;

        effectItemIds.push(itemId);

        effectItemIds = [...new Set(effectItemIds)]; // remove duplicates

        return game.settings.set(
            MODULE_ID,
            this.#EFFECT_ITEM_IDs,
            effectItemIds,
        );
    }

    async removeEffectItemId(itemId: string): Promise<unknown> {
        const effectItemIds = this.effectItemIds?.filter(
            (expandedFolder) => expandedFolder !== itemId,
        );

        if (!effectItemIds) return;

        return game.settings.set(
            MODULE_ID,
            this.#EFFECT_ITEM_IDs,
            effectItemIds,
        );
    }

    async setEffectItemIds(effectItemIds: string[]): Promise<unknown> {
        return game.settings.set(MODULE_ID, this.#EFFECT_ITEM_IDs, [
            ...new Set(effectItemIds),
        ]);
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
