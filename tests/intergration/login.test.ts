const request = require("supertest");
import { BASE_URL, defaultUser } from "../setup";

describe("POST /token", () => {
    test("Can successfully log in to app", async () => {
        let token = await request(BASE_URL).post("/token").send(defaultUser);
        expect(token.body.token).toBeTruthy();
    });
});
