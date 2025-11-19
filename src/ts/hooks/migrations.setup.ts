import { MODULE_ID } from "../constants.ts";
import { Listener } from "./index.ts";

const MigrationsSetup: Listener = {
    listen(): void {
        Hooks.once("migrations.setup", (migrations: any) => {
            const migrationsTyped = migrations as Migrations;
            migrationsTyped.register({ moduleId: MODULE_ID });
        });
    },
};

export { MigrationsSetup };
