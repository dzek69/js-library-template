"use strict";

const fs = require("fs-extra");
const child = require("child_process");
const { join } = require("path");
const { get, set } = require("bottom-line-utils/dist");

const run = (command, args, options) => {
    return new Promise((resolve, reject) => {
        const proc = child.spawn(command, args, options);
        proc.stdout.on("data", (data) => {
            console.info(String(data).trim());
        });

        proc.stderr.on("data", (data) => {
            console.info(String(data).trim());
        });

        proc.on("error", (error) => {
            reject(new Error(error));
        });

        proc.on("close", (code) => {
            if (!code) {
                resolve();
                return;
            }
            reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
        });
    });
};

const PKG_JSON_INDENT = 2;

class Migration {
    constructor(opts) {
        this._targetDir = opts.targetDir;
        this._pkg = opts.pkg;
    }

    _savePkg() {
        return fs.writeFile(
            join(this._targetDir, "package.json"),
            JSON.stringify(this._pkg, null, PKG_JSON_INDENT),
        );
    }

    async setPath(path, value) {
        set(this._pkg, path, value);
        await this._savePkg();
    }

    async setScript(scriptName, value) {
        await this.setPath(["scripts", scriptName], value);
    }

    async addDependency(name, version) {
        await this.setPath(["dependencies", name], version);
    }

    async addDevDependency(name, version) {
        await this.setPath(["devDependencies", name], version);
    }

    assertPath(path, value, error) {
        if (get(this._pkg, path) !== value) {
            throw error;
        }
    }

    assertScript(scriptName, value, error) {
        this.assertPath(["scripts", scriptName], value, error);
    }

    assertNoDependency(name, error) {
        if (this._pkg.dependencies && name in this._pkg.dependencies) {
            throw error;
        }
    }

    assertNoDevDependency(name, error) {
        if (this._pkg.devDependencies && name in this._pkg.devDependencies) {
            throw error;
        }
    }

    assertNoAnyDependency(name, error) {
        this.assertNoDependency(name, error);
        this.assertNoDevDependency(name, error);
    }

    yarn() {
        return run("yarn", [], {
            cwd: this._targetDir,
            shell: true,
        });
    }
}

module.exports = Migration;
