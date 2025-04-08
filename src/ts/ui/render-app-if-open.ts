import { ConvenientEffectsV2 } from "./ce-app/convenient-effects-v2.ts";

/**
 * Re-renders the Convenient Effects application if it's open
 */
function renderAppIfOpen(): void {
    const applications = foundry.applications.instances;

    // @ts-expect-error The types provided by pf2e think this is a number
    const convenientEffectsV2 = applications.get("convenient-effects-v2");

    if (convenientEffectsV2) {
        (convenientEffectsV2 as ConvenientEffectsV2).render();
    }
}

export { renderAppIfOpen };
