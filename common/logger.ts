import winston, { Logger, format } from "winston";
import { config } from "../config/app";

const { combine, timestamp, prettyPrint, colorize } = format;
export const logger: Logger = winston.createLogger({
    level: config.LOG_LEVEL,
    format: combine(
        timestamp({
            format: "MMM-DD-YYYY HH:mm:ss",
        }),
        winston.format.json(),
        colorize({ colors: { info: "green", error: "red" } }),
    ),
    transports: [
        new winston.transports.File({
            level: "error",
            filename: "logs/logs.log",
        }),
    ],
});
