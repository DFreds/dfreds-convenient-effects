import {
    createConvenientEffect,
    createConvenientItem,
} from "src/ts/utils/creates.ts";
import { MigrationType } from "../../effect-definition.ts";
import { notEmpty } from "src/ts/utils/types.ts";

const migration: MigrationType = {
    key: "2024-08-14-migrate-old-custom-effects",
    date: new Date("2024-08-14"),
    func: async () => {
        const oldCustomEffect = game.items.find(
            (item) => item.name === "Custom Convenient Effects",
        );

        if (!oldCustomEffect) return;

        const newItem = createConvenientItem({
            item: oldCustomEffect.toObject(),
        });
        newItem.name = "Legacy Custom Convenient Effects";
        newItem.effects = newItem.effects?.filter(notEmpty).map((effect) => {
            return createConvenientEffect({ effect });
        });

        await Item.create(newItem);
        await oldCustomEffect.delete();
    },
};

export { migration as migrateOldCustomEffects };
