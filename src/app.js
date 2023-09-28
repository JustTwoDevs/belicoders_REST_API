import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
import mainRouterV1 from "./routes/v1/mainRouterV1.js";

const app = express();

// Middlewares

app.use(morgan("dev"));
app.use(cors());
app.use(json());

// main routers
app.use("/api/v1", mainRouterV1);

export default app;
