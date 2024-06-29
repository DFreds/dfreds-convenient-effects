import { id as MODULE_ID } from "@static/module.json";

class Settings {
    // Settings keys
    #PRIORITIZE_TARGETS = "prioritizeTargets"; // TODO make this a checkbox in the app?

    // Non-config setting keys
    #EFFECTS_ITEM_ID = "customEffectsItemId"; // legacy key name

    registerSettings(): void {
        this.#registerConfigSettings();
        // game.settings.register(MODULE_ID, this.#DUMMY, {
        //     name: "Some dummy setting",
        //     hint: "Some dummy hint",
        //     scope: "world",
        //     config: true,
        //     default: true,
        //     type: Boolean,
        // });
    }

    #registerConfigSettings() {
        const userRoles: Record<number, string> = {};
        userRoles[CONST.USER_ROLES.PLAYER] = game.i18n.localize(
            "ConvenientEffects.SettingPlayer",
        );
        userRoles[CONST.USER_ROLES.TRUSTED] = game.i18n.localize(
            "ConvenientEffects.SettingTrustedPlayer",
        );
        userRoles[CONST.USER_ROLES.ASSISTANT] = game.i18n.localize(
            "ConvenientEffects.SettingAssistantGM",
        );
        userRoles[CONST.USER_ROLES.GAMEMASTER] = game.i18n.localize(
            "ConvenientEffects.SettingGameMaster",
        );
        userRoles[5] = game.i18n.localize("ConvenientEffects.SettingNone");
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
}

export { Settings };
