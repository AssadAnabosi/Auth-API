import { Router } from "express";
const router = Router();

import * as controller from "../controllers/auth.controller.js";
import catcher from "../middleware/catcher.middleware.js";
import limiter from "../middleware/limiter.middleware.js";

router.post("/login", limiter, catcher(controller.login));

router.post("/refresh", catcher(controller.refresh));

router.post("/register", catcher(controller.register));

router.post("/forgot-password", catcher(controller.forgotPassword));

router.put("/reset-password/:resetToken", catcher(controller.resetPassword));

router.post("/logout", catcher(controller.logout));

export default router;
