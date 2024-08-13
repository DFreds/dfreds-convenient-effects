import "@typed-foundry/foundry";

declare global {
    namespace globalThis {
        const socketlib: Socketlib;
    }

    export class Socketlib {
        modules: Map<string, SocketlibSocket>;
        system: System;
        errors: {
            SocketlibError?: Error;
            SocketlibNoGMConnectedError?: Error;
            SocketlibInternalError?: Error;
            SocketlibUnregisteredHandlerError?: Error;
            SocketlibInvalidUserError?: Error;
            SocketlibRemoteException?: Error;
        };

        registerModule(moduleName: string): SocketlibSocket;

        registerSystem(systemId: string): SocketlibSocket;
    }

    namespace Hooks {
        type HookParamsSocketlibReady = HookParameters<
            "socketlib.ready",
            never
        >;
        /**
         * Register a callback handler which should be triggered when a hook is triggered.
         *
         * @param hook The unique name of the hooked event
         * @param fn   The callback function which should be triggered when the hook event occurs
         */
        function on(...args: HookParamsSocketlibReady): number;

        /**
         * Register a callback handler for an event which is only triggered once the first time the event occurs.
         * After a "once" hook is triggered the hook is automatically removed.
         *
         * @param hook  The unique name of the hooked event
         * @param fn    The callback function which should be triggered when the hook event occurs
         */
        function once(...args: HookParamsSocketlibReady): number;
    }

    export class SocketlibSocket {
        functions: Map<string, Function>;
        socketName: string;
        pendingRequests: Map<
            string,
            {
                handlerName: string;
                resolve: (value: unknown) => void;
                reject: (value: unknown) => void;
                recipient: string;
            }
        >;

        register(name: string, func: Function): void;

        executeAsGM(
            handler: string | Function,
            ...args: any[]
        ): Promise<unknown>;

        executeAsUser(
            handler: string | Function,
            userId: string,
            ...args: any[]
        ): Promise<unknown>;

        executeForAllGMs(
            handler: string | Function,
            ...args: any[]
        ): Promise<unknown>;

        executeForOtherGMs(
            handler: string | Function,
            ...args: any[]
        ): Promise<unknown>;

        executeForEveryone(
            handler: string | Function,
            ...args: any[]
        ): Promise<unknown>;

        executeForOthers(
            handler: string | Function,
            ...args: any[]
        ): Promise<unknown>;

        executeForUsers(
            handler: string | Function,
            recipients: string[],
            ...args: any[]
        ): Promise<unknown>;
    }

    export enum RECIPIENT_TYPES {
        ONE_GM = 0,
        ALL_GMS = 1,
        EVERYONE = 2,
    }

    export enum MESSAGE_TYPES {
        COMMAND = 0,
        REQUEST = 1,
        RESPONSE = 2,
        RESULT = 3,
        EXCEPTION = 4,
        UNREGISTERED = 5,
    }
}
