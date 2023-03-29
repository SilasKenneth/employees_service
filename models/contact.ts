import { UUID } from "crypto";
import { DataTypes, Model, Optional, STRING, UUIDV4 } from "sequelize";
import { dbConnection } from "../common/connection";
import {logger} from "../common/logger";

export interface ContactAttributes {
    contactID: UUID;
    phone: string;
    street: string;
    personalEmail: string;

    workEmail: string;

    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class Contact
    extends Model<
        ContactAttributes,
        Optional<
            ContactAttributes,
            "contactID" | "createdAt" | "updatedAt" | "deletedAt"
        >
    >
    implements ContactAttributes
{
    public readonly contactID!: UUID;
    public readonly createdAt!: Date;
    public readonly deletedAt!: Date;
    public personalEmail!: string;
    public phone!: string;
    public street!: string;
    public readonly updatedAt!: Date;
    public workEmail!: string;
}

Contact.init(
    {
        contactID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        personalEmail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        workEmail: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize: dbConnection,
        paranoid: false,
        tableName: "contacts",
    },
);
