"use strict";

const readline = require("readline");

class Question {
    _createIfNeeded() {
        if (!this._cli) {
            this._cli = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
        }
    }

    ask(question) {
        this._createIfNeeded();
        return new Promise(resolve => {
            this._cli.question(question + " ", name => {
                resolve(name.trim());
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

module.exports = Question;
