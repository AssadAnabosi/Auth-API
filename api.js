import express from "express";
const router = express.Router();
import { NOT_FOUND, OK } from "./constants/status.constants.js";

// Routes and Authorizations
import authRoutes from "./routes/auth.routes.js";

//	Routes

//  Health Check route, used for monitoring
router.use("/health", (req, res) => {
  return res.sendStatus(OK);
});

//  Auth Routes
router.use("/auth", authRoutes);

//  Undefined Routes
router.route("*").all((req, res) => {
  return res.status(NOT_FOUND).json({
    success: false,
    message: "Oops, you have reached an undefined route, please check your request and try again",
  });
});

export default router;
