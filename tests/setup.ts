import { config } from "../config/app";

export const defaultUser = {
    email: config.DEFAULT_APP_USER_EMAIL,
    password: config.DEFAULT_APP_USER_PASSWORD,
};

export const BASE_URL = `http://localhost:${config.PORT}`;
