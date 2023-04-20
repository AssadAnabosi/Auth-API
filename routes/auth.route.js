import express from "express";
const router = express.Router();

import * as controller from "../controllers/auth.controller.js";
import limiter from "../middleware/limiter.middleware.js";

router.route("/").post(limiter, controller.login);

router.route("/register").post(controller.register);

router.route("/forgot-password").post(controller.forgotPassword);

router.route("/reset-password/:resetToken").put(controller.resetPassword);

export default router;
