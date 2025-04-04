// import { ConvenientEffectsApp } from "../convenient-effects-app.ts";
// import { BackupConvenientEffectsController } from "./backup-convenient-effects-controller.ts";

// class BackupConvenientEffectsApp extends Application {
//     #controller: BackupConvenientEffectsController;
//     #rootView: JQuery<HTMLElement>;

//     constructor() {
//         super();
//         this.#controller = new BackupConvenientEffectsController({
//             viewMvc: this,
//         });
//         this.#rootView = $("<div>"); // Init it to something for now
//     }

//     static get #width(): number {
//         const openApps = Object.values(ui.windows);
//         const ceApp = openApps.find(
//             (app) => app instanceof ConvenientEffectsApp,
//         );

//         const ceWidth = ceApp?.position?.width ?? 300;

//         return ceWidth;
//     }

//     static get #height(): string | number {
//         const openApps = Object.values(ui.windows);
//         const ceApp = openApps.find(
//             (app) => app instanceof ConvenientEffectsApp,
//         );

//         const ceHeight = ceApp?.position?.height ?? 600;

//         return ceHeight;
//     }

//     static get #fromTop(): number {
//         const openApps = Object.values(ui.windows);
//         const ceApp = openApps.find(
//             (app) => app instanceof ConvenientEffectsApp,
//         );

//         const ceTop = ceApp?.position?.top ?? 75;

//         return ceTop;
//     }

//     static get #fromLeft(): number {
//         const openApps = Object.values(ui.windows);
//         const ceApp = openApps.find(
//             (app) => app instanceof ConvenientEffectsApp,
//         );

//         const ceLeft = ceApp?.position?.left ?? 125;
//         const ceWidth = this.#width;
//         const padding = 16;

//         return ceLeft + ceWidth + padding;
//     }

//     static override get defaultOptions(): ApplicationOptions {
//         return foundry.utils.mergeObject(super.defaultOptions, {
//             width: this.#width,
//             height: this.#height,
//             top: this.#fromTop,
//             left: this.#fromLeft,
//             popOut: true,
//             minimizable: true,
//             resizable: true,
//             id: "backup-convenient-effects",
//             classes: ["sidebar-popout"],
//             scrollY: ["ol.directory-list"],
//             dragDrop: [
//                 {
//                     dragSelector: ".convenient-effect",
//                     dropSelector: ".convenient-folder",
//                 },
//             ],
//             filters: [
//                 {
//                     inputSelector: 'input[name="search"]',
//                     contentSelector: ".directory-list",
//                 },
//             ],
//             title: "ConvenientEffects.BackupAppName",
//             template:
//                 "modules/dfreds-convenient-effects/templates/backup-convenient-effects-app.hbs",
//         });
//     }

//     override getData(_options?: Partial<ApplicationOptions>): object {
//         return this.#controller.getData();
//     }

//     override activateListeners(html: JQuery): void {
//         this.#rootView = html;

//         this.#initClickListeners();
//         this.#initContextMenus();

//         const dh = this.#onDragHighlight.bind(this);

//         // @ts-expect-error Not recognizing handler for some reason
//         html.find(".folder").on("dragenter", dh).on("dragleave", dh);
//     }

//     // NOTE: taken from foundry.js DirectoryApplicationMixin
//     #onDragHighlight(event: DragEvent) {
//         const li = event.currentTarget as any;
//         if (!li.classList.contains("folder")) return;
//         event.stopPropagation(); // Don't bubble to parent folders

//         // Remove existing drop targets
//         if (event.type === "dragenter") {
//             for (const t of li
//                 .closest(".directory-list")
//                 .querySelectorAll(".droptarget")) {
//                 t.classList.remove("droptarget");
//             }
//         }

//         // Remove current drop target
//         if (event.type === "dragleave") {
//             const el = document.elementFromPoint(
//                 event.clientX,
//                 event.clientY,
//             ) as any;
//             const parent = el.closest(".folder");
//             if (parent === li) return;
//         }

//         // Add new drop target
//         li.classList.toggle("droptarget", event.type === "dragenter");
//     }

//     protected override async _onSearchFilter(
//         event: KeyboardEvent,
//         query: string,
//         rgx: RegExp,
//         html: HTMLElement | null,
//     ): Promise<void> {
//         return this.#controller.onSearchTextChange(event, query, rgx, html);
//     }

//     protected override _onDragStart(event: DragEvent): void {
//         this.#controller.onEffectDragStart(event);
//     }

//     /**
//      * Checks if the folder is collapse
//      * @param folderId - the folder ID to check
//      * @returns true if the folder is collapsed, false otherwise
//      */
//     isFolderCollapsed(folderId: string): boolean {
//         return this.#findFolderById(folderId).hasClass("collapsed");
//     }

//     /**
//      * Collapses a folder by adding the 'collapsed' CSS class to it
//      *
//      * @param folderId - the folder ID to collapse
//      */
//     collapseFolder(folderId: string): void {
//         this.#findFolderById(folderId).addClass("collapsed");
//     }

//     /**
//      * Expands a folder by removing the 'collapsed' CSS class from it
//      *
//      * @param folderId - the folder ID to expand
//      */
//     expandFolder(folderId: string): void {
//         this.#findFolderById(folderId).removeClass("collapsed");
//     }

//     /**
//      * Collapse all folders by adding the 'collapsed' CSS class to them
//      */
//     collapseAllFolders(): void {
//         this.#allDirectories.addClass("collapsed");
//     }

//     #initClickListeners(): void {
//         this.#collapseAllButton.on(
//             "click",
//             this.#controller.onCollapseAll.bind(this.#controller),
//         );
//         this.#resetSystemEffects.on(
//             "click",
//             this.#controller.onResetSystemEffects.bind(this.#controller),
//         );
//         this.#folderHeaders.on(
//             "click",
//             this.#controller.onToggleFolder.bind(this.#controller),
//         );
//     }

//     #initContextMenus(): void {
//         ContextMenu.create(
//             this,
//             this.#rootView,
//             ".convenient-folder .folder-header",
//             [
//                 {
//                     name: "SIDEBAR.Export",
//                     icon: '<i class="fas fa-file-export fa-fw"></i>',
//                     condition: this.#controller.isUserGm.bind(this.#controller),
//                     callback: this.#controller.onExportFolder.bind(
//                         this.#controller,
//                     ),
//                 },
//             ],
//         );
//     }

//     #findFolderById(folderId: string): JQuery<HTMLElement> {
//         return this.#rootView.find(
//             `.convenient-folder[data-folder-id="${folderId}"]`,
//         );
//     }

//     get #allDirectories(): JQuery<HTMLElement> {
//         return this.#rootView.find(".convenient-folder");
//     }

//     get #collapseAllButton(): JQuery<HTMLElement> {
//         return this.#rootView.find(".collapse-all");
//     }

//     get #resetSystemEffects(): JQuery<HTMLElement> {
//         return this.#rootView.find(".reset-system-effects");
//     }

//     get #folderHeaders() {
//         return this.#rootView.find(".directory-list .folder-header");
//     }
// }

// export { BackupConvenientEffectsApp };
