import User from "../models/User.model.js";
import Session from "../models/Session.model.js";
import ResponseError from "../utils/responseError.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as statusCode from "../constants/status.constants.js";
import cookieOptions from "../utils/cookieOptions.js";
import requestIP from "../utils/ip.js";

export const register = async (req, res, next) => {
  const { first_name, last_name, username, email, password } = req.body;
  //  making sure that proper fields are provided
  if (!first_name || !last_name || !username || !email || !password) {
    return next(
      new ResponseError(
        "Please provide first and last names, username, email, and password",
        statusCode.BAD_REQUEST
      )
    );
  }
  //  Register User

  const user = await User.create({
    first_name,
    last_name,
    username,
    email,
    password,
  });
  return await genRefreshTokenAndSendTokens(user, req, res);
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  //  making sure that proper fields are provided
  if (!username || !password) {
    return res.status(statusCode.BAD_REQUEST).json({ success: false, message: "Please provide an email and password" });
  }

  // find user by username (lowercase)
  const user = await User.findOne({ username: username.toLowerCase() }).select("+password");
  // Invalid Username
  if (!user) {
    return res.status(statusCode.BAD_REQUEST).json({ success: false, message: "Invalid Credentials" });
  }
  // Password Check
  const isMatch = await user.matchPassword(password);
  //  Wrong Password
  if (!isMatch) {
    return res.status(statusCode.BAD_REQUEST).json({ success: false, message: "Invalid Credentials" });
  }
  //  Valid User
  return await genRefreshTokenAndSendTokens(user, req, res,);
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  //  making sure that proper fields are provided
  if (!refreshToken) {
    return res.status(statusCode.UNPROCESSABLE_ENTITY).json({ success: false, message: "You are not Logged In" });
  }
  try {
    //  Verify Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    //  Find Session
    const session = await Session.findOne({ token: refreshToken }).lean();
    //  Session was deleted - logout already
    if (!session) {
      return res.status(statusCode.UNPROCESSABLE_ENTITY).json({ success: false, message: "Invalid Refresh Token" });
    }
    //  Find User
    const user = await User.findById(decoded.id);
    // User was deleted
    if (!user) {
      return res.status(statusCode.UNPROCESSABLE_ENTITY).json({ success: false, message: "Something went wrong" });
    }
    //  Valid User
    return sendTokens(user, res);
  } catch (error) {
    // Invalid Refresh Token // Refresh Token Expired
    return res.status(statusCode.NOT_ACCEPTABLE).json({ success: false, message: "Invalid Refresh Token" });
  }

};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  //  making sure that proper fields are provided
  if (!refreshToken) {
    return res.status(statusCode.UNPROCESSABLE_ENTITY).json({ success: false, message: "You are not Logged In" });
  }
  try {
    //  Verify Refresh Token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    //  Find Session
    await Session.findOneAndDelete({ token: decoded.id });
    //  Clear Cookies
    res.clearCookie("refreshToken", cookieOptions());
  }
  catch (error) {
    // Invalid Refresh Token // Refresh Token Expired
    return res.status(statusCode.NOT_ACCEPTABLE).json({ success: false, message: "Invalid Token" });
  }
};


export const forgotPassword = async (req, res, next) => {
  const { username } = req.body;

  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    // User can't be found, therefor no email will be sent
    return res.sendStatus(statusCode.ACCEPTED);
  }

  const resetToken = user.getResetPasswordToken();

  await user.save();

  const resetURL = `${process.env.URL}/resetpassword/${resetToken}`;
  const message = `
            <h3>Hi ${user.first_name},</h3>
            <p>There was a request to change your password!</p>
            <p>If you did not make this request then please ignore this email.</p>
            <p>Otherwise, please click <a href="${resetURL}" clicktracking=off>this link</a> to change your password.</p>
            <p>Or, you can copy and paste this link to your browser:</p>
            <p><a href="${resetURL}" clicktracking=off>${resetURL}</a></p>
        `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });
    //  User found and an was email sent to user
    return res.sendStatus(statusCode.ACCEPTED);
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await User.save();
    return next(new ResponseError("Email could not be sent", statusCode.INTERNAL_SERVER_ERROR));
  }
};

export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ResponseError("Invalid Reset Token", statusCode.BAD_REQUEST));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save();
  // force logout all sessions
  await Session.deleteMany({ user: user._id });
  res.clearCookie("refreshToken", cookieOptions());
  return res.status(statusCode.CREATED).json({
    success: true,
    message: "Password Reset Success",
  });
};

//  Helper Functions

const sendTokens = (user, res) => {
  const accessToken = user.getSignedToken(process.env.JWT_ACCESS_TOKEN_EXPIRE);
  return res.status(statusCode.OK).json({
    success: true,
    accessToken: accessToken,
  });
};

const genRefreshTokenAndSendTokens = async (user, req, res) => {
  const refreshToken = await user.getRefreshToken(requestIP(req));
  res.cookie("refreshToken", refreshToken, cookieOptions(process.env.JWT_REFRESH_TOKEN_EXPIRE));
  return sendTokens(user, res);
};