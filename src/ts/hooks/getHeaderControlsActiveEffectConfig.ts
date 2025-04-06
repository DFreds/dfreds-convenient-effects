import { ApplicationHeaderControlsEntry } from "types/foundry/client-esm/applications/_types.js";
import { Listener } from "./index.ts";
import { ConvenientEffectConfigV2 } from "../ui/convenient-effect-config.ts";
import { Flags } from "../utils/flags.ts";

const GetHeaderControlsActiveEffectConfig: Listener = {
    listen(): void {
        Hooks.on(
            "getHeaderControlsActiveEffectConfig",
            (config: any, controls: any) => {
                const configTyped = config as ActiveEffectConfig<
                    ActiveEffect<any>
                >;
                const controlsTyped =
                    controls as ApplicationHeaderControlsEntry[];

                controlsTyped.push({
                    icon: "fa-solid fa-hand-sparkles",
                    label: "ConvenientEffects.ConfigLabel",
                    action: "convenient-effect-config",
                    visible: () => {
                        const parent = configTyped.document.parent;
                        const isItem = parent instanceof Item;
                        const isConvenientItem = Flags.isConvenient(parent);
                        const isOwner = configTyped.document.isOwner;
                        const isGM = game.user.isGM;

                        return (isOwner || isGM) && isItem && isConvenientItem;
                    },
                    onClick: () => {
                        new ConvenientEffectConfigV2({
                            document: configTyped.document,
                        }).render(true);
                    },
                });
            },
        );
    },
};

export { GetHeaderControlsActiveEffectConfig };
