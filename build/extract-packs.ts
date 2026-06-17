import fs from "fs";
import path from "path";

import { extractPack } from "@foundryvtt/foundryvtt-cli";

import {
    listImmediateSubdirs,
    srcPacksRoot,
    staticPacksRoot,
} from "./util/packs.ts";

if (!fs.existsSync(staticPacksRoot)) {
    console.log(`No directory at ${staticPacksRoot}; nothing to extract.`);
    process.exit(0);
}

const sourceDirs = listImmediateSubdirs(staticPacksRoot);

if (sourceDirs.length === 0) {
    console.log(
        `No compendium subfolders under ${staticPacksRoot}; nothing to extract.`,
    );
    process.exit(0);
}

fs.mkdirSync(srcPacksRoot, { recursive: true });

for (const src of sourceDirs) {
    const name = path.basename(src);
    const dest = path.join(srcPacksRoot, name);
    console.log(`extractPack\n  src:  ${src}\n  dest: ${dest}\n`);
    await extractPack(src, dest, {
        nedb: false,
        yaml: false,
        log: true,
        clean: true,
    });
}

console.log(`Extracted ${sourceDirs.length} compendium(s) into ${srcPacksRoot}`);
