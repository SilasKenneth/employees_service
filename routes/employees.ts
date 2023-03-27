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
import { APPLICATION_SECRET } from "../common/app";
import { Transaction } from "sequelize";
import { Contact } from "../models/contact";
import { UUID } from "crypto";

const jwt = require("jsonwebtoken");
import ISOLATION_LEVELS = Transaction.ISOLATION_LEVELS;

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
    res.json({ status: 200, message: "Success", data: result });
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
           #swagger.requestBody = {
                required: true,
                "@content": {
                    "application/json": {
                        schema: {
                            type: 'object',
                            properties: {
                            fullName: {
                                type: 'string'
                            },
                            contactInformation: {
                               type: 'object',
                               properties: {
                                   personalEmail: {
                                       type: 'string',
                                       format: 'email'
                                   },
                                   workEmail: {
                                       type: 'string',
                                       format: 'email'
                                   },
                                   phone: {
                                       type: 'string',
                                       format: 'phone'
                                   },
                                   street: {
                                       type: 'string'
                                   }
                               }
                            },
                            jobTitle: {
                                type: 'string'
                            },
                            department: {
                                type: 'string'
                            },
                            dateOfBirth: {
                                type: 'string',
                                format: 'date'
                            },
                            gender: {
                               type: 'string'
                            },
                            hireDate: {
                               type: 'string',
                               format: 'date'
                            }
                          }
                      }
                      }
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
                .then(() => {})
                .catch((error) => {
                    createEmployeeTransaction.rollback();
                    logger.error(error);
                });
            logger.info(`Success saving record! ${req.body}`);
            res.json({ status: 200, message: "Success!", data: result1 });
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
        let result = await Employee.destroy({
            where: {
                empID: req.params.emp_id,
            },
        });
        if (result > 0) {
            res.json({ status: 200, message: "Success" });
        } else {
            res.json({ status: 400, message: "Failed" });
        }
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
                status: 404,
                message: "InvalidEmployeeID",
                details: "The passed employee ID is not a valid UUID value.",
            });
        } else if (errors.length > 0) {
            res.json({
                status: 400,
                message: "InvalidData",
                details: errors,
            });
        } else {
            let queryTransaction = await dbConnection.transaction({
                isolationLevel: ISOLATION_LEVELS.READ_COMMITTED,
            });
            let updateTransaction = await dbConnection.transaction({
                isolationLevel: ISOLATION_LEVELS.READ_COMMITTED,
            });
            let contactInfo = req.body?.contactInformation;
            let currentEmployeeDetail: Employee = await Employee.findByPk(
                req.params.emp_id,
                {
                    transaction: queryTransaction,
                    include: Contact,
                },
            );
            let currentEmployeeContact: Contact = await Contact.findByPk(
                currentEmployeeDetail.contactID,
                {
                    transaction: queryTransaction,
                },
            );

            delete req.body.contactInformation;

            try {
                await Employee.update(req.body, {
                    transaction: updateTransaction,
                    where: { empID: req.params.emp_id },
                });
                if (contactInfo) {
                    await Contact.update(contactInfo, {
                        transaction: updateTransaction,
                        where: {
                            contactID: currentEmployeeContact.contactID,
                        },
                    });
                }
                await updateTransaction.commit();
            } catch (error: unknown) {
                logger.error(error);
                await updateTransaction.rollback();
                throw error;
            }

            res.json({
                status: 200,
                message: "Success",
                data: await currentEmployeeDetail.reload(),
            });
        }
        /* #swagger.end */
    },
);
export { employeesRouter };
