#!/usr/bin/env node

"use strict";

const fs = require("fs-extra");
const path = require("path");
const readline = require("readline");
const emptyDir = require("empty-dir");

const cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const q = (question) => {
    return new Promise(resolve => {
        cli.question(question + " ", name => {
            resolve(name);
        });
    });
};

const targetDir = path.resolve(process.argv[2] || ".");

const names = [
    "build-scripts",
    "src",
    "test",
    ".babelrc",
    ".editorconfig",
    ".eslintrc.json",
    ".yarnclean.txt",
    ".yarnclean.whitelist",
    "jsdoc.json",
];

const rootNames = [
    "CHANGELOG.md",
    "LICENSE",
    "package.json",
    "README.md",
];

const rootFixedNames = {
    "yarn.yarn.lock": "yarn.lock",
    "gitignore.gitignore": ".gitignore",
    "npmignore.npmignore": ".npmignore",
};

const INDENT = 2;

(async () => { // eslint-disable-line max-statements, max-lines-per-function
    try {
        console.info("Creating new library at", targetDir);
        await fs.ensureDir(targetDir);
        const isEmpty = await emptyDir(targetDir);
        if (!isEmpty) {
            throw new Error("Target directory is not empty.");
        }
        await fs.ensureDir(path.join(targetDir, "tutorials"));
        const selfDirName = path.dirname(__filename);
        const promises1 = names.map(async name => {
            const target = path.join(targetDir, name);
            const source = path.join(selfDirName, name);
            await fs.copy(source, target);
        });
        const promises2 = rootNames.map(async name => {
            const target = path.join(targetDir, name);
            const source = path.join(selfDirName, "root-files", name);
            await fs.copy(source, target);
        });
        const promises3 = Object.entries(rootFixedNames).map(async ([fakeName, realName]) => {
            const target = path.join(targetDir, realName);
            const source = path.join(selfDirName, "root-files", fakeName);
            await fs.copy(source, target);
        });

        await Promise.all([...promises1, ...promises2, ...promises3]);

        const project = await q("Project name? [project-name]");
        const version = await q("Version? [0.0.0]");
        const repo = await q("Repository URL? [NOT SET]");
        const author = await q("Author [NOT SET]");
        const copy = await q("Copyright (LICENSE), ie: My Name [NOT SET]");
        cli.close();

        const pkgPath = path.join(targetDir, "package.json");
        const pkg = JSON.parse(await fs.readFile(pkgPath));
        project && (pkg.name = project);
        version && (pkg.version = version);
        repo ? pkg.repository = repo : delete pkg.repository; // eslint-disable-line no-unused-expressions
        author ? pkg.author = author : delete pkg.author; // eslint-disable-line no-unused-expressions
        await fs.writeFile(pkgPath, JSON.stringify(pkg, null, INDENT));

        let lic;
        const licPath = path.join(targetDir, "package.json");
        const yr = new Date().getFullYear();
        lic = String(await fs.readFile(licPath));
        lic = lic.replace("(c)", `${yr} ${copy}`);
        await fs.writeFile(licPath, lic);

        console.info("");
        console.info("Done");
    }
    catch (e) {
        console.error(e.message);
        process.exit(1); // eslint-disable-line no-process-exit
    }
})();

