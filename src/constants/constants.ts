import * as dotenv from "dotenv";
dotenv.config();

export const TESTING_ENV = process.env.ENV === "TESTING";
