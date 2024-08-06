import { ConvenientEffectsApp } from "../app/convenient-effects-app.ts";

/**
 * Re-renders the Convenient Effects application if it's open
 */
function renderAppIfOpen(): void {
    const openApps = Object.values(ui.windows);
    const ceApp = openApps.find((app) => app instanceof ConvenientEffectsApp);

    if (ceApp) {
        ceApp.render();
    }
}

export { renderAppIfOpen };
