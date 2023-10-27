import { Router } from "express";
import authRouter from "./authRouter.js";
import tagRouter from "./tagRouter.js";
import usersRouter from "./usersRouter.js";
import contestsRouter from "./contestsRouter.js";
import rivalsRouter from "./rivalsRouter.js";
import algorithmRivalsRouter from "./algorithmRivalsRouter.js";
import sqlRivalsRouter from "./sqlRivalsRouter.js";
import recoveryCodesRouter from "./recoveryCodesRouter.js";
import sqlDatabaseRouter from "./sqlDatabasesRouter.js";
import discussRouter from "./discussRouter.js";

const mainRouterV1 = Router();

mainRouterV1.use("/auth", authRouter);
mainRouterV1.use("/tags", tagRouter);
mainRouterV1.use("/users", usersRouter);
mainRouterV1.use("/contests", contestsRouter);
mainRouterV1.use("/rivals", rivalsRouter);
mainRouterV1.use("/algorithmRivals", algorithmRivalsRouter);
mainRouterV1.use("/sqlRivals", sqlRivalsRouter);
mainRouterV1.use("/recoveryCodes", recoveryCodesRouter);
mainRouterV1.use("/databases", sqlDatabaseRouter);
mainRouterV1.use("/discuss", discussRouter);

export default mainRouterV1;
