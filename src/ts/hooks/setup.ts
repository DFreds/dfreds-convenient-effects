import { id as MODULE_ID } from "@static/module.json";
import { libWrapper } from "@static/lib/shim.ts";
import { Listener } from "./index.ts";
import { Flags } from "../utils/flags.ts";
import { ItemSource } from "types/foundry/common/documents/item.js";
import { notEmpty } from "../utils/types.ts";
import {
    createConvenientEffect,
    createConvenientItem,
} from "../utils/creates.ts";

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

            libWrapper.register(
                MODULE_ID,
                "Item.prototype.importFromJSON",
                async function (
                    this: Item<any>,
                    wrapped: AnyFunction,
                    ...args: any
                ) {
                    // `this` is the item that will be replaced with data
                    // Only do our wrapper if importing into an existing convenient item
                    if (!Flags.isConvenient(this)) {
                        wrapped(args);
                        return;
                    }

                    const [json] = args;

                    const item = Item.fromJSON(
                        json,
                    ).toObject() as PreCreate<ItemSource>;

                    const convenientItem = createConvenientItem({
                        item,
                    });
                    convenientItem.effects = convenientItem.effects
                        ?.filter(notEmpty)
                        .map((effect) => {
                            return createConvenientEffect({ effect });
                        });

                    const newJson = JSON.stringify(convenientItem, null, 2);
                    wrapped([newJson]);
                },
            );
        });
    },
};

export { Setup };
