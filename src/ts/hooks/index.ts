import { ChangeSidebarTab } from "./changeSidebarTab.ts";
import { CloseActiveEffectConfig } from "./closeActiveEffectConfig.ts";
import { CreateActiveEffect } from "./createActiveEffect.ts";
import { CreateEffects } from "./createEffects.ts";
import { CreateItem } from "./createItem.ts";
import { DeleteActiveEffect } from "./deleteActiveEffect.ts";
import { DeleteItem } from "./deleteItem.ts";
import { GetSceneControlButtons } from "./getSceneControlButtons.ts";
import { Init } from "./init.ts";
import { Ready } from "./ready.ts";
import { RenderItemDirectory } from "./renderItemDirectory.ts";
import { Setup } from "./setup.ts";
import { UpdateActiveEffect } from "./updateActiveEffect.ts";
import { UpdateItem } from "./updateItem.ts";

interface Listener {
    listen(): void;
}

const HooksCE = {
    listen(): void {
        const listeners: Listener[] = [
            Init,
            Setup,
            Ready,
            CreateEffects,
            GetSceneControlButtons,
            CreateItem,
            UpdateItem,
            DeleteItem,
            CreateActiveEffect,
            UpdateActiveEffect,
            DeleteActiveEffect,
            RenderItemDirectory,
            ChangeSidebarTab,
            CloseActiveEffectConfig,
        ];

        for (const listener of listeners) {
            listener.listen();
        }
    },
};

export { HooksCE };
export type { Listener };
