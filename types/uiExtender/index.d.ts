import { ApplicationV2 } from "types/foundry/client-esm/applications/_types.js";

export { };

declare global {
    interface Window {
        uiExtender: UiExtender;
    }

    /**
     * The UiExtender class
     */
    export interface UiExtender {
        /**
         * Register a scene control
         * @param input The scene control input
         */
        registerSceneControl(input: SceneControlInput): void;

        /**
         * Register a HUD button
         * @param input The HUD button input
         */
        registerHudButton(input: HudButtonInput): void;

        /**
         * Register a directory
         * @param input The directory input
         */
        registerDirectory(input: DirectoryInput): void;
    }

    export interface SceneControlInput {
        /**
         * The ID of the module registering
         */
        moduleId: string;

        /**
         * The name of the control layer
         */
        name:
        | "tokens"
        | "tiles"
        | "drawings"
        | "walls"
        | "lighting"
        | "sounds"
        | "regions"
        | "notes";

        /**
         * The predicate to determine if the control should be visible
         *
         * @param data The data for the controls
         * @returns true if the control should be added, false otherwise
         */
        predicate?: (data: any) => boolean;

        /**
         * The tool data
         */
        tool: SceneControlToolInput;
    }

    export interface SceneControlToolInput {
        /* An identifier for the tool, unique among the tools of its SceneControl. This should be camelCase for maximum compatibility. */
        name: string;
        /** An integer indicating the tool's order, with 0 being at the top. If not provided, the tool will be added to the end of the list. */
        order?: number;
        /** A title for the tool: can be a localization path */
        title: string;
        /** One or more icon classes for the tool, typically Font Awesome classes such as "fa-solid fa-face-smile" */
        icon: string;
        /** Whether the tool should be visible to the current User */
        visible?: boolean;
        /** Is the tool an on-or-off toggle? */
        toggle?: boolean;
        /** Is the tool the currently the active one? Not applicable to toggles or buttons. */
        active?: boolean;
        /** Is the tool a "button" in the sense of immediately resolving on click without becoming the active tool? */
        button?: boolean;
        /** Does this tool allow interaction with placeables? */
        interaction?: boolean;
        /** Does this tool allow placeables to be controlled? */
        control?: boolean;
        /** Does this tool create placeables? */
        creation?: boolean;
        /** Default creation data */
        createData?: object;
        /** The data of the shape this tool creates */
        shapeData?: object;
        /** A callback invoked when the tool is activated or deactivated */
        onChange?: (event?: Event, active?: boolean) => void;
        /** A configuration for a toolclip video */
        toolclip?: ToolclipConfigurationInput;
    }

    export interface ToolclipConfigurationInput {
        /** The filename of the toolclip video. */
        src: string;
        /** The heading string. */
        heading: string;
        /** The items in the toolclip body. */
        items: ToolclipConfigurationItemInput[];
    }

    export interface ToolclipConfigurationItemInput {
        /** A plain paragraph of content for this item. */
        paragraph?: string;
        /** A heading for the item. */
        heading?: string;
        /** Content for the item. */
        content?: string;
        /** If the item is a single key reference, use this instead of content. */
        reference?: string;
    }

    export interface HudButtonInput {
        /**
         * The ID of the module registering
         */
        moduleId: string;

        /**
         * The type of HUD to use
         */
        hudType: "token" | "tile" | "drawing";

        /**
         * The tooltip when hovering on the HUD button
         */
        tooltip: string;

        /**
         * The name of action when clicking the button
         */
        action?: string;

        /**
         * Additional attributes to add to the button
         */
        attributes?: Record<string, string>;

        /**
         * The HTML that will be used in the button
         */
        icon: string;

        /**
         * The location of the button
         */
        location: "div.left" | "div.right";

        /**
         * The predicate to determine if the button should be added
         *
         * @param data The data for the item with the HUD
         * @returns true if the button should be added, false otherwise
         */
        predicate?: (data: any) => boolean;

        /**
         * The click handler
         *
         * @param event The click event
         * @param button The button element
         * @param data The data for the item with the HUD
         * @param hud The base placeable HUD instance
         */
        onClick?: (
            event: JQuery.ClickEvent,
            button: JQuery,
            data: any,
            hud: BasePlaceableHUD<any>,
        ) => void;

        /**
         * The right-click handler
         *
         * @param event The context menu event
         * @param button The button element
         * @param data The data for the item with the HUD
         * @param hud The base placeable HUD instance
         */
        onRightClick?: (
            event: JQuery.ContextMenuEvent,
            button: JQuery,
            data: any,
            hud: BasePlaceableHUD<any>,
        ) => void;

        /**
         * The render complete handler
         *
         * @param hud The base placeable HUD instance
         * @param html The html for the HUD
         * @param data The data for the HUD
         */
        onRenderComplete?: (
            hud: BasePlaceableHUD<any>,
            html: JQuery,
            data: object,
        ) => void;
    }

    export interface DirectoryInput {
        /**
         * The ID of the module registering
         */
        moduleId: string;

        /**
         * The ID of the directory
         */
        id: string;

        /**
         * The directory's tooltip
         */
        tooltip?: string;

        /**
         * The directory's Font Awesome icon class
         */
        icon?: string;

        /**
         * The document name. If provided, it will take precedence over the icon
         * and tooltip. Otherwise, the document name will be used to find the
         * pre-configured sidebar icon and tooltip that it expects to exist on
         * CONFIG[documentName].
         */
        documentName?: string;

        /**
         * The order of the directory. If not provided, the directory will be
         * added to the end of the sidebar.
         */
        order?: number;

        /**
         * Whether the directory is only rendered for GM users
         */
        gmOnly?: boolean;

        /**
         * The application of the directory
         */
        applicationClass: new (...args: any[]) => AbstractSidebarTab;

        /**
         * The predicate to determine if the directory should be added
         *
         * @returns true if the directory should be added, false otherwise
         */
        predicate?: () => boolean;
    }

    namespace Hooks {
        type HookParamsUiExtenderInit = HookParameters<
            "uiExtender.init",
            UiExtender
        >;
        type HookParamsUiExtenderSetup = HookParameters<
            "uiExtender.setup",
            UiExtender
        >;

        /**
         * Register a callback handler which should be triggered when a hook is triggered.
         *
         * @param hook The unique name of the hooked event
         * @param fn   The callback function which should be triggered when the hook event occurs
         */
        function on(...args: HookParamsUiExtenderInit): number;
        function on(...args: HookParamsUiExtenderSetup): number;

        /**
         * Register a callback handler for an event which is only triggered once the first time the event occurs.
         * After a "once" hook is triggered the hook is automatically removed.
         *
         * @param hook  The unique name of the hooked event
         * @param fn    The callback function which should be triggered when the hook event occurs
         */
        function once(...args: HookParamsUiExtenderInit): number;
        function once(...args: HookParamsUiExtenderSetup): number;
    }

    let uiExtender: UiExtender;
}
