import { id as MODULE_ID } from "@static/module.json";
import { Listener } from "./index.ts";
import { Settings } from "../settings.ts";
import { log } from "../logger.ts";
import { EFFECTS_MAP } from "../effects/mapping.ts";
import { findEffectsItem } from "../helpers.ts";

const CreateEffects: Listener = {
    listen(): void {
        Hooks.on(`${MODULE_ID}.createEffects`, async () => {
            if (!game.user.isGM) return; // Only allow connected GMs to do this

            const settings = new Settings();
            const effectsItem = findEffectsItem();

            if (!effectsItem) {
                log("Cannot find effects item");
                return;
            }

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

                // Determine what to run
                const versionsToRun = allVersions.splice(lastEffectRan);

                if (lastEffectRan === 0) {
                    ui.notifications.info(
                        `Initializing Convenient Effects for ${systemId}`,
                    );
                }

                for (const version of versionsToRun) {
                    log(`Running version ${version} migration for ${systemId}`);
                    const effectsForVersion = effectsForSystem[version];

                    // Create all the effects for this migration
                    await effectsItem.createEmbeddedDocuments(
                        "ActiveEffect",
                        effectsForVersion,
                    );

                    // Save each successful migration so that if something fails
                    // before the end, it picks up at the right spot
                    await settings.setEffectsVersion(version);
                }
            } catch (e: any) {
                log(`Something went wrong while initializing effects: ${e}`);
            }
        });
    },
};

export { CreateEffects };
