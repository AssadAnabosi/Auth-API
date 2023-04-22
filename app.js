import express from "express";
import cookieParser from "cookie-parser";

import errorHandler from "./middleware/error.middleware.js";
import APIRoutes from "./api.js";
import { OK } from "./constants/status.constants.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Serving API Routes
app.use("/health", (req, res) => {
  return res.sendStatus(OK);
});

app.use("/api", APIRoutes);

// Error Handler (Don't put any middleware after this!)
app.use(errorHandler);

export default app;