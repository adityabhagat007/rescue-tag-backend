
import sendgrid from "@sendgrid/mail";
import config from "../../../config/config.js";
sendgrid.setApiKey(config.EMAIL_API_KEY);

 const sendEmail = async (email,subject,html) =>{
  try{
    const msg = {
      to: email,
      from: config.EMAIL,
      subject: subject,
      html: html,
    }
    const mail = await sendgrid.send(msg);
    if(mail){
      return mail;
    }else{
      return false;
    }
  }catch(error){
    console.log(error);
  }
}

export default sendEmail;