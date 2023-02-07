import express from "express";
const router = express.Router();

// Routes and Authorizations
import authRoutes from "./routes/auth.route.js";

//	Routes

// Auth Routes
router.use("/auth", authRoutes);

// Undefined Routes
router.route("*").all((req, res) => {
  return res.status(404).json({
    success: false,
    data: "This page doesn't exist!",
  });
});

export default router;
