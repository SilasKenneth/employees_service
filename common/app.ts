import express, { Express } from "express";
import swaggerFile = require("../swagger_output.json");
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();
export let APPLICATION_SECRET: string;
if (process.env.APPLICATION_SECRET === undefined) {
    throw new Error(
        "Missing application secret. Please Specify the APPLICATION_SECRET environment variable.",
    );
}
APPLICATION_SECRET = process.env.APPLICATION_SECRET;
export const app: Express = express();

app.use(express.json());
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
