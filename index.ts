import { app, APPLICATION_SECRET } from "./common/app";
import { config } from "./config/app";
import { employeesRouter } from "./routes/employees";
import { logger } from "./common/logger";
import winston from "winston";
const expressWinston = require("express-winston");
import { createDefaultUser } from "./create_default";
import { expressjwt as jwt } from "express-jwt";
import { authRoute } from "./routes/auth";

app.use(
    jwt({
        secret: APPLICATION_SECRET,
        algorithms: ["HS256"],
    }).unless({ path: ["/token", "/api-docs"] }),
);
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({
            code: 401,
            message: `${err.name}: ${err.message}`,
        });
    } else if (err.name === "SequelizeUniqueConstraintError") {
        res.status(401).json({
            code: 409,
            message: `UniqueConstraintViolation: ${err.message}: The record contains data that already exists for another employee.`,
        });
    } else next(err);
});
app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json(),
        ),
    }),
);
app.use("/token", authRoute);
app.use("/employees", employeesRouter);
app.listen(config.PORT, async () => {
    logger.info(`Listening on http://localhost:${config.PORT}`);
    await createDefaultUser();
});
