import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: parseInt(process.env.APPLICATION_PORT ?? '8080'),
}