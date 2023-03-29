import { describe } from "node:test";
import { Employee, EmployeeAttributes } from "../../models/employee";
import { ContactAttributes } from "../../models/contact";
import { Optional } from "sequelize";
import { BASE_URL, defaultUser } from "../setup";
const request = require("supertest");

describe("GET /employees/(|{emp_id})", async () => {
    const employee = {
        dateOfBirth: "2002-10-10",
        department: "Engineering",
        fullName: "Kenneth Silas",
        gender: "Male",
        hireDate: "2023-01-01",
        jobTitle: "Software Engineer",
        contactInformation: {
            personalEmail: "silasopekidos0@gmail.com",
            phone: "+254792319293",
            street: "Yukking",
            workEmail: "kennethogod09@hackerrank.com",
        },
    };
    let accessToken = "";
    let emp: Employee = undefined;
    beforeAll(async () => {
        let token = await request(BASE_URL).post("/token").send(defaultUser);
        accessToken = token.body.token;
        const result = await request(BASE_URL)
            .post("/employees")
            .send(employee)
            .set({ Authorization: `Bearer ${accessToken}` });
        emp = result.body?.data;
    });

    afterAll(async () => {
        await request(BASE_URL)
            .delete(`/employees/${emp?.empID}/delete`)
            .send()
            .set({ Authorization: `Bearer ${accessToken}` });
    });

    test("Can get all employees", async () => {
        const result2 = await request(BASE_URL)
            .get(`/employees/${emp?.empID}`)
            .send()
            .set({ Authorization: `Bearer ${accessToken}` });
        const id = result2.body.data?.empID;
        expect(id).toBeTruthy();
    });
});
