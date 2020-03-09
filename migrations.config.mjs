/* eslint-disable max-lines */

const migrationsConfig = [
    {
        version: "1.8.0",
        nextVersion: "1.9.0",
        steps: [
            {
                name: `add husky ^3.0.4`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.assertNoAnyDependency("husky", new Error("husky is already installed"));
                    await mig.addDevDependency("husky", "^3.0.4");
                    await mig.yarn();
                },
            },
            {
                name: `set husky pre-push hook`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.assertPath(
                        "husky.hooks.pre-push",
                        undefined,
                        new Error(
                            "cannot set husky pre-push hook as it is already defined\n  "
                            + "wanted new value:\n  `yarn prepublishOnly && yarn transpile`",
                        ),
                    );
                    await mig.setPath("husky.hooks.pre-push", "yarn prepublishOnly && yarn transpile");
                },
            },
            {
                name: `update prepublishOnly script`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeScript(
                        "prepublishOnly",
                        "npm run test && npm run lint && npm run docs",
                        "npm run lint && npm run test && npm run docs",
                    );
                },
            },
        ],
    },
    {
        version: "1.9.0",
        nextVersion: "2.0.0",
        aggresive: `
- build-scripts dir will be overwritten
- .babelrc file will be overwritten
- your code won't work without updating to ESM-style (src dir will be untouched)
`.trim(),
        steps: [
            {
                name: `upgrade build-scripts`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.remove("build-scripts");
                    await mig.copy("build-scripts", "build-scripts");
                },
            },
            {
                name: `upgrade .babelrc`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.remove(".babelrc");
                    await mig.copy(".babelrc.cjs", ".babelrc.cjs");
                },
            },
            {
                name: `upgrade test bootstrap file`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.remove("test/mocha.opts");
                    await mig.rename("test/bootstrap.js", "test/bootstrap.cjs");
                    await mig.updateContents("test/bootstrap.cjs", content => {
                        return content
                            .replace(`"use strict";`, "")
                            .replace(`"./.babelrc"`, `"./.babelrc.cjs"`)
                            .trimStart();
                    });
                },
            },
            {
                name: `upgrade .eslintrc.json`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.updateContentsJSON(".eslintrc.json", (content, set) => {
                        set("parserOptions.sourceType", "module");
                        set("overrides.files", [
                            "src/*.spec.mjs", "src/**/*.spec.mjs",
                        ]);
                    });
                },
            },
            {
                name: `update test script`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeScript(
                        "test",
                        "cross-env NODE_ENV=testing mocha 'src/**/*.spec.js' 'src/**/*.spec.jsx'",
                        "cross-env NODE_ENV=testing mocha --require ./test/bootstrap.cjs 'src/**/*.spec.mjs'",
                    );
                },
            },
            {
                name: `update docs script`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeScript(
                        "docs",
                        "node build-scripts/docs && jsdoc -r src README.md -t node_modules/docdash -d ./docs "
                        + "-u ./tutorials -c jsdoc.json && node build-scripts/docs.after",
                        "node build-scripts/docs.mjs && jsdoc -r src README.md -t node_modules/docdash -d ./docs "
                        + "-u ./tutorials -c jsdoc.json && node build-scripts/docs.after.mjs",
                    );
                },
            },
            {
                name: `update transpile script`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeScript(
                        "transpile",
                        "node build-scripts/transpile && babel src -d dist --ignore **/*.spec.js*",
                        "node build-scripts/transpile.mjs && babel src -d dist --ignore **/*.spec.mjs",
                    );
                },
            },
            {
                name: `update prepublishOnly script`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeScript(
                        "prepublishOnly",
                        "npm run lint && npm run test && npm run docs",
                        "yarn lint && yarn test && yarn docs",
                    );
                },
            },
            {
                name: `update prepack script`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeScript(
                        "prepack",
                        "npm run transpile",
                        "yarn transpile",
                    );
                },
            },
            {
                name: `update lint script`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeScript(
                        "lint",
                        "cross-env eslint --report-unused-disable-directives 'src/**/*.js' 'src/*.js' 'src/**/*.jsx' "
                        + "'src/*.jsx'",
                        "cross-env eslint --report-unused-disable-directives 'src/**/*.mjs' 'src/*.mjs'",
                    );
                },
            },
            {
                name: `update lint script`,
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeScript(
                        "lint:fix",
                        "npm run lint -- --fix",
                        "yarn lint --fix",
                    );
                },
            },
            {
                name: "upgrade babel dependencies",
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeDependency("@babel/cli", "^7.8.4", "devDependencies");
                    await mig.upgradeDependency("@babel/core", "^7.8.7", "devDependencies");
                    await mig.upgradeDependency("@babel/polyfill", "^7.8.7", "devDependencies");
                    await mig.upgradeDependency("@babel/preset-env", "^7.8.7", "devDependencies");
                    await mig.upgradeDependency("@babel/register", "^7.8.6", "devDependencies");
                },
            },
            {
                name: "upgrade cross-env dependency",
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeDependency("cross-env", "^7.0.2", "devDependencies");
                },
            },
            {
                name: "upgrade docdash dependency",
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeDependency("docdash", "^1.2.0", "devDependencies");
                },
            },
            {
                name: "upgrade eslint dependency",
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeDependency("eslint", "^6.8.0", "devDependencies");
                },
            },
            {
                name: "upgrade fs-extra dependency",
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeDependency("fs-extra", "^8.1.0", "devDependencies");
                },
            },
            {
                name: "upgrade husky dependency",
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeDependency("husky", "^4.2.3", "devDependencies");
                },
            },
            {
                name: "upgrade mocha dependency",
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.upgradeDependency("mocha", "^6.2.2", "devDependencies");
                },
            },
            {
                name: "install new dependencies",
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.yarn();
                },
            },
            {
                name: "set main/module scripts",
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.setPath("main", "dist/index.js");
                    await mig.setPath("module", "src/index.mjs");
                },
            },
            {
                name: "upgrade npmignore",
                /**
                 * @param {Migration} mig
                 */
                fn: async (mig) => {
                    await mig.updateContents(".npmignore", content => {
                        return content.split("\n").map(line => {
                            if (line.trim() === "/.babelrc") {
                                return line.replace("/.babelrc", "/.babelrc.cjs");
                            }
                            return line;
                        }).join("\n");
                    });
                },
            },
        ],
    },
];

export default migrationsConfig;
