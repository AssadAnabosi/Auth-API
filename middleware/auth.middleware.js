import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ResponseError from "../utils/responseError.js";

export const isLoggedIn = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ");
  }

  if (!token) {
    return next(new ResponseError("Not Authorized To Access This Route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ResponseError("User Can Not Be Found", 404));
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(new ResponseError("Not Authorized To Access This Route", 401));
  }
};
