// require('dotenv').config()

// const config = {
// 	host: process.env.HOST,
// 	DB_URI: process.env.DB_URI,
// 	port: process.env.PORT,
// 	email: process.env.EMAIL,
// 	password: process.env.PASSWORD,
// }

// module.exports = config

import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV = process.env.NODE_ENV || "prod";

const configProd = {
   //HOST: process.env.PROD_HOST,
   PORT: process.env.PROD_PORT,
   DB_NAME: process.env.PROD_DB_NAME,
   DB_URL: process.env.PROD_DB_URL,
   DB_PASSWORD: process.env.PROD_DB_PASSWORD,
   EMAIL:process.env.PROD_EMAIL,
   PASSWORD:process.env.PROD_PASSWORD,
   JWT_ACTIVATE:process.env.PROD_JWT_ACTIVATE,
   LOCALIQ_API_KEY:process.env.PROD_LOCALIQ_API_KEY
};

export default configProd;