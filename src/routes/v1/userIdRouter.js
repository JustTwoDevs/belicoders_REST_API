import { Router } from "express";
import userRivalsRouter from "./userRivalsRouter.js";
import userAlgorithmRivalsRouter from "./userAlgorithmRivalsRouter.js";
import userSqlRivalRouter from "./userSqlRivalsRouter.js";
import userContestsRouter from "./userContestsRouter.js";

const userIdRouter = Router();

userIdRouter.use("/rivals", userRivalsRouter);
userIdRouter.use("/algorithmRivals", userAlgorithmRivalsRouter);
userIdRouter.use("/sqlRivals", userSqlRivalRouter);
userIdRouter.use("/contests", userContestsRouter);

export default userIdRouter;
