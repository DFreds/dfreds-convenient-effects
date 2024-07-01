import { id as MODULE_ID } from "@static/module.json";
import { Listener } from "./index.ts";
import { Settings } from "../settings.ts";
import { log } from "../logger.ts";
import { EFFECTS_MAP } from "../effects/mapping.ts";

const CreateEffects: Listener = {
    listen(): void {
        Hooks.on(`${MODULE_ID}.createEffects`, async () => {
            const settings = new Settings();
            const effectsItemId = settings.effectsItemId;
            if (!effectsItemId) {
                log("Cannot find settings item ID");
                return;
            }

            if (!game.user.isGM) return; // Only allow GMs to do this

            const systemId = game.system.id;
            const effectsForSystem = EFFECTS_MAP[systemId];

            if (!effectsForSystem) {
                log(`No predefined effects available for system ${systemId}`);
                return;
            }

            try {
                const lastEffectRan = settings.effectsVersion;
                const allVersions = Object.keys(effectsForSystem)
                    .map((versionKey) => parseInt(versionKey))
                    .sort();

                if (lastEffectRan === -1) {
                    ui.notifications.info(
                        `Initializing Convenient Effects for ${systemId}`,
                    );
                    for (const version of allVersions) {
                        const effectsForVersion = effectsForSystem[version];

                        for (const effect of effectsForVersion) {
                            // TODO create all the effects on the effect item
                        }
                    }
                } else {
                    // Determine what to run
                    const indexOfLastVersion = allVersions.findIndex(
                        (version) => version === lastEffectRan,
                    );
                }

                await settings.setEffectsVersion(
                    allVersions[allVersions.length - 1],
                );
            } catch (e: any) {
                log(`Something went wrong while initializing effects: ${e}`);
            }
        });
    },
};

export { CreateEffects };
