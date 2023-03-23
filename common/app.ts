import express, {Express} from "express";
import {expressjwt as jwt} from "express-jwt";
import dotenv from "dotenv";


dotenv.config();

if (process.env.APPLICATION_SECRET === undefined ) {
    throw new Error('Missing application secret. Please Specify the APPLICATION_SECRET environment variable.');
}
export const app: Express = express();

app.use(express.json());

// app.use(
//     jwt({
//         secret: process.env.APPLICATION_SECRET,
//         algorithms: ["HS256"],
//     }).unless({ path: ["/token"] })
// );