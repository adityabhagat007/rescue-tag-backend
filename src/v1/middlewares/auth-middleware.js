import jwt from "jsonwebtoken";
import { UNAUTHORIZED } from "../helpers/responseHelper";

const checkAuth = (req, res, next) => {
  try {
    // * Checking for Authorization Header
    const auth = req.headers.authorization;

    // * If no Bearer token was passed
    if (!auth || !auth.startsWith("Bearer ")) {
      return ERROR(res,"","Invalid Request")
    }
    // * Parsing the token
    const token = req.get("Authorization").split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACTIVATE);

    // * If the token has expired or invalid
    if (!decoded) {
        return UNAUTHORIZED(res,"","Unauthorized")
    }
    const { id } = decoded;
    req.body.userId = id;
    next();
  } catch (err) {
    next(err);
  }
};

export default checkAuth;