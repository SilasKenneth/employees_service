import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";
import { dbConnection } from "../common/connection";
import {logger} from "../common/logger";

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    userId: string;
    username: string;
    email: string;
    password: string;
}
User.init(
    {
        userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            // Emails are supposed to be case-insensitive.
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },

    {
        tableName: "users",
        paranoid: true,
        sequelize: dbConnection,
    },
);

dbConnection.sync({}).then((r) => {
    logger.info("Sync Success!");
});
