import semver from "semver";
import migrationsConfig from "./migrations.config.mjs";
import Migration from "./Migration.mjs";
import Question from "./Question.mjs";

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

const aggressiveMessage = async (migrations) => {
    const aggressive = migrations.map(m => m.aggresive).filter(Boolean);
    if (!aggressive.length) {
        return true;
    }
    console.info("");
    console.info("WARNING: Aggressive upgrade detected!");
    console.info(
        "Aggressive upgrade means that customizations applied over previously-generated library may be lost "
            + "or that library won't work after upgrading without further changes to the code. Please verify this list "
            + "of POTENTIAL POSSIBLE issues and accept the upgrade progress:",
    );
    console.info(aggressive.map(a => a.trim()).join("\n"));
    console.info("");

    const q = new Question();
    const accept = await q.ask("Do you want to continue? (y/n) [n]");
    q.close();

    return accept.startsWith("y");
};

const migrate = async ({ targetDir, pkg, ver }) => { // eslint-disable-line max-statements
    const migration = new Migration({ targetDir, pkg });
    const migrations = migrationsConfig.filter(migrationConfig => {
        return semver.gte(migrationConfig.version, ver);
    });

    const versions = migrations.map(m => m.nextVersion);
    const cont = await aggressiveMessage(migrations);
    if (!cont) {
        console.info("Upgrade stopped.");
        return;
    }

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

export default migrate;
