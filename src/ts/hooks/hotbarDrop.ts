import { createMacro } from "../ui/create-macro.ts";
import { Flags } from "../utils/flags.ts";
import { Listener } from "./index.ts";

const HotbarDrop: Listener = {
    listen(): void {
        Hooks.on("hotbarDrop", (_bar: any, data: any, slot: string) => {
            if (data.type !== "ActiveEffect") return;

            const effect = fromUuidSync(data.uuid);

            if (!(effect instanceof ActiveEffect)) return;
            if (!Flags.isConvenient(effect)) return;

            createMacro(effect, slot);
            return false;
        });
    },
};

export { HotbarDrop };
