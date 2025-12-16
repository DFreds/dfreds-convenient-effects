import { Listener } from "./index.ts";
import { ConvenientEffectConfigV2 } from "../ui/ce-config/convenient-effect-config.ts";
import { Flags } from "../utils/flags.ts";
import { ApplicationHeaderControlsEntry } from "@client/applications/_module.mjs";
import DocumentSheetConfig from "@client/applications/apps/document-sheet-config.mjs";

const GetHeaderControlsActiveEffectConfig: Listener = {
    listen(): void {
        Hooks.on(
            "getHeaderControlsActiveEffectConfig",
            (config: any, controls: any) => {
                const configTyped = config as DocumentSheetConfig;
                const controlsTyped =
                    controls as ApplicationHeaderControlsEntry[];

                controlsTyped.push({
                    icon: "fa-solid fa-hand-sparkles",
                    label: "ConvenientEffects.Config.Title",
                    action: "convenient-effect-config",
                    visible: () => {
                        const parent = configTyped.document.parent;
                        const isItem = parent instanceof Item;
                        const isConvenientItem = Flags.isConvenient(
                            parent as any,
                        ) ?? false;
                        const isOwner = configTyped.document.isOwner;
                        const isGM = game.user.isGM;

                        return (isOwner || isGM) && isItem && isConvenientItem;
                    },
                    onClick: () => {
                        new ConvenientEffectConfigV2({
                            // TODO this any is because of some circular dependencies with ActiveEffect
                            document: configTyped.document as any,
                        }).render({ force: true });
                    },
                });
            },
        );
    },
};

export { GetHeaderControlsActiveEffectConfig };
