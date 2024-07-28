import { id as MODULE_ID } from "@static/module.json";
import { libWrapper } from "@static/lib/shim.ts";
import { Listener } from "./index.ts";
import { isEffectConvenient } from "../helpers.ts";

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
                    // TODO can we have a separate flag and allow creating both passive and temp effects?
                    const isConvenient = isEffectConvenient(this);
                    const result = wrapped(args) as boolean;
                    return result || isConvenient;
                },
            );
        });
    },
};

export { Setup };
