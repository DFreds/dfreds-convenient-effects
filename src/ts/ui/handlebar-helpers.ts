import {
    ActiveEffectSource,
    EffectChangeData,
} from "types/foundry/common/documents/active-effect.js";
import { Settings } from "../settings.ts";
import { Flags } from "../utils/flags.ts";

class HandlebarHelpers {
    #settings: Settings;

    constructor() {
        this.#settings = new Settings();
    }

    register(): void {
        this.#registerIncHelper();
        this.#registerIsGmHelper();
        this.#registerCanCreateFoldersHelper();
        this.#registerGetFolderColorFlag();
        this.#registerGetCeEffectIdFlag();
        this.#registerConvenientIconsHelper();
    }

    #registerIncHelper() {
        Handlebars.registerHelper("inc", (value) => {
            return parseInt(value) + 1;
        });
    }

    #registerIsGmHelper() {
        Handlebars.registerHelper("isGm", () => {
            return game.user.isGM;
        });
    }

    #registerCanCreateFoldersHelper() {
        Handlebars.registerHelper("canCreateFolders", () => {
            const canCreateItems = game.user.hasPermission("ITEM_CREATE");
            const settingEnabled =
                game.user.role >= this.#settings.createFoldersPermission;

            return canCreateItems && settingEnabled;
        });
    }

    #registerGetFolderColorFlag() {
        Handlebars.registerHelper("getFolderColorFlag", (item) => {
            return Flags.getFolderColor(item);
        });
    }

    #registerGetCeEffectIdFlag() {
        Handlebars.registerHelper("getCeEffectIdFlag", (effect) => {
            return Flags.getCeEffectId(effect);
        });
    }

    #registerConvenientIconsHelper() {
        Handlebars.registerHelper(
            "convenientIcons",
            (effect: ActiveEffect<any>) => {
                let icons = "";

                const nestedEffects = Flags.getNestedEffects(effect);

                const effectChanges = (effect.changes ??
                    []) as DeepPartial<EffectChangeData>[];
                const subChanges = nestedEffects
                    .flatMap((nestedEffect) => nestedEffect.changes)
                    .filter((change) => change !== undefined);

                const allChanges = [
                    ...effectChanges,
                    ...subChanges,
                ] as DeepPartial<EffectChangeData>[];

                icons += this.#getNestedEffectsIcon(nestedEffects);
                icons += this.#getMidiIcon(allChanges);
                icons += this.#getAtlIcon(allChanges);
                icons += this.#getTokenMagicIcon(allChanges);

                return icons;
            },
        );
    }

    #getNestedEffectsIcon(
        nestedEffects: PreCreate<ActiveEffectSource>[],
    ): string {
        return nestedEffects.length > 0
            ? "<i class='fas fa-tree integration-icon' title='Nested Effects'></i> "
            : "";
    }

    #getMidiIcon(changes: DeepPartial<EffectChangeData>[]): string {
        return changes.some((change) =>
            change.key?.startsWith("flags.midi-qol"),
        )
            ? "<i class='fas fa-dice-d20 integration-icon' title='Midi-QoL Effects'></i> "
            : "";
    }

    #getAtlIcon(changes: DeepPartial<EffectChangeData>[]): string {
        return changes.some((change) => change.key?.startsWith("ATL"))
            ? "<i class='fas fa-lightbulb integration-icon' title='ATL Effects'></i> "
            : "";
    }

    #getTokenMagicIcon(changes: DeepPartial<EffectChangeData>[]): string {
        return changes.some((change) =>
            change.key?.startsWith("macro.tokenMagic"),
        )
            ? "<i class='fas fa-magic integration-icon' title='Token Magic Effects'></i> "
            : "";
    }
}

export { HandlebarHelpers };
