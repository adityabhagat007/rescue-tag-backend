import User from '../../models/user.js';
import bcrypt from 'bcryptjs';
import genOtp from '../../utils/genOtp.js';
import emailText from '../../lib/emailText.js';
import sendEmail from '../../utils/sendemail.js';

const signUpController = async (req, res, next) => {
  try {
    const { userName, name, password, email, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.status(401).json({
        status: false,
        message: "Confirm password does not matched",
        data: ""
      });
    };

    const takenUserName = await User.findOne({ userName: userName });
    if (takenUserName) {
      return res.status(406).json({
        status: false,
        message: "This userName is already taken",
        data: ""
      });
    };

    const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      return res.status(406).json({
        status: false,
        message: "This email is already in associate with another profile",
        data: "",
      });
    };

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

    const signupMail = await sendEmail(email, 'signup otp verification', verificationMail);
    if (signupMail === false) {
      return res.status(500).json({
        status: false,
        message: "Something went wrong please try again later",
        data: ''
      });
    };
    const createUser = await User.create(login);

    return res.status(200).json({
      status: true,
      message: "Please verify your email",
      data: {
        id: createUser._id
      }
    });

  } catch (error) {
    next(error);
  };
};

const verifyOtpController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const currentUser = await User.findOne({ email: email });
    
    if (!currentUser) {
      return res.status(200).json({
        status: false,
        message: "user not found",
        data: ""
      });
    };
    
    const currentTime = new Date();
    const userLoginTime = currentUser.expTime;
    if (userLoginTime < currentTime) {
      return res.status(200).json({
        status: false,
        message: "otp expired",
        data: ""
      });
    }

    const actualOtp = currentUser.otp;
    if (actualOtp !== otp) {
      return res.status(200).json({
        status: false,
        message: "otp does not match",
        data: ""
      });
    } else {
      currentUser.otp = null;
      currentUser.expTime = null;
      currentUser.verified = true;

      await currentUser.save();
      res.status(200).json({
        status: true,
        message: "otp verified",
        data: {
          email: email,
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

export { signUpController, verifyOtpController };