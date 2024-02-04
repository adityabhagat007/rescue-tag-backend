import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import config from "../../../../config/config.js";
import genOtp from "../../utils/genOtp.js";
import emailText from "../../lib/emailText.js";
import sendEmail from "../../utils/sendEmail.js";
import verifiedEmailText from "../../lib/verifiedEmailText.js";

const signUpController = async (req, res, next) => {
    try {
        const { userName, name, password, email, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(401).json({
                status: false,
                message: "Confirm password does not matched",
                data: "",
            });
        }

        const takenUserName = await User.findOne({ userName: userName });
        if (takenUserName) {
            return res.status(406).json({
                status: false,
                message: "This userName is already taken",
                data: "",
            });
        }

        const alreadyUser = await User.findOne({ email });
        if (alreadyUser) {
            return res.status(406).json({
                status: false,
                message: "This email is already in associate with another profile",
                data: "",
            });
        }

        const otp = genOtp();
        const emailContext = `Thank you for signing up in rescuetag. Please verify your OTP to proceed further`;
        const verificationMail = emailText(otp, name, emailContext);
        const currDate = new Date();
        const expTime = new Date(currDate.getTime() + 30 * 60000);
        let login = {};
        login.name = name;
        login.userName = userName;
        login.password = await bcrypt.hash(password, 12);
        login.email = email.toLowerCase();
        login.otp = otp;
        login.expTime = expTime;

        const signupMail = await sendEmail(
            email,
            "signup otp verification",
            verificationMail
        );
        if (signupMail === false) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong please try again later",
                data: "",
            });
        }
        const createUser = await User.create(login);

        return res.status(200).json({
            status: true,
            message: "Please verify your email",
            data: {
                id: createUser._id,
            },
        });
    } catch (error) {
        next(error);
    }
};

const verifyOtpController = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const newEmail = email.split('@');
        let frontEmailPart = newEmail[0];
        let secondEmailPart = newEmail[1];
        frontEmailPart = frontEmailPart.split('.').join('');

        let newFormatEmail = frontEmailPart + '@' + secondEmailPart;

        const currentUser = await User.findOne({ email: newFormatEmail.toLowerCase() });
       
        if (!currentUser) {
            return res.status(401).json({
                status: false,
                message: "user not found",
                data: "",
            });
        }

        const currentTime = new Date();
        const userLoginTime = currentUser.expTime;
        if (userLoginTime < currentTime) {
            return res.status(401).json({
                status: false,
                message: "otp expired",
                data: "",
            });
        }

        const actualOtp = currentUser.otp;
        if (actualOtp !== otp) {
            return res.status(401).json({
                status: false,
                message: "otp does not match",
                data: "",
            });
        } else {
            currentUser.otp = null;
            currentUser.expTime = null;
            currentUser.verified = true;

            const emailContext = `Your account has been verified.`;
            const verificationMail = verifiedEmailText(currentUser.name, emailContext);

            const signupMail = await sendEmail(
                email,
                "account verified",
                verificationMail
            );

            if (signupMail === false) {
                return res.status(500).json({
                    status: false,
                    message: "Something went wrong please try again later",
                    data: "",
                });
            }

            await currentUser.save();

            res.status(200).json({
                status: true,
                message: "OTP verified",
                data: {
                    email: email,
                },
            });
        }
    } catch (err) {
        next(err);
    }
};

