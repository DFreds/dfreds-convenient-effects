export {};

declare global {
    interface Window {
        migrations: Migrations;
    }

    /**
     * The Migrations class
     */
    export interface Migrations {
        /**
         * Register a module to the migrations system
         * @param moduleId The ID of the module registering the migrations
         */
        register({moduleId}: {moduleId: string}): void;

        /**
         * Add a migration to the migrations list
         * @param moduleId The ID of the module registering the migration
         * @param migration The migration to register
         */
        addMigration({moduleId, migration}: {moduleId: string, migration: MigrationType}): void;

        /**
         * Add multiple migrations to the migrations list
         * @param moduleId The ID of the module registering the migration
         * @param migrations The migrations to register
         */
        addMigrations({moduleId, migrations}: {moduleId: string, migrations: MigrationType[]}): void;

        /**
         * Check if a migration has been run
         * @param moduleId The ID of the module registering the migration
         * @param key The key of the migration
         * @returns true if the migration has been run, false otherwise
         */
        hasRan({moduleId, key}: {moduleId: string, key: string}): boolean;

        /**
         * Run the migrations
         * @param moduleId The ID of the module registering the migrations
         * @returns true if all the migrations were successfully run, false otherwise
         */
        runAll({moduleId}: {moduleId: string}): Promise<boolean>;

        /**
         * Clear all ran migrations
         * @param moduleId The ID of the module registering the migrations
         */
        clearAllRan({moduleId}: {moduleId: string}): Promise<void>;

        /**
         * Get the ran migrations
         * @param moduleId The ID of the module registering the migrations
         * @returns the ran migrations
         */
        getRanMigrations({moduleId}: {moduleId: string}): string[];
    }

    export interface MigrationType {
        /**
         * The identifier for the migration. Successfully run migrations are saved
         * using this key
         */
        key: string;

        /**
         * The date of the migration. Migrations run from oldest to newest in order
         */
        date: Date;

        /**
         * The migration function. It should return true if the migration was
         * successful, false otherwise. If it returns false, the migration will
         * not be added to the list of migrations that ran.
         */
        func: () => Promise<boolean>;
    }

    namespace Hooks {
        type HookParamsMigrationsInit = HookParameters<
            "migrations.init",
            Migrations
        >;
        type HookParamsMigrationsSetup = HookParameters<
            "migrations.setup",
            Migrations
        >;
        type HookParamsMigrationsRun = HookParameters<
            "migrations.run",
            MigrationType,
            boolean
        >;
        /**
         * Register a callback handler which should be triggered when a hook is triggered.
         *
         * @param hook The unique name of the hooked event
         * @param fn   The callback function which should be triggered when the hook event occurs
         */
        function on(...args: HookParamsMigrationsInit): number;
        function on(...args: HookParamsMigrationsSetup): number;
        function on(...args: HookParamsMigrationsRun): number;
        /**
         * Register a callback handler for an event which is only triggered once the first time the event occurs.
         * After a "once" hook is triggered the hook is automatically removed.
         *
         * @param hook  The unique name of the hooked event
         * @param fn    The callback function which should be triggered when the hook event occurs
         */
        function once(...args: HookParamsMigrationsInit): number;
        function once(...args: HookParamsMigrationsSetup): number;
        function once(...args: HookParamsMigrationsRun): number;
    }

    const migrations: Migrations;
}
