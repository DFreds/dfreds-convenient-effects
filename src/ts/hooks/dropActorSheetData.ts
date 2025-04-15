import { Listener } from "./index.ts";

const DropActorSheetData: Listener = {
    listen(): void {
        Hooks.on(
            "dropActorSheetData",
            (actor: any, _actorSheet: any, data: any) => {
                if (!data.effectId) return; // let regular drag and drop handle it

                const actorData = actor as Actor<any>;

                game.dfreds?.effectInterface?.addEffect({
                    effectId: data.effectId,
                    uuid: actorData.uuid,
                });
            },
        );
    },
};

export { DropActorSheetData };
