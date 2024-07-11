import { id as MODULE_ID } from "@static/module.json";
import { Listener } from "./index.ts";
import { Settings } from "../settings.ts";
import { ItemSource } from "types/foundry/common/documents/item.js";

/**
 * Handle creating the Item that will hold the effects
 */
const Ready: Listener = {
    listen(): void {
        Hooks.once("ready", async () => {
            const settings = new Settings();
            if (settings.effectsItemId) return; // Only do this one time
            if (!game.user.isGM) return; // Only allow GMs to do this

            // TODO extract?
            const ceData: Omit<
                DeepPartial<ItemSource>,
                "_id" | "name" | "type"
            > & { _id?: Maybe<string>; name: string; type: string } = {
                name: "Convenient Effects Holder",
                img: "modules/dfreds-convenient-effects/images/magic-palm.svg",
                type: CONFIG.Item.typeLabels[0] ?? "consumable", // TODO when undefined... do what?
            };
            const item = await Item.create([ceData]);

            await settings.setEffectsItemId(item[0].id);

            Hooks.callAll(`${MODULE_ID}.createEffects`);
        });
    },
};

export { Ready };
