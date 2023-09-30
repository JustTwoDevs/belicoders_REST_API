import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
import mainRouterV1 from "./routes/v1/mainRouterV1.js";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares

app.use(morgan("dev"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(json());
app.use(cookieParser());

// main routers
app.use("/api/v1", mainRouterV1);

export default app;
