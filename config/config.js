// const configDev =require('./config-dev');
// const configProd = require('./config-prod');

// require('dotenv').config();

// let config ={};

// if (process.env.NODE_ENV === 'dev') {
// 	config = { ...configDev };
// } else if (process.env.NODE_ENV === "prod") {
// 	config = { ...configProd };
// }

// module.exports =  config;

import dotenv from "dotenv";
dotenv.config();
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV = process.env.NODE_ENV || "prod";

import configDev from "./config.dev.js";
import configProd from "./config.prod.js";

let config = {};

if (ENV.trim() === "dev") {
   config = { ...configDev };
} else {
   config = { ...configProd };
}
//console.log(config);

export default config;
