import jwt from "jsonwebtoken";
import { UNAUTHORIZED ,BAD } from "../helpers/responseHelper.js";
import config from "../../../config/config.js";

const checkAuth = (req, res, next) => {
  try {
    // * Checking for Authorization Header
    const auth = req.headers.authorization;

    // * If no Bearer token was passed
    if (!auth || !auth.startsWith("Bearer ")) {
      return BAD(res,"","Invalid Request")
    }
    // * Parsing the token
    const token = req.get("Authorization").split(" ")[1];

    const decoded = jwt.verify(token, config.JWT_ACTIVATE);

    // * If the token has expired or invalid
    if (!decoded) {
        return UNAUTHORIZED(res,"","Unauthorized")
    }
    const { id ,email } = decoded;
    req.body.userId = id;
    req.body.email = email;
    next();
  } catch (err) {
    next(err);
  }
};

export default checkAuth;