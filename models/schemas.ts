import { Department, Gender, JobTitle } from "./employee";

export const employeePostBodySchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    id: "/EmployeeSchema",
    type: "object",
    properties: {
        fullName: {
            type: "string",
            minLength: 2,
        },
        dateOfBirth: {
            type: "string",
            format: "date",
        },
        gender: {
            type: "string",
            enum: Object.values(Gender),
        },
        contactInformation: {
            id: "/ContactInformation",
            type: "object",
            properties: {
                phone: {
                    type: "string",
                    format: "phone",
                },
                personalEmail: {
                    type: "string",
                    format: "email",
                },
                workEmail: {
                    type: "string",
                    format: "email",
                },
                street: {
                    type: "string",
                    minLength: 2,
                },
            },
            required: ["phone", "workEmail", "personalEmail", "street"],
        },
        hireDate: {
            type: "string",
            format: "date",
        },
        department: {
            type: "string",
            minLength: 1,
            enum: Object.values(Department),
        },
        jobTitle: {
            type: "string",
            minLength: 2,
            enum: Object.values(JobTitle),
        },
    },
    required: [
        "fullName",
        "contactInformation",
        "jobTitle",
        "department",
        "dateOfBirth",
        "hireDate",
        "gender",
    ],
};

export const employeeUpdateSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    id: "/EmployeeUpdateSchema",
    type: "object",
    properties: {
        fullName: {
            type: "string",
            minLength: 2,
        },
        dateOfBirth: {
            type: "string",
            format: "date",
        },
        gender: {
            type: "string",
            enum: Object.values(Gender),
        },
        contactInformation: {
            id: "/ContactUpdateInformation",
            type: "object",
            properties: {
                phone: {
                    type: "string",
                    format: "phone",
                },
                personalEmail: {
                    type: "string",
                    format: "email",
                },
                workEmail: {
                    type: "string",
                    format: "email",
                },
                street: {
                    type: "string",
                    minLength: 2,
                },
            },
        },
        hireDate: {
            type: "string",
            format: "date",
        },
        department: {
            type: "string",
            minLength: 1,
            enum: Object.values(Department),
        },
        jobTitle: {
            type: "string",
            minLength: 2,
            enum: Object.values(JobTitle),
        },
    },
};
export const userLoginSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    id: "/UserLoginSchema",
    type: "object",
    properties: {
        email: {
            type: "string",
            format: "email",
            minLength: 6,
        },
        password: {
            type: "string",
            minLength: 8,
        },

        required: ["email", "password"],
    },
};
