import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";
import { Settings } from "../settings.ts";
import { Flags } from "../utils/flags.ts";
import { notEmpty } from "../utils/types.ts";

class HandlebarHelpers {
    #settings: Settings;

    constructor() {
        this.#settings = new Settings();
    }

    register(): void {
        this.#registerIncHelper();
        this.#registerIsGmHelper();
        this.#registerCanCreateFoldersHelper();
        this.#registerGetCeEffectId();
        this.#registerIsDynamic();
        this.#registerGetFolderColor();
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

    #registerGetCeEffectId() {
        Handlebars.registerHelper("getCeEffectId", (effect) => {
            return Flags.getCeEffectId(effect);
        });
    }

    #registerIsDynamic() {
        Handlebars.registerHelper("isDynamic", (effect) => {
            return Flags.isDynamic(effect);
        });
    }

    #registerGetFolderColor() {
        Handlebars.registerHelper("getFolderColor", (item) => {
            return Flags.getFolderColor(item);
        });
    }

    #registerConvenientIconsHelper() {
        Handlebars.registerHelper(
            "convenientIcons",
            (effect: ActiveEffect<any>) => {
                let icons = "";

                const nestedEffectIds = Flags.getNestedEffectIds(effect) ?? [];
                const nestedEffects = nestedEffectIds
                    .map((id) => {
                        return game.dfreds.effectInterface.findEffect({
                            effectId: id,
                        });
                    })
                    .filter(notEmpty);

                const effectChanges = (effect.changes ??
                    []) as DeepPartial<EffectChangeData>[];
                const nestedChanges = nestedEffects
                    .flatMap((nestedEffect) => nestedEffect.changes)
                    .filter(notEmpty);

                const allChanges = [
                    ...effectChanges,
                    ...nestedChanges,
                ] as DeepPartial<EffectChangeData>[];

                icons += this.#getNestedEffectsIcon(nestedEffects ?? []);
                icons += this.#getMidiIcon(allChanges);
                icons += this.#getAtlIcon(allChanges);
                icons += this.#getTokenMagicIcon(allChanges);

                return icons;
            },
        );
    }

    #getNestedEffectsIcon(nestedEffects: ActiveEffect<Item<null>>[]): string {
        return nestedEffects && nestedEffects.length > 0
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
