import { BAD, OK } from "../../helpers/responseHelper.js";
import user from "../../models/user.js";

export const saveUserDetails = async (req, res, next) => {
  try {
    const {
      number,
      hairColor,
      gender,
      bloodType,
      city,
      zipCode,
      countryCode,
      userId,
      email,
      dob,
      country,
      eyeColor,
      address,
      emergencyContacts,
    } = req.body;
    if (number.length !== 10) {
      return BAD(res, "", "Invalid Number");
    }
    const bloodGroups = ["AB+", "AB-", "O+", "O-", "A+", "A-", "B+", "B-"];
    if (!bloodGroups.includes(bloodType)) {
      return BAD(res, "", "Invalid blood Type");
    }
    const genderGroups = ["M", "F", "O"];
    if (!genderGroups.includes(gender)) {
      return BAD(res, "", "Invalid Gender");
    }
    let updateData = {
      number: number,
      hairColor: hairColor,
      country:country,
      gender:gender,
      dob:dob,
      bloodType:bloodType,
      eyeColor:eyeColor,
      city:city,
      address:address,
      zipCode:zipCode,
      emergencyContacts:emergencyContacts,
    };
    const userDetails = await user.findByIdAndUpdate(userId,updateData,{new:true});
  
    userDetails.password = null;
    userDetails.otp = null;
    userDetails.expTime = null;
    
    return OK(res,userDetails,"Details Update",true);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
