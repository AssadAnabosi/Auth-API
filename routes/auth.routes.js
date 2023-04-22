import { Router } from "express";
const router = Router();

import * as controller from "../controllers/auth.controller.js";
import limiter from "../middleware/limiter.middleware.js";

router.post("/login", limiter, controller.login);

router.post("/refresh", controller.refresh);

router.post("/register", controller.register);

router.post("/forgot-password", controller.forgotPassword);

router.put("/reset-password/:resetToken", controller.resetPassword);

router.post("/logout", controller.logout);

export default router;
