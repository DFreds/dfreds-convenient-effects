import fs from "fs";
import path from "path";

/** Module root directory (assumes scripts are run from the module's package root). */
export const moduleRoot = process.cwd();

/** JSON source root: `src/packs`. */
export const srcPacksRoot = path.join(moduleRoot, "src", "packs");

/** Bundled/distributable LevelDB root: `static/packs`. */
export const staticPacksRoot = path.join(moduleRoot, "static", "packs");

/** Immediate subdirectories of `dir` (absolute paths); empty if `dir` is missing. */
export function listImmediateSubdirs(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => path.join(dir, e.name));
}

/** True if `dir` contains at least one `.json` file, searched recursively. */
export function directoryContainsJson(dir: string): boolean {
    if (!fs.existsSync(dir)) return false;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".json") {
            return true;
        }
        if (entry.isDirectory() && directoryContainsJson(full)) return true;
    }
    return false;
}
