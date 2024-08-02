import { isEffectConvenient } from "../helpers.ts";
import { createMacro } from "../ui/create-macro.ts";
import { Listener } from "./index.ts";

const HotbarDrop: Listener = {
    listen(): void {
        Hooks.on("hotbarDrop", (_bar: any, data: any, slot: string) => {
            if (data.type !== "ActiveEffect") return;

            const effect = fromUuidSync(data.uuid) as ActiveEffect<any>;

            if (!effect) return;
            if (!isEffectConvenient(effect)) return;

            delete data.type;

            createMacro(effect, slot);
        });
    },
};

export { HotbarDrop };
