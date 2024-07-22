import { ChangeSidebarTab } from "./changeSidebarTab.ts";
import { CreateActiveEffect } from "./createActiveEffect.ts";
import { CreateEffects } from "./createEffects.ts";
import { GetSceneControlButtons } from "./getSceneControlButtons.ts";
import { Init } from "./init.ts";
import { Ready } from "./ready.ts";
import { RenderItemDirectory } from "./renderItemDirectory.ts";

interface Listener {
    listen(): void;
}

const HooksCE = {
    listen(): void {
        const listeners: Listener[] = [
            Init,
            Ready,
            CreateEffects,
            GetSceneControlButtons,
            CreateActiveEffect,
            RenderItemDirectory,
            ChangeSidebarTab,
        ];

        for (const listener of listeners) {
            listener.listen();
        }
    },
};

export { HooksCE };
export type { Listener };
