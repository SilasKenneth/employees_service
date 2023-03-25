import { NextFunction, Request, Response, Router } from "express";
import { validate as schemaValidate } from "jsonschema";
import {
    employeePostBodySchema,
    employeeUpdateSchema,
} from "../models/schemas";
import { dbConnection } from "../common/connection";
import { validate as uuidValidate } from "uuid";
import { Employee, EmployeeOutput } from "../models/employee";
import { logger } from "../common/logger";
const jwt = require("jsonwebtoken");
import { APPLICATION_SECRET } from "../common/app";
import { Transaction } from "sequelize";
import { Contact } from "../models/contact";
import { UUID } from "crypto";

let employeesRouter: Router = Router({
    caseSensitive: true,
});

const employeeAttributes = [
    "empID",
    "fullName",
    "gender",
    "department",
    "jobTitle",
    "dateOfBirth",
    "hireDate",
];
const contactAttributes = ["phone", "workEmail", "personalEmail", "street"];
employeesRouter.get("/", async (req: Request, res: Response) => {
    // #swagger.start
    /*
       #swagger.path = '/employees/'
       #swagger.method = 'get'
       #swagger.summary = 'Get all employee record'
       #swagger.description = 'Endpoint to get all employees'
       #swagger.produces = ["application/json"]
       #swagger.security = [{
                "bearerAuth": []
       }]
       #swagger.tags = ['Employee']
    */

    let result = await Employee.findAll({
        include: { model: Contact, attributes: contactAttributes },
        attributes: employeeAttributes,
    });
    res.json(result);
    /* #swagger.end */
});

employeesRouter.post(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
        // #swagger.start
        /*
           #swagger.path = '/employees/'
           #swagger.method = 'post'
           #swagger.summary = 'Add new employee record'
           #swagger.description = 'Endpoint to create new employee record.'
           #swagger.produces = ["application/json"]
           #swagger.tags = ['Employee']
           #swagger.consumes = ['application/json']
           #swagger.security = [{
                "bearerAuth": []
           }]
           #swagger.parameters['body'] = {
                in: 'body',
                description: 'Some description...',
                schema: {
                    $fullName: 'Kenneth Omondi',
                    $contactInformation: {
                       $personalEmail: 'silaskenn@gmail.com',
                       $workEmail: 'silas@microsoft.com',
                       $phone: '+254791350402',
                       $street: 'Andela Kenya'
                    },
                    $jobTitle: 'Software Engineer',
                    $department: 'Engineering',
                    $dateOfBirth: '1996-12-12',
                    $gender: 'Male',
                    $hireDate: '2022-12-12'
                  }
            }
        */
        console.log(
            jwt.sign({}, APPLICATION_SECRET, {
                algorithm: "HS256",
                expiresIn: 30 * 60 * 60,
                issuer: "example.com",
                audience: "admin",
            }),
        );
        let body = req.body;

        let result = schemaValidate(body, employeePostBodySchema, {
            required: true,
            allowUnknownAttributes: false,
        }).errors;
        if (result.length > 0) {
            res.json({
                message: "There were some errors with the requests",
                details: result,
            });
        } else {
            let empe: Employee = req.body;

            let createEmployeeTransaction: Transaction =
                await dbConnection.transaction();
            logger.info(empe);
            let emp: Employee | null = null;
            let contact: Contact = req.body.contactInformation;
            let result2 = await Contact.create(contact, {
                transaction: createEmployeeTransaction,
            });
            empe.contactID = result2.contactID;
            let result1 = await Employee.create(empe, {
                transaction: createEmployeeTransaction,
            });

            createEmployeeTransaction
                .commit()
                .then((resu) => {
                    console.log(resu);
                })
                .catch((error) => {
                    createEmployeeTransaction.rollback();
                    console.log(error);
                });
            logger.info(result1);
            logger.info(result2);
            res.json({ message: "Success!" });
        }
        /* #swagger.end */
    },
);

employeesRouter.delete(
    "/:emp_id/delete/",
    async (req: Request<{ emp_id: UUID }>, res: Response) => {
        // #swagger.start
        /*
           #swagger.path = '/employees/{emp_id}/delete'
           #swagger.method = 'delete'
           #swagger.summary = 'Delete employee record'
           #swagger.description = 'Endpoint to delete a specific employee record.'
           #swagger.produces = ["application/json"]
           #swagger.security = [{
                "bearerAuth": []
           }]
           #swagger.tags = ['Employee']
        */
        logger.info(req.params);
        /* #swagger.end */
    },
);

employeesRouter.get(
    "/:emp_id/",
    async (req: Request<{ emp_id: UUID }>, res: Response) => {
        // #swagger.start
        /*
           #swagger.path = '/employees/{emp_id}'
           #swagger.method = 'get'
           #swagger.summary = 'Get specific employee record'
           #swagger.description = 'Endpoint to get a specific employee record.'
           #swagger.security = [{
                "bearerAuth": []
           }]
           #swagger.produces = ["application/json"]
           #swagger.tags = ['Employee']
        */
        if (!uuidValidate(req.params.emp_id)) {
            res.status(404).json({ message: "Invalid employee ID passed." });
        }
        let result: EmployeeOutput = await Employee.findByPk(
            req.params.emp_id,
            {
                include: {
                    model: Contact,
                    attributes: contactAttributes,
                },
                attributes: employeeAttributes,
            },
        );

        if (result) {
            res.json({ message: "Success", data: result });
        } else {
            res.status(404).json({
                message: `Employee with ID ${req.params.emp_id} not found.`,
            });
        }
        /* #swagger.end */
    },
);

employeesRouter.put(
    "/:emp_id/",
    async (req: Request<{ emp_id: UUID }>, res: Response) => {
        // #swagger.start
        /*
           #swagger.path = '/employees/{emp_id}'
           #swagger.method = 'put'
           #swagger.security = [{
                "bearerAuth": []
           }]
           #swagger.summary = 'Update employee record'
           #swagger.description = 'Endpoint to edit an employee record.'
           #swagger.produces = ["application/json"]
           #swagger.tags = ['Employee']
        */
        let errors = schemaValidate(req.body, employeeUpdateSchema, {
            allowUnknownAttributes: false,
        }).errors;

        if (!uuidValidate(req.params.emp_id)) {
            res.status(404).json({
                message: "Invalid employee ID passed.",
                data: errors,
            });
        } else {
            res.json({
                message: "Hello world",
                params: req.params.emp_id,
                data: errors,
            });
        }
        /* #swagger.end */
    },
);
export { employeesRouter };
