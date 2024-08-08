import { createMacro } from "../ui/create-macro.ts";
import { findEffectByUuid } from "../utils/finds.ts";
import { Flags } from "../utils/flags.ts";
import { Listener } from "./index.ts";

const HotbarDrop: Listener = {
    listen(): void {
        Hooks.on("hotbarDrop", async (_bar: any, data: any, slot: string) => {
            if (data.type !== "ActiveEffect") return;

            const effect = await findEffectByUuid(data.uuid);

            if (!effect) return;
            if (!Flags.isConvenient(effect)) return;

            delete data.type;

            createMacro(effect, slot);
        });
    },
};

export { HotbarDrop };
