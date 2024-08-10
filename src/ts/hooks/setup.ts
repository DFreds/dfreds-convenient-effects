import { id as MODULE_ID } from "@static/module.json";
import { libWrapper } from "@static/lib/shim.ts";
import { Listener } from "./index.ts";
import { Flags } from "../utils/flags.ts";
import { ItemSource } from "types/foundry/common/documents/item.js";
import { notEmpty } from "../utils/types.ts";

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
                    const [json] = args;

                    const item = Item.fromJSON(
                        json,
                    ).toObject() as PreCreate<ItemSource>;

                    if (Flags.isConvenient(item) && Flags.isBackup(item)) {
                        Flags.setIsBackup(item, false);
                        const effects = item.effects
                            ?.filter(notEmpty)
                            .map((effect) => {
                                Flags.setIsBackup(effect, false);
                                return effect;
                            });

                        item.effects = effects;

                        const newJson = JSON.stringify(item, null, 2);
                        console.log(newJson);

                        wrapped([newJson]);
                    } else {
                        wrapped(args);
                    }
                },
            );
        });
    },
};

export { Setup };
