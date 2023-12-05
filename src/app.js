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
  const errors = [];
  if (err.name === "ValidationError") {
    errors.push({ on: "ValidationErrors", message: err.message });
  }
  if (err.name === "CastError") {
    errors.push({ on: "CastErrors", message: err.message });
  }
  if (
    err.name === "MongoServerError" &&
    err.message.includes("duplicate key")
  ) {
    errors.push({ on: "MongoServerErrors", message: err.message });
  }
  if (errors.length > 0) res.status(422).json({ errors });
  next(err);
});

export default app;
