import hi from "./index.mjs";

describe("index", () => {
    it("must say hi with name", () => {
        hi("Jack").must.equal("hi Jack");
    });

    it("returns undefined as name when not given", () => {
        hi().must.equal("hi undefined");
    });
});
