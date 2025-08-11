import { ConvenientEffectsV2 } from "./ce-app/convenient-effects-v2.ts";

/**
 * Re-renders the Convenient Effects application if it's open
 */
function renderAppIfOpen(): void {
    const applications = foundry.applications.instances;

    const convenientEffectsV2 = applications.get(
        // @ts-expect-error The types provided by pf2e think this is a number
        ConvenientEffectsV2.tabName,
    ) as unknown as ConvenientEffectsV2;

    if (convenientEffectsV2 && convenientEffectsV2.active) {
        convenientEffectsV2.render();
    }
}

function renderApp(): void {
    const applications = foundry.applications.instances;

    const convenientEffectsV2 = applications.get(
        // @ts-expect-error The types provided by pf2e think this is a number
        ConvenientEffectsV2.tabName,
    ) as unknown as ConvenientEffectsV2;

    if (convenientEffectsV2) {
        convenientEffectsV2.render();
    }
}

export { renderAppIfOpen, renderApp };
