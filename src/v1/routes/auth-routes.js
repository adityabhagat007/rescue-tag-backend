import express from "express";
import { body } from "express-validator";
import {
    signUpController,
    verifyOtpController,
    loginController,
    sendResetPasswordEmailController,
    resetPasswordController
} from "../controllers/auth/authController.js";

const route = express.Router();

route.post(
    "/signup",
    [
        body("name").isLength({ min: 3 }).withMessage("at least three characters"),
        body("userName")
            .isLength({ min: 3 })
            .withMessage("at least three characters"),
        body("email")
            .normalizeEmail()
            .isEmail()
            .withMessage("please enter a valid Email"),
        body("password")
            .isStrongPassword()
            .withMessage("please enter a strong password"),
        body("confirmPassword")
            .exists({ checkFalsy: true })
            .withMessage("You must type a confirmation password")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("The passwords do not match"),
    ],
    signUpController
);

route.post(
    "/verify-otp",
    [body("otp").notEmpty().withMessage("invalid otp")],
    verifyOtpController
);

route.post(
    "/login",
    [
        body("email")
            .normalizeEmail()
            .isEmail()
            .withMessage("please enter a valid Email"),
        body("password").isStrongPassword().withMessage("invalid password"),
    ],
 
    loginController
);

route.post(
    "/forget-password",
    [
        body("email")
            .normalizeEmail()
            .isEmail()
            .withMessage("please enter valid email"),
    ],
   
    sendResetPasswordEmailController
);

route.post(
    "/reset-password",
    [
        body("otp").notEmpty().withMessage("invalid otp"),
        body("password")
            .trim()
            .isStrongPassword()
            .withMessage("please enter strong password")
            .exists({ checkFalsy: true })
            .withMessage("You must type a password"),
        body("confirmPassword")
            .exists({ checkFalsy: true })
            .withMessage("You must type a confirmation password")
            .custom((value, { req }) => value === req.body.password)
            .withMessage("The passwords do not match"),
    ],
    resetPasswordController
);

export default route;