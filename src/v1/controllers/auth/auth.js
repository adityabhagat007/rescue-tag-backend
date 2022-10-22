import User from '../../models/user.js';
import bcrypt from 'bcryptjs';
import genOtp from '../../utils/genOtp.js';
import emailText from '../../lib/emailText.js';
import sendEmail from '../../utils/sendemail.js';

const signUpController = async (req,res,next)=>{
  try{
    const {userName ,name,password,email ,confirm_password} =req.body;
    if(password !== confirm_password){
      return res.status(401).json({
        status:false,
        message: "Confirm password doesnot matched",
        data:""
      })
    }

    const takenUserName = await User.findOne({userName:userName});
    if(takenUserName){
      return res.status(406).json({
        status:false,
        message:"This userName is already taken",
        data:""
      })
    }
    const alreadyUser = await User.findOne({email});
    if(alreadyUser){
      return res.status(406).json({
        status:false,
        message:"This email is alreay in associate with another profile",
        data:"",
      })
    }
    const otp = genOtp();
    const emailContext = `Thank you for signing up in the rescuetag Please verify your OTP to procced further`;
    const verificationMail = emailText(otp,name,emailContext);
    const currDate = new Date();
    const expTime = new Date(currDate.getTime() + 30 * 60000);
    let login = {};
    login.name = name;
    login.userName =userName;
    login.password = await bcrypt.hash(password, 12);
    login.email = email;
    login.otp = otp;
    login.expTime = expTime;

    const signupMail = await sendEmail(email,'SignUp otp verification', verificationMail);
    if(signupMail ===false){
      return res.status(500).json({
        status:false,
        message:"Something went wrong please try again later",
        data:''
      })
    }
    const createUser = await User.create(login)

    return res.status(200).json({
      status:true,
      message:"Please verify your email",
      data:{
        id:createUser._id
      }
    })
    
  }catch(error){
    next(error);
  }
}




export {signUpController}