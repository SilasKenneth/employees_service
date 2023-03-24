import { describe } from "node:test";
import assert from "node:assert";

describe("Google", () => {
    test("Some good test", () => {
        expect(1).toBe(1);
    });
    test("Test numbers", () => {
        expect("Silas".toLowerCase()).toBe("silas");
    });
});
