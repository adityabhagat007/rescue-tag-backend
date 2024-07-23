import { Router } from "express";
import { body } from "express-validator";
import checkAuth from "../middlewares/auth-middleware.js";
import {
  getUserDetails,
  saveUserDetails,
} from "../controllers/auth/userContoller.js";

const route = Router();

route.post(
  "/save-user-details",
  checkAuth,
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("name").isLength({ min: 3 }).withMessage("Invalid Name"),
    body("number").isLength({ min: 10, max: 10 }).withMessage("Invalid Number"),
    body("zipCode")
      .isLength({ min: 6, max: 6 })
      .withMessage("Invalid Zip Code"),
  ],
  saveUserDetails
);
route.get("/get-user-details", checkAuth, getUserDetails);

export default route;
