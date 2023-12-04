import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
import mainRouterV1 from "./routes/v1/mainRouterV1.js";
import cookieParser from "cookie-parser";
import "dotenv/config.js";
const app = express();

// Middlewares

app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(json());
app.use(cookieParser());

// main routers
app.use("/api/v1", mainRouterV1);
// Error handling middleware
app.use(function (err, req, res, next) {
  if (err.name === "ValidationError") {
    res.status(400).json({ error: err.message });
  }
  if (err.name === "CastError") {
    res.status(400).json({ error: err.message });
  }
  if (
    err.name === "MongoServerError" &&
    err.message.includes("duplicate key")
  ) {
    res.status(400).json({ error: err.message });
  }
  next(err);
});

export default app;
