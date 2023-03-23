import dotenv from "dotenv";

dotenv.config();

const config  = {
    DATABASE_USERNAME: process.env.DATABASE_USERNAME ?? 'pguser',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? 'Password@123',
    DATABASE_NAME: process.env.DATABASE_NAME ?? 'employees'
};

export {config as dbConfig};