import fs from "fs";
import path from "path";

import { compilePack } from "@foundryvtt/foundryvtt-cli";

import {
    directoryContainsJson,
    listImmediateSubdirs,
    srcPacksRoot,
    staticPacksRoot,
} from "./util/packs.ts";

if (!fs.existsSync(srcPacksRoot)) {
    console.log(`No directory at ${srcPacksRoot}; nothing to compile.`);
    process.exit(0);
}

const sourceDirs = listImmediateSubdirs(srcPacksRoot).filter((d) =>
    directoryContainsJson(d),
);

if (sourceDirs.length === 0) {
    console.log(
        `No subfolders with JSON under ${srcPacksRoot}; nothing to compile.`,
    );
    process.exit(0);
}

fs.mkdirSync(staticPacksRoot, { recursive: true });

for (const src of sourceDirs) {
    const name = path.basename(src);
    const dest = path.join(staticPacksRoot, name);
    console.log(`compilePack\n  src:  ${src}\n  dest: ${dest}\n`);
    await compilePack(src, dest, {
        nedb: false,
        yaml: false,
        recursive: true,
        log: true,
    });
}

console.log(`Packed ${sourceDirs.length} compendium(s) into ${staticPacksRoot}`);
