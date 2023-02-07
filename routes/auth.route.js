import express from "express";

import * as controller from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/register").post(controller.register);

router.route("/login").post(controller.login);

router.route("/forgotpassword").post(controller.forgotPassword);

router.route("/resetpassword/:resetToken").put(controller.resetPassword);

export default router;
