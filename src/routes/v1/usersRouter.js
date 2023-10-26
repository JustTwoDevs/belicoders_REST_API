import { Router } from "express";
import authMiddleWare from "#middlewares/authorization/authMiddleware.js";
import userAlgorithmRivalsRouter from "./userAlgorithmRivalsRouter.js";
import userSqlRivalRouter from "./userSqlRivalsRouter.js";
import UserSqlContestRouter from "./UserSqlContestRouter.js";
import {
  register,
  getProfile,
  patchProfile,
  changePassword,
} from "../../controllers/usersController.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.get("/profile/:userId", authMiddleWare, getProfile);
userRouter.patch("/profile/:userId", authMiddleWare, patchProfile);
userRouter.patch(
  "/profile/:userId/changePassword",
  authMiddleWare,
  changePassword
);

userRouter.use("/:userId/algorithmRivals", userAlgorithmRivalsRouter);
userRouter.use("/:userId/sqlRivals", userSqlRivalRouter);
userRouter.use("/:userId/sqlContests", UserSqlContestRouter)

export default userRouter;
