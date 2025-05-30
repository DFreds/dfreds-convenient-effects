import fs from "fs-extra";
import path from "path";
import process from "process";
import prompts from "prompts";
import { dataPath, fvtt } from "../foundryconfig.json";
import { exec } from "child_process";
import { promisify } from "util";

const fvttVersion = (
    await prompts({
        type: "select",
        name: "value",
        message: "Select the FoundryVTT version you want to use.",
        choices: Object.keys(fvtt).map((version) => ({
            title: version,
            value: version,
        })),
    })
).value as string;

const fvttPath = fvtt[fvttVersion];

if (!fvttPath) {
    console.error(`FoundryVTT version "${fvttVersion}" not found.`);
    process.exit(1);
}

if (!dataPath || !/\bData$/.test(dataPath)) {
    console.error(`"${dataPath}" does not look like a Foundry data folder.`);
    process.exit(1);
}

const entryPoint = path.resolve(fvttPath, "resources", "app", "main.js");

if (!fs.existsSync(entryPoint)) {
    console.error(`Cannot start FoundryVTT. "${entryPoint}" does not exist.`);
    process.exit(1);
}

const execAsync = promisify(exec);

const startFoundry = async () => {
    console.log(`Starting FoundryVTT from ${entryPoint}...`);

    try {
        const { stdout, stderr } = await execAsync(
            `node ${entryPoint} --datapath=${dataPath}`,
        );
        console.log(`stdout: ${stdout}`);
        if (stderr) console.error(`stderr: ${stderr}`);
    } catch (error) {
        console.error(error);
    }
};

startFoundry().catch(console.error);
