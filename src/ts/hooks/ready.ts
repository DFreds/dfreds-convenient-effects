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

            const ceData: Omit<
                DeepPartial<ItemSource>,
                "_id" | "name" | "type"
            > & { _id?: Maybe<string>; name: string; type: string } = {
                name: "Convenient Effects Holder",
                img: "modules/dfreds-convenient-effects/images/magic-palm.svg",
                type: CONFIG.Item.typeLabels[0] ?? "consumable",
            };
            const item = await Item.create([ceData]);

            settings.setEffectsItemId(item[0].id);
        });
    },
};

export { Ready };
