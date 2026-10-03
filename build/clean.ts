import fs from "fs";
import path from "path";

const outDir = path.resolve(process.cwd(), "dist");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir);
