import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";
import { Settings } from "../settings.ts";
import { Flags } from "../utils/flags.ts";
import { notEmpty } from "../utils/types.ts";
import { findModuleById } from "../utils/finds.ts";
import { MODULE_IDS } from "../constants.ts";

class HandlebarHelpers {
    #settings: Settings;

    constructor() {
        this.#settings = new Settings();
    }

    register(): void {
        this.#registerInc();
        this.#registerIsGm();
        this.#registerCanCreateFolders();
        this.#registerGetCeEffectId();
        this.#registerIsViewable();
        this.#registerIsDynamic();
        this.#registerGetFolderColor();
        this.#registerStripHtml();
        this.#registerConvenientFolderIcons();
        this.#registerConvenientEffectIcons();
    }

    #registerInc() {
        Handlebars.registerHelper("inc", (value) => {
            return parseInt(value) + 1;
        });
    }

    #registerIsGm() {
        Handlebars.registerHelper("isGm", () => {
            return game.user.isGM;
        });
    }

    #registerCanCreateFolders() {
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

    #registerIsViewable() {
        Handlebars.registerHelper("isViewable", (effect) => {
            return Flags.isViewable(effect);
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

    #registerStripHtml() {
        Handlebars.registerHelper("stripHtml", (str: string) => {
            const regExp = /<[/\w]+>/g;
            return new Handlebars.SafeString(str.replace(regExp, ""));
        });
    }

    #registerConvenientFolderIcons() {
        Handlebars.registerHelper(
            "convenientFolderIcons",
            (folder: Item<any>) => {
                let icons = "";

                if (!Flags.isViewable(folder)) {
                    icons += `
                        <div class="folder-icon">
                            <i class="fas fa-eye-slash" title='Folder Hidden'></i>
                        </div>
                        `;
                }

                return icons;
            },
        );
    }

    #registerConvenientEffectIcons() {
        Handlebars.registerHelper(
            "convenientEffectIcons",
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

                icons += this.#getHiddenIcon(effect);
                icons += this.#getNestedEffectsIcon(nestedEffects ?? []);

                if (findModuleById(MODULE_IDS.MIDI)?.active) {
                    icons += this.#getMidiIcon(allChanges);
                }

                if (findModuleById(MODULE_IDS.ATE)?.active) {
                    icons += this.#getAteIcon(allChanges);
                }

                if (findModuleById(MODULE_IDS.TOKEN_MAGIC)?.active) {
                    icons += this.#getTokenMagicIcon(allChanges);
                }

                // TODO add an icon for an effect that is nested?

                return icons;
            },
        );
    }

    #getHiddenIcon(document: ActiveEffect<Item<null>>): string {
        return !Flags.isViewable(document)
            ? "<i class='fas fa-eye-slash integration-icon' title='Effect Hidden'></i>"
            : "";
    }

    #getNestedEffectsIcon(nestedEffects: ActiveEffect<Item<null>>[]): string {
        return nestedEffects && nestedEffects.length > 0
            ? "<i class='fas fa-list-tree integration-icon' title='Nested Effects'></i> "
            : "";
    }

    #getMidiIcon(changes: DeepPartial<EffectChangeData>[]): string {
        return changes.some((change) =>
            change.key?.startsWith("flags.midi-qol"),
        )
            ? "<i class='fas fa-dice-d20 integration-icon' title='Midi-QoL Effects'></i> "
            : "";
    }

    #getAteIcon(changes: DeepPartial<EffectChangeData>[]): string {
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
