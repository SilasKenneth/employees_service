import { Request, Response, Router } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import { logger } from "../common/logger";
import { validate as schemaValidate } from "jsonschema";
import { userLoginSchema } from "../models/schemas";
import jwt from "jsonwebtoken";
import { APPLICATION_SECRET } from "../common/app";
let authRoute = Router();

authRoute.post(
    "/",
    async (
        req: Request<{}, {}, { email: string; password: string }>,
        res: Response,
    ) => {
        // #swagger.start
        /*
       #swagger.path = '/token'
       #swagger.method = 'post'
       #swagger.summary = 'Get access token'
       #swagger.requestBody = {
            required: true,
            "@content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            email: {
                                type: "string",
                                format: "email"
                            },
                            password: {
                                type: "string",
                                format: "password"
                            }
                        },
                        required: ["email", "password"]
                    }
                }
            }
        }
       #swagger.description = 'Endpoint to obtain access token to make requests.'
       #swagger.produces = ["application/json"]
       #swagger.tags = ['Auth']
    */
        let errors = schemaValidate(req.body, userLoginSchema).errors;

        logger.error(errors);
        if (errors.length > 0) {
            res.json({
                status: 400,
                message: "Request has issues.",
                data: errors,
            });
            return;
        }
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (
            user &&
            req.body.password &&
            (await bcrypt.compare(req.body.password, user.password))
        ) {
            let token = jwt.sign({}, APPLICATION_SECRET, {
                algorithm: "HS256",
                expiresIn: 30 * 60 * 60,
                issuer: "example.com",
                audience: "admin",
            });
            res.json({ status: 200, message: "Success", token });
            logger.info("Match.");
        } else {
            res.json({
                status: 401,
                message:
                    "Wrong email or password passed. Please check and try again.",
            });
            logger.error("Wrong credentials!");
        }

        /* #swagger.end */
    },
);

export { authRoute };
