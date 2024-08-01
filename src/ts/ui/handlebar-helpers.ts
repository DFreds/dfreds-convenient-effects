import { id as MODULE_ID } from "@static/module.json";
import { FLAGS } from "../constants.ts";
import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";
import { Settings } from "../settings.ts";

class HandlebarHelpers {
    #settings: Settings;

    constructor() {
        this.#settings = new Settings();
    }

    register(): void {
        this.#registerIncHelper();
        this.#registerIsGmHelper();
        this.#registerCanCreateFoldersHelper();
        this.#registerHasNestedEffectsHelper();
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

    #registerHasNestedEffectsHelper() {
        Handlebars.registerHelper("hasNestedEffects", (effect) => {
            const nestedEffects =
                effect.getFlag(MODULE_ID, FLAGS.NESTED_EFFECTS) ?? [];

            return nestedEffects.length > 0;
        });
    }

    #registerConvenientIconsHelper() {
        Handlebars.registerHelper(
            "convenientIcons",
            (effect: ActiveEffect<any>) => {
                let icons = "";

                const nestedEffectIds = (effect.getFlag(
                    MODULE_ID,
                    FLAGS.NESTED_EFFECTS,
                ) ?? []) as string[];

                const nestedEffects = nestedEffectIds
                    .map((id) => {
                        return game.dfreds.effectInterface.findEffect({
                            effectId: id,
                        });
                    })
                    .filter((effect) => effect !== undefined);

                const subChanges = nestedEffects.flatMap(
                    (nestedEffect) => nestedEffect!.changes,
                );

                const allChanges = [...effect.changes, ...subChanges];

                // icons += this.#getNestedEffectsIcon(nestedEffects);
                icons += this.#getMidiIcon(allChanges);
                icons += this.#getWireIcon(allChanges);
                icons += this.#getAtlIcon(allChanges);
                icons += this.#getTokenMagicIcon(allChanges);

                return icons;
            },
        );
    }

    // #getNestedEffectsIcon(
    //     nestedEffects: BaseActiveEffect<Item<null>>[],
    // ): string {
    //     return nestedEffects.length > 0
    //         ? "<i class='fas fa-tree integration-icon' title='Nested Effects'></i> "
    //         : "";
    // }

    #getMidiIcon(changes: EffectChangeData[]): string {
        return changes.some((change) => change.key.startsWith("flags.midi-qol"))
            ? "<i class='fas fa-dice-d20 integration-icon' title='Midi-QoL Effects'></i> "
            : "";
    }

    #getWireIcon(changes: EffectChangeData[]): string {
        return changes.some((change) => change.key.startsWith("flags.wire"))
            ? "<i class='fas fa-plug integration-icon' title='Wire Effects'></i> "
            : "";
    }

    #getAtlIcon(changes: EffectChangeData[]): string {
        return changes.some((change) => change.key.startsWith("ATL"))
            ? "<i class='fas fa-lightbulb integration-icon' title='ATL Effects'></i> "
            : "";
    }

    #getTokenMagicIcon(changes: EffectChangeData[]): string {
        return changes.some((change) =>
            change.key.startsWith("macro.tokenMagic"),
        )
            ? "<i class='fas fa-magic integration-icon' title='Token Magic Effects'></i> "
            : "";
    }
}

export { HandlebarHelpers };
