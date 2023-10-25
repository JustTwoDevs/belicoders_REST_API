import { Router } from "express";
import authMiddleWare from "#middlewares/authorization/authMiddleware.js";
import userAlgorithmRivalsRouter from "./userAlgorithmRivalsRouter.js";
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
  changePassword,
);

userRouter.use("/:userId/algorithmRivals", userAlgorithmRivalsRouter);

export default userRouter;
