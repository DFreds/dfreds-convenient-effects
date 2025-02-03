export {};

declare global {
    export class UiExtender {
        registerSceneControl(input: SceneControlInput): void;
        registerHudButton(input: HudButtonInput): void;
    }

    export interface SceneControlInput {
        /**
         * The ID of the module registering
         */
        moduleId: string;

        /**
         * The name of the token layer
         */
        name:
            | "token"
            | "measure"
            | "tiles"
            | "drawings"
            | "walls"
            | "lighting"
            | "sounds"
            | "regions"
            | "notes";

        /**
         * The position to put the button. If no number is given, it will append it to the end
         */
        position?: number;

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
        tool: SceneControlTool;
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
         * @param button The div containing the button
         * @param data The data for the item with the HUD
         */
        onClick?: (
            event: JQuery.ClickEvent,
            button: JQuery<HTMLDivElement>,
            data: any,
        ) => void;

        /**
         * The right-click handler
         *
         * @param event The context menu event
         * @param button The div containing the button
         * @param data The data for the item with the HUD
         */
        onRightClick?: (
            event: JQuery.ContextMenuEvent,
            button: JQuery<HTMLDivElement>,
            data: any,
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

    declare interface SceneControlTool {
        name: string;
        title: string;
        icon: string;
        visible: boolean;
        toggle?: boolean;
        active?: boolean;
        button?: boolean;
        onClick?: () => void;
        /** Configuration for rendering the tool's toolclip. */
        toolclip?: ToolclipConfiguration;
    }

    declare interface ToolclipConfiguration {
        /** The filename of the toolclip video. */
        src: string;
        /** The heading string. */
        heading: string;
        /** The items in the toolclip body. */
        items: ToolclipConfigurationItem[];
    }

    declare interface ToolclipConfigurationItem {
        /** A plain paragraph of content for this item. */
        paragraph?: string;
        /** A heading for the item. */
        heading?: string;
        /** Content for the item. */
        content?: string;
        /** If the item is a single key reference, use this instead of content. */
        reference?: string;
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
}
