import { Listener } from "./index.ts";

const HotReload: Listener = {
    listen(): void {
        if (!import.meta.hot) return;

        import.meta.hot.on("lang-update", ({ path }: { path: string }) => {
            whenReady(async () => {
                const lang = await foundry.utils.fetchJsonWithTimeout(path);
                if (foundry.utils.getType(lang) !== "Object") {
                    ui.notifications.error(`Failed to load ${path}`);
                    return;
                }
                foundry.utils.mergeObject(game.i18n.translations, lang as object);
                rerenderApps();
            });
        });

        import.meta.hot.on("template-update", ({ path }: { path: string }) => {
            whenReady(async () => {
                delete Handlebars.partials[path];
                await foundry.applications.handlebars.getTemplate(path);
                rerenderApps();
            });
        });
    },
};

function whenReady(fn: () => Promise<void>): void {
    if (game.ready) {
        fn();
    } else {
        Hooks.once("ready", fn);
    }
}

function rerenderApps(): void {
    for (const app of [...Object.values(ui.windows), ...foundry.applications.instances.values()]) {
        app.render();
    }
}

export { HotReload };
