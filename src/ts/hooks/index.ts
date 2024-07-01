import { CreateEffects } from "./createEffects.ts";
import { Init } from "./init.ts";
import { Ready } from "./ready.ts";

interface Listener {
    listen(): void;
}

const HooksCE = {
    listen(): void {
        const listeners: Listener[] = [Init, Ready, CreateEffects];

        for (const listener of listeners) {
            listener.listen();
        }
    },
};

export { HooksCE };
export type { Listener };
