import express from "express";
import testController from "../controllers/test/testController.js"
const route = express.Router();

route.get("/",testController);


export default route;