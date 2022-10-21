import User from '../../models/user.js';
import bcrypt, { hash } from 'bcryptjs';

const signUpController = async (req,res,next)=>{
  try{
    const {userName ,name,password,email ,confirm_password} =req.body;
    if(password === confirm_password){
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

    const hashedPassword = await bcrypt.hash(password, 12);

    const createUser = await User.create({
      name: name,
      userName:userName,
      email:email,
      password:hashedPassword,
    })

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