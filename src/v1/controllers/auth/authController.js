import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import config from "../../../../config/config.js";
import genOtp from "../../utils/genOtp.js";
import emailText from "../../lib/emailText.js";
import sendEmail from "../../utils/sendemail.js";

const signUpController = async (req, res, next) => {
  try {
    const { userName, name, password, email, confirm_password } = req.body;
    if (password !== confirm_password) {
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
    login.email = email;
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
    const newEmail = email.split("@");
    let frontEmailPart = newEmail[0];
    let secondEmailPart = newEmail[1];
    frontEmailPart = frontEmailPart.split(".").join("");

    let newFormatEmail = frontEmailPart + "@" + secondEmailPart;
    //console.log(newFormatEmail);

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
      currentUser.verified = true;

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
      const emailContext = "Please verify your OTP to Proceed further";
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
      { email: email, userId: alreadyUser._id },
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

const changePasswordController = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.userId;
    if (newPassword !== confirmPassword) {
      return res.status(406).json({
        status: false,
        message: "Confrim password and new password doesnot match",
        data: "",
      });
    }
    let userPassword = await User.findById(userId).select("password");
    userPassword = userPassword.password;
    const checkingOldpassword = await bcrypt.compare(oldPassword, userPassword);
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    if (!checkingOldpassword) {
      return res.status(401).json({
        status: false,
        message: "Wrong Old Password",
        data: "",
      });
    }

    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });

    return res.status(200).json({
      status: true,
      message: "password changed",
      data: "",
    });
  } catch (error) {
    next(error);
  }
};
export {
  signUpController,
  verifyOtpController,
  loginController,
  changePasswordController,
};
