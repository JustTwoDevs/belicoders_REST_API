import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
import mainRouter from "./mainRouter.js";

const app = express();

//Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(json());

//main routers
app.use("/api/v1", mainRouter);

export default app;
