import { Router } from "express";
import authRouter from "./authRouter.js";
import tagRouter from "./tagRouter.js";
import usersRouter from "./usersRouter.js";
import contestsRouter from "./contestsRouter.js";
import rivalsRouter from "./rivalsRouter.js";
import algorithmRivalsRouter from "./algorithmRivalsRouter.js";
import sqlRivalsRouter from "./sqlRivalsRouter.js";
import recoveryCodesRouter from "./recoveryCodesRouter.js";
import discussRouter from "./discussRouter.js";
import runCodeRouter from "./runCodeRouter.js";
import authMiddleware from "#middlewares/authorization/authMiddleware.js";
import userResourcesRouter from "./userResourcesRouter.js";

const mainRouterV1 = Router();

mainRouterV1.use("/auth", authRouter);
mainRouterV1.use("/tags", tagRouter);
mainRouterV1.use("/users", usersRouter);
mainRouterV1.use("/contests", contestsRouter);
mainRouterV1.use("/rivals", rivalsRouter);
mainRouterV1.use("/algorithmRivals", algorithmRivalsRouter);
mainRouterV1.use("/sqlRivals", sqlRivalsRouter);
mainRouterV1.use("/recoveryCodes", recoveryCodesRouter);
mainRouterV1.use("/discuss", discussRouter);
mainRouterV1.use("/runCode", runCodeRouter);
mainRouterV1.use(authMiddleware, userResourcesRouter);
export default mainRouterV1;
