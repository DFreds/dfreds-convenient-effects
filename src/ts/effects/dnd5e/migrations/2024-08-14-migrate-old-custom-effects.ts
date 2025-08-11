import {
    createConvenientEffect,
    createConvenientItem,
} from "../../../utils/creates.ts";
import { notEmpty } from "../../../utils/types.ts";
import { MigrationType } from "../../effect-definition.ts";

const migration: MigrationType = {
    key: "2024-08-14-migrate-old-custom-effects",
    date: new Date("2024-08-14"),
    func: async (): Promise<boolean> => {
        const oldCustomEffect = game.items.find(
            (item) => item.name === "Custom Convenient Effects",
        );

        if (!oldCustomEffect) return true;

        const newItem = createConvenientItem({
            item: oldCustomEffect.toObject(),
        });
        newItem.name = "Legacy Custom Convenient Effects";
        newItem.effects = newItem.effects?.filter(notEmpty).map((effect) => {
            return createConvenientEffect({ effect });
        });

        await Item.create(newItem);
        await oldCustomEffect.delete();

        return true;
    },
};

export { migration as migrateOldCustomEffects };
