import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV = process.env.NODE_ENV || "dev";

const configDev = {
  // HOST: process.env.DEV_HOST,
  PORT: process.env.DEV_PORT,
  DB_NAME: process.env.DEV_DB_NAME,
  DB_URL: process.env.DEV_DB_URL,
  DB_PASSWORD: process.env.DEV_DB_PASSWORD,
  EMAIL: process.env.DEV_EMAIL,
  EMAIL_API_KEY: process.env.DEV_EMAIL_API_KEY,
  JWT_ACTIVATE: process.env.DEV_JWT_ACTIVATE,
  HOST: process.env.DEV_HOST,
  SERVICE: process.env.DEV_SERVICE,
  CLIENT_URL: process.env.DEV_CLIENT_URL
  // LOCALIQ_API_KEY: process.env.DEV_LOCALIQ_API_KEY,
};

export default configDev;