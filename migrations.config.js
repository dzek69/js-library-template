"use strict";

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
                    await mig.assertScript(
                        "prepublishOnly",
                        "npm run test && npm run lint && npm run docs",
                        new Error(
                            "cannot update prepublishOnly script as it was modified\n  "
                            + "wanted new value:\n  `npm run lint && npm run test && npm run docs`",
                        ),
                    );
                    await mig.setScript("prepublishOnly", "npm run lint && npm run test && npm run docs");
                },
            },
        ],
    },
];

module.exports = migrationsConfig;
