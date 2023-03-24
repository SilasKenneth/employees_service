import { Sequelize, Transaction } from "sequelize";
import ISOLATION_LEVELS = Transaction.ISOLATION_LEVELS;
import { dbConfig } from "../config/database";
import { logger } from "./logger";

const sequelize = new Sequelize({
    isolationLevel: ISOLATION_LEVELS.READ_COMMITTED,
    dialect: "postgres",
    host: dbConfig.DATABASE_HOST,
    port: dbConfig.DATABASE_PORT,
    database: dbConfig.DATABASE_NAME,
    username: dbConfig.DATABASE_USERNAME,
    password: dbConfig.DATABASE_PASSWORD,
});

sequelize
    .authenticate({ mapToModel: true })
    .then(() => {
        logger.info("Connection Successful.");
    })
    .catch((reason: Error) => {
        logger.error(reason);
    });
export { sequelize as dbConnection };
