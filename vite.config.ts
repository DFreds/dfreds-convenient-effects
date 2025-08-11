import * as Vite from "vite";
import checker from "vite-plugin-checker";
import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { viteStaticCopy } from "vite-plugin-static-copy";
import packageJSON from "./package.json" with { type: "json" };

const PACKAGE_ID = "modules/dfreds-convenient-effects";

const config = Vite.defineConfig(({ command, mode }): Vite.UserConfig => {
    const buildMode =
        mode === "production"
            ? "production"
            : mode === "stage"
              ? "stage"
              : "development";
    const outDir = "dist";
    const plugins = [checker({ typescript: true }), tsconfigPaths()];

    console.log(`Build mode: ${buildMode}`);

    if (buildMode === "production") {
        plugins.push(
            minifyPlugin(),
            deleteLockFilePlugin(),
            ...viteStaticCopy({ targets: [{ src: "README.md", dest: "." }] }),
        );
    } else if (buildMode === "stage") {
        plugins.push(
            minifyPlugin(),
            ...viteStaticCopy({ targets: [{ src: "README.md", dest: "." }] }),
        );
    } else {
        plugins.push(
            handleHotUpdateForEnLang(outDir),
            handleHotUpdateForHandlebars(outDir),
        );
    }

    // Create dummy files for vite dev server
    if (command === "serve") {
        const message =
            "This file is for a running vite dev server and is not copied to a build";
        fs.writeFileSync("./index.html", `<h1>${message}</h1>\n`);
        if (!fs.existsSync("./styles")) fs.mkdirSync("./styles");
        fs.writeFileSync(
            "./styles/dfreds-convenient-effects.css",
            `/** ${message} */\n`,
        );
        fs.writeFileSync(
            "./dfreds-convenient-effects.mjs",
            `/** ${message} */\n\nwindow.global = window;\nimport "./src/ts/module.ts";\n`,
        );
        fs.writeFileSync("./vendor.mjs", `/** ${message} */\n`);
    }

    return {
        base:
            command === "build" ? "./" : `/modules/dfreds-convenient-effects/`,
        publicDir: "static",
        define: { BUILD_MODE: JSON.stringify(buildMode) },
        esbuild: { keepNames: true },
        build: {
            outDir,
            emptyOutDir: false,
            minify: false,
            sourcemap: buildMode === "development",
            lib: {
                name: "dfreds-convenient-effects",
                entry: "src/ts/module.ts",
                formats: ["es"],
                fileName: "module",
            },
            rollupOptions: {
                external: [
                    // Foundry VTT internal modules
                    /^@client\//,
                    /^@common\//,
                ],
                output: {
                    assetFileNames: "styles/dfreds-convenient-effects.css",
                    chunkFileNames: "[name].mjs",
                    entryFileNames: "dfreds-convenient-effects.mjs",
                    manualChunks: {
                        vendor: Object.keys(packageJSON.dependencies)
                            ? Object.keys(packageJSON.dependencies)
                            : [],
                    },
                },
            },
            target: "es2022",
        },

        // About server options:
        // - Set `open` to boolean `false` to not open a browser window automatically. This is
        // useful if you set up a debugger instance in your IDE and launch it with the URL:
        // 'http://localhost:30001/game'.
        //
        // - The top proxy entry redirects requests under the module path for `style.css` and
        // following standard static directories: `assets`, `lang`, and `packs` and will pull those
        // resources from the main Foundry / 30000 server.
        // This is necessary to reference the dev resources as the root is `/src` and there is no
        // public / static resources served with this particular Vite configuration. Modify the
        // proxy rule as necessary for your static resources / project.
        server: {
            port: 30001,
            open: false,
            proxy: {
                "^(?!/modules/dfreds-convenient-effects/)":
                    "http://localhost:30000/",
                "/socket.io": { target: "ws://localhost:30000", ws: true },
            },
        },
        plugins,
        css: { devSourcemap: buildMode === "development" },
    };
});

function minifyPlugin(): Vite.Plugin {
    return {
        name: "minify",
        renderChunk: {
            order: "post",
            async handler(code, chunk) {
                return chunk.fileName.endsWith(".mjs")
                    ? esbuild.transform(code, {
                          keepNames: true,
                          minifyIdentifiers: false,
                          minifySyntax: true,
                          minifyWhitespace: true,
                      })
                    : code;
            },
        },
    };
}

function deleteLockFilePlugin(): Vite.Plugin {
    return {
        name: "delete-lock-file-plugin",
        resolveId(source) {
            return source === "virtual-module" ? source : null;
        },
        writeBundle(outputOptions) {
            const outDir = outputOptions.dir ?? "";
            const lockFile = path.resolve(
                outDir,
                "dfreds-convenient-effects.lock",
            );
            fs.rmSync(lockFile);
        },
    };
}

function handleHotUpdateForEnLang(outDir: string): Vite.Plugin {
    return {
        name: "hmr-handler-en-lang",
        apply: "serve",
        handleHotUpdate(context) {
            if (context.file.startsWith(outDir)) return;
            if (!context.file.endsWith("en.json")) return;

            const basePath = context.file.slice(context.file.indexOf("lang/"));
            console.log(`Updating lang file at ${basePath}`);
            fs.promises
                .copyFile(context.file, `${outDir}/${basePath}`)
                .then(() => {
                    context.server.ws.send({
                        type: "custom",
                        event: "lang-update",
                        data: { path: `${PACKAGE_ID}/${basePath}` },
                    });
                });
        },
    };
}

function handleHotUpdateForHandlebars(outDir: string): Vite.Plugin {
    return {
        name: "hmr-handler-handlebars",
        apply: "serve",
        handleHotUpdate(context) {
            if (context.file.startsWith(outDir)) return;
            if (!context.file.endsWith(".hbs")) return;

            const basePath = context.file.slice(
                context.file.indexOf("templates/"),
            );
            console.log(`Updating template file at ${basePath}`);
            fs.promises
                .copyFile(context.file, `${outDir}/${basePath}`)
                .then(() => {
                    context.server.ws.send({
                        type: "custom",
                        event: "template-update",
                        data: { path: `${PACKAGE_ID}/${basePath}` },
                    });
                });
        },
    };
}

export default config;
