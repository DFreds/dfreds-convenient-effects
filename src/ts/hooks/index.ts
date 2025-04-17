import { CloseActiveEffectConfig } from "./closeActiveEffectConfig.ts";
import { CreateActiveEffect } from "./createActiveEffect.ts";
import { CreateItem } from "./createItem.ts";
import { DeleteActiveEffect } from "./deleteActiveEffect.ts";
import { DeleteItem } from "./deleteItem.ts";
import { DropActorSheetData } from "./dropActorSheetData.ts";
import { GetHeaderControlsActiveEffectConfig } from "./getHeaderControlsActiveEffectConfig.ts";
import { HotbarDrop } from "./hotbarDrop.ts";
import { Init } from "./init.ts";
import { PreUpdateActiveEffect } from "./preUpdateActiveEffect.ts";
import { Ready } from "./ready.ts";
import { RenderItemDirectory } from "./renderItemDirectory.ts";
import { Setup } from "./setup.ts";
import { SocketlibReady } from "./socketlib.ready.ts";
import { UiExtenderInit } from "./uiExtender.init.ts";
import { UpdateActiveEffect } from "./updateActiveEffect.ts";
import { UpdateItem } from "./updateItem.ts";

interface Listener {
    listen(): void;
}

const HooksCE = {
    listen(): void {
        const listeners: Listener[] = [
            Init,
            UiExtenderInit,
            Setup,
            Ready,
            SocketlibReady,
            CreateItem,
            UpdateItem,
            DeleteItem,
            CreateActiveEffect,
            PreUpdateActiveEffect,
            UpdateActiveEffect,
            DeleteActiveEffect,
            RenderItemDirectory,
            CloseActiveEffectConfig,
            HotbarDrop,
            DropActorSheetData,
            GetHeaderControlsActiveEffectConfig,
        ];

        for (const listener of listeners) {
            listener.listen();
        }
    },
};

export { HooksCE };
export type { Listener };
