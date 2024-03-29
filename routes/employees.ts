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

const employeesRouter: Router = Router({
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

    const result = await Employee.findAll({
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
        const body = req.body;

        const result = schemaValidate(body, employeePostBodySchema, {
            required: true,
            allowUnknownAttributes: false,
        }).errors;
        if (result.length > 0) {
            res.json({
                message: "There were some errors with the requests",
                details: result,
            });
        } else {
            const empe: Employee = req.body;
            const createEmployeeTransaction: Transaction =
                await dbConnection.transaction();

            try {
                const contact: Contact = req.body.contactInformation;
                const result2 = await Contact.create(contact, {
                    transaction: createEmployeeTransaction,
                });
                empe.contactID = result2.contactID;
                const result1 = await Employee.create(empe, {
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
            } catch (error) {
                const specifics = error.errors.map((x) => x.message);
                await createEmployeeTransaction.rollback();
                res.status(500).json({
                    status: 500,
                    message: `Could not save record ${error.message}`,
                    errors: specifics,
                });
            }
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

        if (!uuidValidate(req.params.emp_id)) {
            res.json({ status: 400, message: "Invalid Employee ID Passed" });
            return;
        }
        const transaction = await dbConnection.transaction();
        const currentEmployee = await Employee.findByPk(req.params.emp_id);
        let result = undefined;
        let result2 = undefined;
        try {
            if (currentEmployee) {
                result = await Employee.destroy({
                    where: {
                        empID: req.params.emp_id,
                    },
                    transaction: transaction,
                });
                result2 = await Contact.destroy({
                    where: {
                        contactID: currentEmployee.contactID,
                    },
                    transaction: transaction,
                });
                await transaction.commit();
            } else {
                res.status(404).json({
                    status: 404,
                    message: "Employee does not exist.",
                });
            }
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({
                status: 500,
                message: "Internal server error.",
            });
        }
        if (result > 0 && result2 > 0) {
            res.json({ status: 200, message: "Success deleting record." });
        } else {
            res.json({
                status: 400,
                message:
                    "Failed to delete the record. Maybe it does not exist.",
            });
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
            return;
        }
        const result: EmployeeOutput = await Employee.findByPk(
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
        const errors = schemaValidate(req.body, employeeUpdateSchema, {
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
            const queryTransaction = await dbConnection.transaction();
            const updateTransaction = await dbConnection.transaction();
            const contactInfo = req.body?.contactInformation;
            const currentEmployeeDetail: Employee = await Employee.findByPk(
                req.params.emp_id,
                {
                    transaction: queryTransaction,
                    include: Contact,
                },
            );
            const currentEmployeeContact: Contact = await Contact.findByPk(
                currentEmployeeDetail.contactID,
                {
                    transaction: queryTransaction,
                },
            );

            req.body.contactInformation = undefined;

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
            } catch (error) {
                console.log(error.name);
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
