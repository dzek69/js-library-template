#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import isEmptyDir from "empty-dir";

import thisDir from "./root.mjs";
import getExp from "bottom-line-utils/dist/get.js";
import migrate from "./migrate.mjs";
import Question from "./Question.mjs";

const get = getExp.default;

const extractProjectName = (givenPath) => {
    if (givenPath === ".") {
        return path.basename(process.cwd());
    }
    if (path.isAbsolute(givenPath)) {
        return path.basename(givenPath);
    }
    return path.normalize(givenPath).replace(/\\/g, "/").split("/").filter(v => v !== "..").join("/");
};

const argsDir = process.argv[2] || ".";
const targetDir = path.resolve(argsDir);

const names = [
    "build-scripts",
    "src",
    "test",
    ".editorconfig",
    ".yarnclean.txt",
    ".yarnclean.whitelist",
    "jsdoc.json",
];

const rootNames = [
    ".babelrc.cjs",
    ".eslintrc.json",
    "CHANGELOG.md",
    "LICENSE",
    "package.json",
    "README.md",
];

const rootFixedNames = {
    "gitignore.gitignore": ".gitignore",
    "npmignore.npmignore": ".npmignore",
};

const INDENT = 2;

(async () => { // eslint-disable-line max-statements, max-lines-per-function
    try {
        const thisPkg = JSON.parse(String(await fs.readFile(path.join(thisDir, "package.json"))));

        console.info("Target dir:", targetDir);
        const projectNameFromPath = extractProjectName(argsDir);
        await fs.ensureDir(targetDir);

        const pkgPath = path.join(targetDir, "package.json");

        const isEmpty = await isEmptyDir(targetDir);
        if (!isEmpty) {
            let pkg,
                ver;
            try {
                pkg = JSON.parse(await fs.readFile(pkgPath));
                ver = get(pkg, ["libraryTemplate", "version"]);
                if (!ver) {
                    throw new Error("No version");
                }
            }
            catch (e) { // eslint-disable-line no-unused-vars
                throw new Error("Target directory is not empty, no supported library found to upgrade.");
            }

            await migrate({
                targetDir, pkg, ver, thisPkg,
            });
            return;
        }
        console.info("Creating new library");
        await fs.ensureDir(path.join(targetDir, "tutorials"));
        const promises1 = names.map(async name => {
            const target = path.join(targetDir, name);
            const source = path.join(thisDir, name);
            await fs.copy(source, target);
        });
        const promises2 = rootNames.map(async name => {
            const target = path.join(targetDir, name);
            const source = path.join(thisDir, "root-files", name);
            await fs.copy(source, target);
        });
        const promises3 = Object.entries(rootFixedNames).map(async ([fakeName, realName]) => {
            const target = path.join(targetDir, realName);
            const source = path.join(thisDir, "root-files", fakeName);
            await fs.copy(source, target);
        });

        await Promise.all([...promises1, ...promises2, ...promises3]);

        const q = new Question();

        const project = await q.ask("Project name? [" + projectNameFromPath + "]");
        const version = await q.ask("Version? [0.0.1]");
        const repo = await q.ask("Repository URL? [NOT SET]");
        const author = await q.ask("Author [NOT SET]");
        const defaultLicense = author || "NOT SET";
        const copy = await q.ask("Copyright (LICENSE), ie: My Name [" + defaultLicense + "]");
        const useCopy = copy || author;
        q.close();

        const useProjectName = project || projectNameFromPath;

        const targetPkg = JSON.parse(await fs.readFile(pkgPath));
        targetPkg.name = useProjectName;
        targetPkg.version = version || "0.0.1";
        repo ? targetPkg.repository = repo : delete targetPkg.repository; // eslint-disable-line no-unused-expressions
        author ? targetPkg.author = author : delete targetPkg.author; // eslint-disable-line no-unused-expressions
        targetPkg.libraryTemplate = {
            version: thisPkg.version,
        };
        await fs.writeFile(pkgPath, JSON.stringify(targetPkg, null, INDENT));

        let lic;
        const licPath = path.join(targetDir, "LICENSE");
        const yr = new Date().getFullYear();
        lic = String(await fs.readFile(licPath));
        lic = lic.replace("(c)", `(c) ${yr} ${useCopy}`);
        await fs.writeFile(licPath, lic);

        console.info("");
        console.info("Done");
    }
    catch (e) {
        console.error("Error happend!");
        console.error(e.message);
        process.exit(1); // eslint-disable-line no-process-exit
    }
})();

