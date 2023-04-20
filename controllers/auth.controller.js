import User from "../models/User.model.js";
import ResponseError from "../utils/responseError.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import * as statusCode from "../constants/status.constants.js";

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
  try {
    const user = await User.create({
      first_name,
      last_name,
      username,
      email,
      password,
    });
    return sendToken(user, statusCode.CREATED, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  //  making sure that proper fields are provided
  if (!username || !password) {
    return next(new ResponseError("Please provide an email and password", statusCode.BAD_REQUEST));
  }
  try {
    const user = await User.findOne({ username }).select("+password");
    // Invalid Username
    if (!user) {
      return next(new ResponseError("Invalid Credentials", statusCode.BAD_REQUEST));
    }
    // Password Check
    const isMatch = await user.matchPassword(password);
    //  Wrong Password
    if (!isMatch) {
      return next(new ResponseError("Invalid Credentials", statusCode.BAD_REQUEST));
    }
    //  Valid User
    return sendToken(user, statusCode.OK, res);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

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
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  try {
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

    return res.status(statusCode.CREATED).json({
      success: true,
      data: "Password Reset Success",
    });
  } catch (error) {
    return next(error);
  }
};

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  return res.status(statusCode).json({
    success: true,
    token,
  });
};
