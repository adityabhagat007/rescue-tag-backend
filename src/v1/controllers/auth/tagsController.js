import  QRCode  from "qrcode";
import { OK } from "../../helpers/responseHelper.js";


export const getDataFromTag = async() =>{
    try{
        

    }catch(err){
        console.log(err);
    }
}

export const createTagController = async (req,res,next)=>{
    try{
      const {name,tagType,userId,email} = req.body;
      //const link = `${config.CLIENT_URL}/tag/${}`
      //const tag = await QRCode.toDataURL(link);
      
      console.log(tag);
      OK(res,tag,"Scan Now");
    }catch(err){
        console.log(err);
        next(err);
    }
}