"use strict";

const getSix = require("./async");

describe("async method test", () => {
    it("gets six", async () => {
        const r = await getSix();
        r.must.equal(6);
    });
});
