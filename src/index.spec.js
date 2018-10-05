"use strict";

const hi = require("./index");

describe("index", () => {
    it("must say hi with name", () => {
        hi("Jack").must.equal("hi Jack");
    });

    it("returns undefined as name when not given", () => {
        hi().must.equal("hi undefined");
    });
});
