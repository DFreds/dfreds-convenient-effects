export {};

declare global {
    enum WRAPPER_TYPES {
        "WRAPPER" = 1,
        "MIXED" = 2,
        "OVERRIDE" = 3,
    }

    enum PERF_MODES {
        "NORMAL" = 1,
        "AUTO" = 2,
        "FAST" = 3,
    }

    export interface LibWrapper {
        // Properties
        /**
         * Get libWrapper version
         * @returns {string}  libWrapper version in string form, i.e. "<MAJOR>.<MINOR>.<PATCH>.<SUFFIX><META>"
         */
        get version(): string;

        /**
         * Get libWrapper version
         * @returns {[number,number,number,number,string]}  libWrapper version in array form, i.e. [<MAJOR>, <MINOR>, <PATCH>, <SUFFIX>, <META>]
         */
        get versions(): [number, number, number, number, string];

        /**
         * Get the Git version identifier.
         * @returns {string}  Git version identifier, usually 'HEAD' or the commit hash.
         */
        get git_version(): string;

        /**
         * @returns {boolean}  The real libWrapper module will always return false. Fallback implementations (e.g. poly-fill / shim) should return true.
         */
        get is_fallback(): boolean;

        // Errors
        get LibWrapperError(): Error;

        get Error(): Error;

        get LibWrapperInternalError(): Error;

        get InternalError(): Error;

        get LibWrapperPackageError(): Error;

        get PackageError(): Error;

        get LibWrapperAlreadyOverriddenError(): Error;

        get AlreadyOverriddenError(): Error;

        get LibWrapperInvalidWrapperChainError(): Error;

        get InvalidWrapperChainError(): Error;

        // Enums - First introduced in v1.9.0.0
        get WRAPPER(): WRAPPER_TYPES.WRAPPER;

        get MIXED(): WRAPPER_TYPES.MIXED;

        get OVERRIDE(): WRAPPER_TYPES.OVERRIDE;

        get PERF_NORMAL(): PERF_MODES.NORMAL;

        get PERF_AUTO(): PERF_MODES.AUTO;

        get PERF_FAST(): PERF_MODES.FAST;

        // Methods
        /**
         * Test for a minimum libWrapper version.
         * First introduced in v1.4.0.0.
         *
         * @param {number} major   Minimum major version
         * @param minor
         * @param patch
         * @param suffix
         * @returns {boolean}      Returns true if the libWrapper version is at least the queried version, otherwise false.
         */
        version_at_least(
            major: number,
            minor?: number,
            patch?: number,
            suffix?: number,
        ): boolean;

        /**
         * Register a new wrapper.
         * Important: If called before the 'init' hook, this method will fail.
         *
         * In addition to wrapping class methods, there is also support for wrapping methods on specific object instances, as well as class methods inherited from parent classes.
         * However, it is recommended to wrap methods directly in the class that defines them whenever possible, as inheritance/instance wrapping is less thoroughly tested and will incur a performance penalty.
         *
         * Triggers FVTT hook 'libWrapper.Register' when successful.
         *
         * Returns a unique numeric target identifier, which can be used as a replacement for 'target' in future calls to 'libWrapper.register' and 'libWrapper.unregister'.
         *
         * @param {string} package_id  The package identifier, i.e. the 'id' field in your module/system/world's manifest.
         *
         * @param {number|string} target The target identifier, specifying which wrapper should be registered.
         *
         *   This can be either:
         *     1. A unique target identifier obtained from a previous 'libWrapper.register' call.
         *     2. A string containing the path to the function you wish to add the wrapper to, starting at global scope, for example 'SightLayer.prototype.updateToken'.
         *
         *   Support for the unique target identifiers (option #1) was added in v1.11.0.0, with previous versions only supporting option #2.
         *
         *   Since v1.8.0.0, the string path (option #2) can contain string array indexing.
         *   For example, 'CONFIG.Actor.sheetClasses.character["dnd5e.ActorSheet5eCharacter"].cls.prototype._onLongRest' is a valid path.
         *   It is important to note that indexing in libWrapper does not work exactly like in JavaScript:
         *     - The index must be a single string, quoted using the ' or " characters. It does not support e.g. numbers or objects.
         *     - A backslash \ can be used to escape another character so that it loses its special meaning, e.g. quotes i.e. ' and " as well as the character \ itself.
         *
         *   By default, libWrapper searches for normal methods or property getters only. To wrap a property's setter, append '#set' to the name, for example 'SightLayer.prototype.blurDistance#set'.
         *
         * @param {function} fn        Wrapper function. The first argument will be the next function in the chain, except for 'OVERRIDE' wrappers.
         *                             The remaining arguments will correspond to the parameters passed to the wrapped method.
         *
         * @param type
         * @param options
         *
         *   The possible types are:
         *
         *   'WRAPPER' / libWrapper.WRAPPER:
         *     Use if your wrapper will *always* continue the chain.
         *     This type has priority over every other type. It should be used whenever possible as it massively reduces the likelihood of conflicts.
         *     Note that the library will auto-detect if you use this type but do not call the original function, and automatically unregister your wrapper.
         *
         *   'MIXED' / libWrapper.MIXED:
         *     Default type. Your wrapper will be allowed to decide whether it continue the chain or not.
         *     These will always come after 'WRAPPER'-type wrappers. Order is not guaranteed, but conflicts will be auto-detected.
         *
         *   'OVERRIDE' / libWrapper.OVERRIDE:
         *     Use if your wrapper will *never* continue the chain. This type has the lowest priority, and will always be called last.
         *     If another package already has an 'OVERRIDE' wrapper registered to the same method, using this type will throw a <libWrapper.ERRORS.package> exception.
         *     Catching this exception should allow you to fail gracefully, and for example warn the user of the conflict.
         *     Note that if the GM has explicitly given your package priority over the existing one, no exception will be thrown and your wrapper will take over.
         *
         *
         *   This parameter must be 'true' when registering non-OVERRIDE wrappers.
         *   Default is 'false' if type=='OVERRIDE', otherwise 'true'.
         *   First introduced in v1.3.6.0.
         *
         *   It will be used if all other wrappers registered on the same target also prefer the same mode, otherwise the default will be used instead.
         *   This option should only be specified with good reason. In most cases, using 'AUTO' in order to allow the GM to choose is the best option.
         *   First introduced in v1.5.0.0.
         *
         *   The possible modes are:
         *
         *   'NORMAL' / libWrapper.PERF_NORMAL:
         *     Enables all conflict detection capabilities provided by libWrapper. Slower than 'FAST'.
         *     Useful if wrapping a method commonly modified by other packages, to ensure most issues are detected.
         *     In most other cases, this mode is not recommended and 'AUTO' should be used instead.
         *
         *   'FAST' / libWrapper.PERF_FAST:
         *     Disables some conflict detection capabilities provided by libWrapper, in exchange for performance. Faster than 'NORMAL'.
         *     Will guarantee wrapper call order and per-package prioritization, but fewer conflicts will be detectable.
         *     This performance mode will result in comparable performance to traditional non-libWrapper wrapping methods.
         *     Useful if wrapping a method called repeatedly in a tight loop, for example 'WallsLayer.testWall'.
         *     In most other cases, this mode is not recommended and 'AUTO' should be used instead.
         *
         *   'AUTO' / libWrapper.PERF_AUTO:
         *     Default performance mode. If unsure, choose this mode.
         *     Will allow the GM to choose which performance mode to use.
         *     Equivalent to 'FAST' when the libWrapper 'High-Performance Mode' setting is enabled by the GM, otherwise 'NORMAL'.
         *
         *
         *   This allows avoiding an extra function call, for instance:
         *     libWrapper.register(PACKAGE_ID, "foo", function(wrapped, ...args) { return someFunction.call(this, wrapped, "foo", "bar", ...args) });
         *   becomes
         *     libWrapper.register(PACKAGE_ID, "foo", someFunction, "WRAPPER", {bind: ["foo", "bar"]});
         *
         *   First introduced in v1.12.0.0.
         *
         * @returns {number} Unique numeric 'target' identifier which can be used in future 'libWrapper.register' and 'libWrapper.unregister' calls.
         *   Added in v1.11.0.0.
         */
        register(
            package_id: string,
            target: number | string,
            fn: Function,
            type?: string | WRAPPER_TYPES,
            options?: {
                chain?: boolean;
                perf_mode?: string | PERF_MODES;
                bind?: any[];
            },
        ): number;

        /**
         * Unregister an existing wrapper.
         *
         * Triggers FVTT hook 'libWrapper.Unregister' when successful.
         *
         * @param {string} package_id     The package identifier, i.e. the 'id' field in your module/system/world's manifest.
         *
         * @param {number|string} target  The target identifier, specifying which wrapper should be unregistered.
         *
         *   This can be either:
         *     1. A unique target identifier obtained from a previous 'libWrapper.register' call. This is the recommended option.
         *     2. A string containing the path to the function you wish to remove the wrapper from, starting at global scope, with the same syntax as the 'target' parameter to 'libWrapper.register'.
         *
         *   Support for the unique target identifiers (option #1) was added in v1.11.0.0, with previous versions only supporting option #2.
         *   It is recommended to use option #1 if possible, in order to guard against the case where the class or object at the given path is no longer the same as when `libWrapper.register' was called.
         *
         * @param fail         If true, this method will throw an exception if it fails to find the method to unwrap. Default is 'true'.
         */
        unregister(
            package_id: string,
            target: number | string,
            fail?: boolean,
        ): void;

        /**
         * Unregister all wrappers created by a given package.
         *
         * Triggers FVTT hook 'libWrapper.UnregisterAll' when successful.
         *
         * @param {string} package_id  The package identifier, i.e. the 'id' field in your module/system/world's manifest.
         */
        unregister_all(package_id: string): void;

        /**
         * Ignore conflicts matching specific filters when detected, instead of warning the user.
         *
         * This can be used when there are conflict warnings that are known not to cause any issues, but are unable to be resolved.
         * Conflicts will be ignored if they involve both 'package_id' and one of 'ignore_ids', and relate to one of 'targets'.
         *
         * Note that the user can still see which detected conflicts were ignored, by toggling "Show ignored conflicts" in the "Conflicts" tab in the libWrapper settings.
         *
         * First introduced in v1.7.0.0.
         *
         * @param {string}            package_id  The package identifier, i.e. the 'id' field in your module/system/world's manifest. This will be the package that owns this ignore entry.
         *
         * @param {(string|string[])} ignore_ids  Other package ID(s) with which conflicts should be ignored.
         *
         * @param {(string|string[])} targets     Target(s) for which conflicts should be ignored, corresponding to the 'target' parameter to 'libWrapper.register'.
         *   This method does not accept the unique target identifiers returned by 'libWrapper.register'.
         *
         * @param {Object} options dditional options to libWrapper.
         *
         * @param {boolean} options.ignore_errors   If 'true', will also ignore confirmed conflicts (i.e. errors), rather than only potential conflicts (i.e. warnings).
         *   Be careful when setting this to 'true', as confirmed conflicts are almost certainly something the user should be made aware of.
         *   Defaults to 'false'.
         */
        ignore_conflicts(
            package_id: string,
            ignore_ids: string | string[],
            targets: string | string[],
            options?: { ignore_errors?: boolean },
        ): void;
    }
}
