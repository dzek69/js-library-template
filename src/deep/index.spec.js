"use strict";

const howdy = require("./index");

describe("howdy", () => {
    let platformMock;

    const osMock = {
        platform: () => platformMock,
    };

    before(() => {
        howdy.__Rewire__("os", osMock);
    });

    after(() => {
        howdy.__ResetDependency__("os");
    });

    beforeEach(() => {
        platformMock = "mochaOS";
    });

    it("must say howdy with name and os platform", () => {
        howdy("Jack").must.equal("howdy Jack on mochaOS");
    });

    it("returns `stranger` as name when not given", () => {
        howdy().must.equal("howdy stranger on mochaOS");
    });
});
