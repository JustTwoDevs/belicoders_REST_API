import { Router } from "express";
import userRivalsRouter from "./userRivalsRouter.js";
import userAlgorithmRivalsRouter from "./userAlgorithmRivalsRouter.js";
import userSqlRivalRouter from "./userSqlRivalsRouter.js";
import userContestsRouter from "./userContestsRouter.js";

const userResourcesRouter = Router();

userResourcesRouter.use("/myRivals", userRivalsRouter);
userResourcesRouter.use("/myAlgorithmRivals", userAlgorithmRivalsRouter);
userResourcesRouter.use("/mySqlRivals", userSqlRivalRouter);
userResourcesRouter.use("/myContests", userContestsRouter);

export default userResourcesRouter;
