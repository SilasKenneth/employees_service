import { randomUUID, UUID } from "crypto";
import { Contact, ContactAttributes } from "./contact";
import { DataTypes, Model, Optional, UUIDV4 } from "sequelize";
import { dbConnection } from "../common/connection";
import { logger } from "../common/logger";

export interface EmployeeAttributes {
    empID: string;
    fullName: string;
    gender: Gender;

    department: Department;
    hireDate: Date;

    contactID?: string;
    jobTitle: JobTitle;

    dateOfBirth: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export interface EmployeeOutput {
    fullName?: string;
    department: Department;
    // Contact?: Optional<Contact, 'contactID' | 'createdAt' | 'deletedAt' | 'updatedAt'>
}

export enum Gender {
    Male = "Male",
    Female = "Female",
    UnknownFutureValue = "UnknownFutureValue",
}
export enum Department {
    Engineering = "Engineering",
    Sales = "Sales",
    Marketing = "Marketing",
    Design = "Design",
    HR = "HR",
    UnknownFutureValue = "UnknownFutureValue",
}

export enum JobTitle {
    Software_Engineer = "Software Engineer",
    UX_Designer = "UX Designer",
    CEO = "CEO",
    CTO = "CTO",
    CFO = "CFO",
    UnknownFutureValue = "UnknownFutureValue",
}
export class Employee
    extends Model<
        EmployeeAttributes,
        Optional<
            EmployeeAttributes,
            "empID" | "createdAt" | "updatedAt" | "deletedAt"
        >
    >
    implements EmployeeAttributes
{
    public contactID: string | undefined;
    public department!: Department;
    public gender!: Gender;
    public dateOfBirth!: Date;
    public empID!: string;
    public fullName!: string;
    public hireDate!: Date;
    public jobTitle!: JobTitle;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Employee.init(
    {
        contactID: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        empID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            primaryKey: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: Object.values(Gender),
        },
        jobTitle: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: Object.values(JobTitle),
        },
        hireDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        department: {
            type: DataTypes.ENUM,
            values: Object.values(Department),
        },
    },
    { sequelize: dbConnection, paranoid: true, tableName: "employees" },
);

Employee.belongsTo(Contact, { foreignKey: "contactID" });
dbConnection.sync({}).then((r) => {
    logger.info("Sync Success!");
});
