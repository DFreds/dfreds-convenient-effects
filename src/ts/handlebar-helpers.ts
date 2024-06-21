class HandlebarHelpers {
    constructor() {}

    registerHelpers(): void {
        this.#registerDummyHandlebar();
    }

    #registerDummyHandlebar() {
        Handlebars.registerHelper("dummyHandlebar", () => {
            return true;
        });
    }
}

export { HandlebarHelpers };
