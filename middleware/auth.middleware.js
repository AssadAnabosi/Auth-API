import jwt from "jsonwebtoken";
import User from "../models/User.js";
import * as statusCode from "../constants/status.constants.js";

export const isLoggedIn = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(statusCode.NOT_AUTHENTICATED).json({
      success: false,
      message: "Not Authenticated To Access This Route",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: "User Can Not Be Found",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    // JWT Expired
    return res.status(statusCode.NOT_AUTHENTICATED).json({
      success: false,
      message: "Not Authenticated To Access This Route",
    });
  }
};
