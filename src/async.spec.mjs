import getSix from "./async.mjs";

describe("async method test", () => {
    it("gets six", async () => {
        const r = await getSix();
        r.must.equal(6);
    });
});
