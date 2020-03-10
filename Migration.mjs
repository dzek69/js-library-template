import fs from "fs-extra";
import child from "child_process";
import { join } from "path";
import bottom from "bottom-line-utils/dist/index.js";
import thisDir from "./root.mjs";

const { get, set } = bottom;

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
const JSON_INDENT = 4;

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

    async upgradeScript(scriptName, oldValue, newValue) {
        await this.assertScript(
            scriptName,
            oldValue,
            new Error(
                "cannot update " + scriptName + " script as it was modified\n  "
                + "wanted new value:\n  `" + newValue + "`",
            ),
        );
        await this.setScript(scriptName, newValue);
    }

    async addDependency(name, version) {
        await this.setPath(["dependencies", name], version);
    }

    async addDevDependency(name, version) {
        await this.setPath(["devDependencies", name], version);
    }

    async upgradeDependency(name, version, defaultType = "dependencies") {
        const type = this.findDependency(name) || defaultType;
        await this.setPath([type, name], version);
    }

    findDependency(name) {
        const deps = this._pkg.dependencies || {};
        const dev = this._pkg.devDependencies || {};
        if (deps[name]) {
            return "dependencies";
        }
        if (dev[name]) {
            return "devDependencies";
        }
    }

    async remove(dirName) {
        await fs.remove(join(this._targetDir, dirName));
    }

    async copy(sourceName, targetName) {
        await fs.copy(
            join(thisDir, sourceName),
            join(this._targetDir, targetName),
        );
    }

    async rename(source, target) {
        await fs.rename(join(this._targetDir, source), join(this._targetDir, target));
    }

    async updateContents(file, updater) {
        const target = join(this._targetDir, file);
        const data = String(await fs.readFile(target));
        const contents = await updater(data);
        await fs.writeFile(target, contents);
    }

    async updateContentsJSON(file, updater) {
        const target = join(this._targetDir, file);
        const data = JSON.parse(String(await fs.readFile(target)));
        await updater(data, set.bind(null, data));
        await fs.writeFile(target, JSON.stringify(data, null, JSON_INDENT));
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

export default Migration;
