import readline from "readline";

class Question {
    _createIfNeeded() {
        if (!this._cli) {
            this._cli = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
        }
    }

    ask(question, def = "") {
        this._createIfNeeded();
        return new Promise(resolve => {
            this._cli.question(question + " ", name => {
                resolve(name.trim() || def);
            });
        });
    }

    close() {
        if (this._cli) {
            this._cli.close();
            this._cli = null;
        }
    }
}

export default Question;
