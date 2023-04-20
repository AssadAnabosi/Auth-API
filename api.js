import express from "express";
const router = express.Router();
import { NOT_FOUND } from "./constants/status.constants.js";

// Routes and Authorizations
import authRoutes from "./routes/auth.route.js";

//	Routes

// Auth Routes
router.use("/auth", authRoutes);

// Undefined Routes
router.route("*").all((req, res) => {
  return res.status(NOT_FOUND).json({
    success: false,
    data: "This page doesn't exist!",
  });
});

export default router;
