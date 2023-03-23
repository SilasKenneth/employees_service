import {NextFunction, Request, Response} from "express";
import {app} from "../common/app";
import {validate as schemaValidate} from "jsonschema";
import {employeePostBodySchema} from "../models/schemas";
import {dbConnection} from "../common/connection";
import {UUID} from "crypto";
import {validate as uuidValidate} from 'uuid';

app.get("/employees/", async (req: Request, res: Response) => {
    let result = await dbConnection.query("SELECT * FROM employees;")
        .then(result => {
            return result.entries();
        }).catch(error => {
            console.log(error);
    });
    res.json(result);
});

app.post('/employees/', async (req: Request, res: Response, next: NextFunction) => {
    let body = req.body;
    console.log(body);
    let result = schemaValidate(body, employeePostBodySchema, {required: true, allowUnknownAttributes: false}).errors;

    if (result.length === 0) {
        res.json({"message": "Success!"});
    } else {
        res.json({"message": "There were some errors with the requests", "details": result});
    }
});

app.delete("/employees/:emp_id/delete/", async (req: Request<{emp_id: UUID}>, res: Response) => {
    console.log(req.params);
});

app.get("/employee/:emp_id/", async (req: Request<{emp_id: UUID}>, res: Response) => {
    if (!uuidValidate(req.params.emp_id)) {
        res.status(404)
            .json({message: "Invalid employee ID passed."});
    } else {
        res.json({message: "Hello world", params: req.params.emp_id});
    }
});