import { Router } from "express";
import { body } from "express-validator";
import checkAuth from "../middlewares/auth-middleware.js";
import { saveUserDetails } from "../controllers/auth/userContoller.js";

const route = Router();

route.post("/user-details", checkAuth, saveUserDetails);

export default route;