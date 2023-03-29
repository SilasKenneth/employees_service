import { describe } from "node:test";
const request = require("supertest");
import { BASE_URL, defaultUser } from "../setup";
import { Employee } from "../../models/employee";

describe("POST /employees", () => {
    const employee = {
        dateOfBirth: "2002-10-10",
        department: "Engineering",
        fullName: "Kenneth Silas",
        gender: "Male",
        hireDate: "2023-01-01",
        jobTitle: "Software Engineer",
        contactInformation: {
            personalEmail: "silasopekidos@gmail.com",
            phone: "+254792319299",
            street: "Yukking",
            workEmail: "kennethogod@hackerrank.com",
        },
    };
    let accessToken = "";
    let addedEmployee: Employee = undefined;
    beforeAll(async () => {
        const token = await request(BASE_URL).post("/token").send(defaultUser);
        accessToken = token.body.token;
        const result = await request(BASE_URL)
            .post("/employees")
            .send(employee)
            .set({ Authorization: `Bearer ${accessToken}` });
        addedEmployee = result.body?.data;
    });

    test("Test Can delete employee.", async () => {
        const result1 = await request(BASE_URL)
            .delete(`/employees/${addedEmployee?.empID}/delete`)
            .send()
            .set({ Authorization: `Bearer ${accessToken}` });
        expect(result1.body?.status).toBe(200);
    });
});
