import { Router } from "express";
import authRouter from "./authRouter.js";
import tagRouter from "./tagRouter.js";
import usersRouter from "./usersRouter.js";
import problemsRouter from "./problemsRouter.js";
import recoveryCodesRouter from "./recoveryCodesRouter.js";

const mainRouterV1 = Router();

mainRouterV1.use("/auth", authRouter);
mainRouterV1.use("/tags", tagRouter);
mainRouterV1.use("/users", usersRouter);
mainRouterV1.use("/problems", problemsRouter);
mainRouterV1.use("/recoveryCodes", recoveryCodesRouter);

export default mainRouterV1;
