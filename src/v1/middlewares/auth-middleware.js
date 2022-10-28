import Jwt from 'jsonwebtoken';
import config from '../../../config/config.js'


export const loginVerify = async (req,res,next)=>{
  try{
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      const error = new Error("No authentication token attached");
      error.statusCode = 401;
      throw error;
    }
    const token = req.get("Authorization").split(" ")[1];
    const decoded = Jwt.verify(token, config.JWT_ACTIVATE);

    if (!decoded) {
      return res.status(401).json({
        status: false,
        message: "Token expires Please Login",
        data: "",
      });
    }
    const { userId } = decoded;
    req.userId = userId;

    next();

  }catch(error){
    next(error);
  }
}