import { EffectChangeData } from "types/foundry/common/documents/active-effect.js";
import { Settings } from "../settings.ts";
import { Flags } from "../utils/flags.ts";
import { notEmpty } from "../utils/types.ts";
import { findAllNestedEffectIds, findModuleById } from "../utils/finds.ts";
import { MODULE_IDS } from "../constants.ts";

class HandlebarHelpers {
    #settings: Settings;

    constructor() {
        this.#settings = new Settings();
    }

    register(): void {
        this.#registerCanCreateFolders();
        this.#registerCanCreateEffects();
        this.#registerGetCeEffectId();
        this.#registerIsTemporary();
        this.#registerIsViewable();
        this.#registerIsDynamic();
        this.#registerGetFolderColor();
        this.#registerConvenientFolderIcons();
        this.#registerConvenientEffectIcons();
    }

    #registerCanCreateFolders() {
        Handlebars.registerHelper("canCreateFolders", () => {
            const canCreateItems = game.user.hasPermission("ITEM_CREATE");
            const settingEnabled =
                game.user.role >= this.#settings.createFoldersPermission;

            return canCreateItems && settingEnabled;
        });
    }

    #registerCanCreateEffects() {
        Handlebars.registerHelper("canCreateEffects", (folder: Item) => {
            return folder.isOwner;
        });
    }

    #registerGetCeEffectId() {
        Handlebars.registerHelper(
            "getCeEffectId",
            (effect: ActiveEffect<any>) => {
                return Flags.getCeEffectId(effect);
            },
        );
    }

    #registerIsTemporary() {
        Handlebars.registerHelper(
            "isTemporary",
            (effect: ActiveEffect<any>) => {
                return Flags.isTemporary(effect);
            },
        );
    }

    #registerIsViewable() {
        Handlebars.registerHelper("isViewable", (effect: ActiveEffect<any>) => {
            return Flags.isViewable(effect);
        });
    }

    #registerIsDynamic() {
        Handlebars.registerHelper("isDynamic", (effect: ActiveEffect<any>) => {
            return Flags.isDynamic(effect);
        });
    }

    #registerGetFolderColor() {
        Handlebars.registerHelper("getFolderColor", (folder: Item<any>) => {
            return Flags.getFolderColor(folder);
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

                const allChanges = this.#getAllChanges(effect, nestedEffects);

                icons += this.#getPassiveIcon(effect);
                icons += this.#getHiddenIcon(effect);
                icons += this.#getHasNestedEffectsIcon(nestedEffects);
                icons += this.#getIsNestedEffectsIcon(
                    Flags.getCeEffectId(effect),
                    findAllNestedEffectIds({ backup: false }),
                );

                if (findModuleById(MODULE_IDS.MIDI)?.active) {
                    icons += this.#getMidiIcon(allChanges);
                }

                if (findModuleById(MODULE_IDS.ATE)?.active) {
                    icons += this.#getAteIcon(allChanges);
                }

                if (findModuleById(MODULE_IDS.TOKEN_MAGIC)?.active) {
                    icons += this.#getTokenMagicIcon(allChanges);
                }

                return icons;
            },
        );
    }

    #getAllChanges(
        effect: ActiveEffect<any>,
        nestedEffects: ActiveEffect<any>[],
    ): DeepPartial<EffectChangeData>[] {
        const effectChanges = (effect.changes ??
            []) as DeepPartial<EffectChangeData>[];
        const nestedChanges = nestedEffects
            .flatMap((nestedEffect) => nestedEffect.changes)
            .filter(notEmpty);

        return [...effectChanges, ...nestedChanges];
    }

    #getPassiveIcon(effect: ActiveEffect<Item<null>>): string {
        return !effect.isTemporary
            ? "<i class='fas fa-repeat integration-icon' title='Passive'></i>"
            : "";
    }

    #getHiddenIcon(effect: ActiveEffect<Item<null>>): string {
        return !Flags.isViewable(effect)
            ? "<i class='fas fa-eye-slash integration-icon' title='Effect Hidden'></i>"
            : "";
    }

    #getHasNestedEffectsIcon(
        nestedEffects: ActiveEffect<Item<null>>[],
    ): string {
        return nestedEffects && nestedEffects.length > 0
            ? "<i class='fas fa-trees integration-icon' title='Has Nested Effects'></i> "
            : "";
    }

    #getIsNestedEffectsIcon(
        ceEffectId: string | undefined,
        nestedEffectIds: string[],
    ): string {
        return ceEffectId && nestedEffectIds?.includes(ceEffectId)
            ? "<i class='fas fa-tree integration-icon' title='Is Nested Effect'></i> "
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
            ? "<i class='fas fa-wand-magic-sparkles integration-icon' title='Token Magic Effects'></i> "
            : "";
    }
}

export { HandlebarHelpers };
