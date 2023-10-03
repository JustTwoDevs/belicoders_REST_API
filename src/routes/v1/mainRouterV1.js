import { Router } from "express";
import authRouter from "./authRouter.js";
import usersRouter from "./usersRouter.js";
import problemsRouter from "./problemsRouter.js";

const mainRouterV1 = Router();

mainRouterV1.use("/auth", authRouter);
mainRouterV1.use("/users", usersRouter);
mainRouterV1.use("/problems", problemsRouter);

export default mainRouterV1;
