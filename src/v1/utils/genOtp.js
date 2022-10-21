import {nanoid} from "nanoid"
import {customAlphabet} from "nanoid"
const genOtp = () => {
  const otp = customAlphabet("1234567890",6);
  return otp;
}

export default genOtp();