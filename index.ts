import { app, APPLICATION_SECRET } from "./common/app";
import { config } from "./config/app";
import { employeesRouter } from "./routes/employees";
import { logger } from "./common/logger";
import winston from "winston";
import swaggerUi from "swagger-ui-express";
const expressWinston = require("express-winston");
import { expressjwt as jwt } from "express-jwt";
import { dbConnection } from "./common/connection";

app.use(
    jwt({
        secret: APPLICATION_SECRET,
        algorithms: ["HS256"],
    }).unless({ path: ["/token", "/api-doc"] }),
);
app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json(),
        ),
    }),
);
app.use("/employees", employeesRouter);
app.listen(config.PORT, () => {
    logger.info(`Listening on http://localhost:${config.PORT}`);
});
