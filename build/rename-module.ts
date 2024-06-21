import fs from "fs-extra";
import path from "path";
import prompts from "prompts";

const newModuleIdentifier: string | undefined = (
    await prompts({
        type: "text",
        name: "value",
        format: (v: string) => v.replace(/\W*$/, "").trim(),
        message:
            "Enter the identifier of your module. (Example: dfreds-convenient-effects)",
    })
).value;

const newModuleName: string | undefined = (
    await prompts({
        type: "text",
        name: "value",
        format: (v: string) => v.replace(/\W*$/, "").trim(),
        message:
            "Enter the title of your module. (Example: DFreds Convenient Effects)",
    })
).value;

if (!newModuleIdentifier) {
    console.error("No module identifier entered.");
    process.exit(1);
}

if (!newModuleName) {
    console.error("No module name entered.");
    process.exit(1);
}

const dirToSearch = path.resolve(process.cwd());
const dirsToInclude = [
    path.resolve(dirToSearch, ".github"),
    path.resolve(dirToSearch, "packs"),
    path.resolve(dirToSearch, "src"),
    path.resolve(dirToSearch, "static"),
    path.resolve(dirToSearch, "package.json"),
    path.resolve(dirToSearch, "package-lock.json"),
    path.resolve(dirToSearch, "README.md"),
    path.resolve(dirToSearch, "vite.config.ts"),
];
const filesToInclude = [path.resolve(dirToSearch, ".gitignore")];
const lockFilePath = path.resolve(
    dirToSearch,
    "static",
    "dfreds-module-template-ts.lock",
);

// Recursively find all files in included dirs
const filesToReplaceStrings = fs
    .readdirSync(dirToSearch, {
        encoding: "utf-8",
        recursive: true,
    })
    .map((file: string) => path.resolve(dirToSearch, file))
    .filter((filePath: string) => {
        const isIncluded =
            dirsToInclude.findIndex((includeDir) =>
                filePath.startsWith(includeDir),
            ) !== -1;

        const isDirectory = fs.lstatSync(filePath).isDirectory();

        return isIncluded && !isDirectory;
    });

// Add specific files not searched
filesToReplaceStrings.push(...filesToInclude);

console.log(
    `Changing identifier and name in the following files:\n${filesToReplaceStrings.join("\n")}`,
);

try {
    for (const file of filesToReplaceStrings) {
        const fileData = fs.readFileSync(file, { encoding: "utf8" });
        const replaced = fileData
            .replace(/dfreds-module-template-ts/g, newModuleIdentifier)
            .replace(/DFreds Module Template TS/g, newModuleName);

        fs.writeFileSync(file, replaced);
    }

    // Rename the lock file
    fs.renameSync(
        lockFilePath,
        path.resolve(dirToSearch, "static", `${newModuleIdentifier}.lock`),
    );
} catch (error) {
    console.error(error);
    process.exit(1);
}
