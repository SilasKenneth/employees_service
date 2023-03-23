import {Sequelize, Transaction} from "sequelize";
import ISOLATION_LEVELS = Transaction.ISOLATION_LEVELS;
import {dbConfig} from "../config/database";

const sequelize = new Sequelize({
    isolationLevel: ISOLATION_LEVELS.READ_COMMITTED,
    dialect: "postgres",
    database: dbConfig.DATABASE_NAME,
    username: dbConfig.DATABASE_USERNAME,
    password: dbConfig.DATABASE_PASSWORD
});


sequelize.authenticate({mapToModel:true}).then(() => {
    console.log("Connection Successful.");
}).catch((reason: any) => {
    console.log(reason.message);
})
export {sequelize as dbConnection};