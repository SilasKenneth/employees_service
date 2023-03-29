import express, { Express, NextFunction } from "express";
import swaggerFile = require("../swagger_output.json");
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

const cors = require("cors");

dotenv.config();

if (process.env.APPLICATION_SECRET === undefined) {
    throw new Error(
        "Missing application secret. Please Specify the APPLICATION_SECRET environment variable.",
    );
}
export const APPLICATION_SECRET: string = process.env.APPLICATION_SECRET;
export const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
