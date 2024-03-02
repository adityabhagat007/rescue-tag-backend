import { OK } from "../../helpers/responseHelper.js";


export const saveUserDetails = (req,res,next) =>{
    try{
        const {} =req.body;


        return OK(res,"test","Success");
    }catch(err){
        console.log(err);
        next(err);
    }
} 