import dotenv from "dotenv";
dotenv.config({
  path: "./config.env",
});

import express from "express";

import errorHandler from "./middleware/error.middleware.js";
import connectDB from "./config/db.config.js";
import APIRoutes from "./api.js";

// Connect DB
const DB_URI = process.env.DB_URI;
connectDB(DB_URI);

const app = express();
app.use(express.json());

// Serving API Routes
app.use("/healthcheck", (req, res) => {
  return res.sendStatus(200);
});

app.use("/api", APIRoutes);

// Error Handler (Don't put any middleware after this!)
app.use(errorHandler);

// Start Listening
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server has started on PORT: ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
