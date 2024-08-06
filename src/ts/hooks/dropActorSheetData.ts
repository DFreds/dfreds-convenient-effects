import { Listener } from "./index.ts";

const DropActorSheetData: Listener = {
    listen(): void {
        Hooks.on("dropActorSheetData", (actor: any, _actorSheet, data: any) => {
            if (!data.effectId) return;

            const actorData = actor as Actor<any>;

            game.dfreds.effectInterface.addEffect({
                effectId: data.effectId,
                uuid: actorData.uuid,
            });
        });
    },
};

export { DropActorSheetData };
