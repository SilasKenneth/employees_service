import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: parseInt(process.env.APPLICATION_PORT ?? "8080"),
    LOG_LEVEL: process.env.LOG_LEVEL ?? "debug",
    DEFAULT_APP_USERNAME: process.env.DEFAULT_APP_USERNAME ?? "admin",
    DEFAULT_APP_USER_EMAIL:
        process.env.DEFAULT_APP_USER_EMAIL ?? "admin@employee-service.com",
    DEFAULT_APP_USER_PASSWORD:
        process.env.DEFAULT_APP_USER_PASSWORD ?? "Password@123",
};
