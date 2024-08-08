import { id as MODULE_ID } from "@static/module.json";
import { libWrapper } from "@static/lib/shim.ts";
import { Listener } from "./index.ts";
import { Flags } from "../utils/flags.ts";

const Setup: Listener = {
    listen(): void {
        Hooks.once("setup", () => {
            libWrapper.register(
                MODULE_ID,
                "ActiveEffect.prototype.isTemporary",
                function (
                    this: ActiveEffect<any>,
                    wrapped: AnyFunction,
                    ...args: any
                ) {
                    const result = wrapped(args) as boolean;
                    return result || Flags.isTemporary(this);
                },
            );
        });
    },
};

export { Setup };
