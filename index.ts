import { app, APPLICATION_SECRET } from "./common/app";
import { config } from "./config/app";
import { employeesRouter } from "./routes/employees";
import { logger } from "./common/logger";
import winston from "winston";
const expressWinston = require("express-winston");
import { expressjwt as jwt } from "express-jwt";

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
app.use("/employees", employeesRouter);
app.listen(config.PORT, () => {
    logger.info(`Listening on http://localhost:${config.PORT}`);
});
