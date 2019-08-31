"use strict";

const semver = require("semver");
const migrationsConfig = require("./migrations.config");
const Migration = require("./Migration");

const applyMigrations = async ({ migration, migrations }) => {
    let skipped = 0;

    const err = (e) => {
        skipped++;
        console.warn("✖", e.message);
    };

    for (let i = 0; i < migrations.length; i++) {
        const migrationConfig = migrations[i];

        console.info(`Upgrading [${migrationConfig.version} -> ${migrationConfig.nextVersion}]`);
        for (let j = 0; j < migrationConfig.steps.length; j++) {
            const step = migrationConfig.steps[j];
            console.info();
            console.info(`- ${step.name}`);
            await step.fn(migration).then(
                () => console.warn("✔ ok"),
                err,
            );
        }
        await migration.setPath("libraryTemplate.version", migrationConfig.nextVersion);
    }

    return skipped;
};

const migrate = async ({ targetDir, pkg, ver }) => {
    const migration = new Migration({ targetDir, pkg });
    const migrations = migrationsConfig.filter(migrationConfig => {
        return semver.gte(migrationConfig.version, ver);
    });

    const versions = migrations.map(m => m.nextVersion);

    if (!migrations.length) {
        console.info("The project is up to date with current js-library-template.");
        return;
    }
    console.info(`${migrations.length} updates to apply, versions: ${versions.join(", ")}`);

    const skipped = await applyMigrations({ migration, migrations });

    console.info();
    if (skipped) {
        console.info(`Skipped ${skipped} upgrades. Please perform them manually if needed.`);
    }
    console.info("Upgrading finished.");
};

module.exports = migrate;
