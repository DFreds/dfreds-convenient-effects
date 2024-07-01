class ConvenientEffectsApp extends Application {
    #rootView: JQuery<HTMLElement>;

    constructor() {
        super();
        this.#rootView = $("<div>"); // Init it to something for now
    }

    static override get defaultOptions(): ApplicationOptions {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 300,
            height: 600,
            top: 75,
            left: 125,
            popOut: true,
            minimizable: true,
            resizable: true,
            id: "convenient-effects",
            classes: ["sidebar-popout"],
            scrollY: ["ol.directory-list"],
            dragDrop: [
                {
                    dragSelector: ".convenient-effect",
                },
            ],
            filters: [
                {
                    inputSelector: 'input[name="search"]',
                    contentSelector: ".directory-list",
                },
            ],
            title: "Convenient Effects",
            template:
                "modules/dfreds-convenient-effects/templates/convenient-effects-app.hbs",
        });
    }

    override getData(
        options?: Partial<ApplicationOptions> | undefined,
    ): object | Promise<object> {
        return []; // TODO
    }

    override activateListeners(html: JQuery<HTMLElement>): void {
        this.#rootView = html;
    }

    protected override _onSearchFilter(
        event: KeyboardEvent,
        query: string,
        rgx: RegExp,
        html: HTMLElement | null,
    ): void {
        // TODO
    }

    protected override _onDragStart(event: DragEvent): void {
        // TODO
    }

    protected override _canDragStart(selector: string): boolean {
        return true; // TODO
    }
}

export { ConvenientEffectsApp };