const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const alreadyUser = await User.findOne({
            email: email,
        });

        const notVerifiedUser = alreadyUser.verified;
        if (notVerifiedUser == false) {
            const emailContext = "Please verify your OTP to Procced further";
            const currDate = new Date();
            const expTime = new Date(currDate.getTime() + 30 * 60000);
            const otp = genOtp();
            const text = emailText(otp, alreadyUser.name, emailContext);
            alreadyUser.otp = otp;
            alreadyUser.expTime = expTime;
            await alreadyUser.save();

            const mail = await sendEmail(email, "OTP verification", text);
            return res.status(406).json({
                status: false,
                message: "This account is not verified please verify your OTP",
                data: "",
            });
        }

        if (!alreadyUser) {
            return res.status(406).json({
                status: false,
                message: "user not found",
                data: "",
            });
        }

        const matchedPassword = await bcrypt.compare(
            password,
            alreadyUser.password
        );
        if (!matchedPassword) {
            return res.status(406).json({
                status: false,
                message: "invalid password",
                data: "",
            });
        }

        const token = Jwt.sign(
            { email: email, id: alreadyUser._id },
            config.JWT_ACTIVATE,
            {
                expiresIn: "7d",
            }
        );
        const loginDetails = { ...alreadyUser._doc };
        delete loginDetails.password;
        delete loginDetails.otp;
        delete loginDetails.expTime;

        return res.status(200).json({
            status: true,
            message: "welcome to rescuetag",
            data: {
                token: token,
                loginDetails,
            },
        });
    } catch (err) {
        next(err);
    }
};

const sendResetPasswordEmailController = async (req, res, next) => {
    try {
        const email = req.body.email;

        const oldUser = await User.findOne({
            email: email,
        });

        if (!oldUser) {
            return res.status(400).json({
                status: false,
                message: "user not found",
                data: "",
            });
        }

        if (!oldUser.verified) {
            return res.status(403).json({
                status: false,
                message: "user not verified",
                data: "",
            });
        }

        const otp = genOtp();
        const emailContext = `Please verify your OTP to reset your password.`;
        const verificationMail = emailText(otp, oldUser.name, emailContext);
        const currDate = new Date();
        const expTime = new Date(currDate.getTime() + 30 * 60000);

        const signupMail = await sendEmail(
            email,
            "forget password otp verification",
            verificationMail
        );
        if (signupMail === false) {
            return res.status(500).json({
                status: false,
                message: "Something went wrong please try again later",
                data: "",
            });
        }

        const updateUser = await User.findOneAndUpdate(
            { email: oldUser.email },
            {
                otp: otp,
                expTime: expTime
            },
            { new: true }
        );
        updateUser.save();

        return res.status(200).json({
            status: true,
            message: "forget password email sent successfully",
            data: {
                id: oldUser._id,
            },
        });
    } catch (err) {
        next(err);
    }
};

const resetPasswordController = async (req, res, next) => {
    try {
        const { email, otp, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(401).json({
                status: false,
                message: "confirm password does not matched",
                data: "",
            });
        }

        const newEmail = email.split('@');
        let frontEmailPart = newEmail[0];
        let secondEmailPart = newEmail[1];
        frontEmailPart = frontEmailPart.split('.').join('');
        let newFormatEmail = frontEmailPart + '@' + secondEmailPart;

        const currentUser = await User.findOne({ email: newFormatEmail });

        if (!currentUser) {
            return res.status(200).json({
                status: false,
                message: "user not found",
                data: "",
            });
        }

        const currentTime = new Date();
        const userLoginTime = currentUser.expTime;
        if (userLoginTime < currentTime) {
            return res.status(200).json({
                status: false,
                message: "otp expired",
                data: "",
            });
        }

        const actualOtp = currentUser.otp;
        if (actualOtp !== otp) {
            return res.status(200).json({
                status: false,
                message: "otp does not match",
                data: "",
            });
        } else {
            currentUser.otp = null;
            currentUser.expTime = null;
            currentUser.password = await bcrypt.hash(password, 12);

            const emailContext = `Your password has been reset successfully.`;
            const verificationMail = verifiedEmailText(currentUser.name, emailContext);

            const signupMail = await sendEmail(
                email,
                "reset password successfully",
                verificationMail
            );

            if (signupMail === false) {
                return res.status(500).json({
                    status: false,
                    message: "Something went wrong please try again later",
                    data: "",
                });
            }

            await currentUser.save();

            res.status(200).json({
                status: true,
                message: "reset password successfully",
                data: {
                    email: email,
                },
            });
        }
    } catch (err) {
        next(err);
    }
};

export { signUpController, verifyOtpController, loginController, sendResetPasswordEmailController, resetPasswordController };