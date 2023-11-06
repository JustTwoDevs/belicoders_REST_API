import { Router } from "express";
import authMiddleWare from "#middlewares/authorization/authMiddleware.js";
import {
  register,
  getProfile,
  patchProfile,
  changePassword,
} from "../../controllers/usersController.js";
import userIdRouter from "./userIdRouter.js";
import { registerValidator } from "#middlewares/validators/usersValidators.js";

const userRouter = Router();

userRouter.post("/register", registerValidator, register);
// Probablemente hay que meterlo dentro de userIdRouter
userRouter.get("/profile/:userId", authMiddleWare, getProfile);
userRouter.patch("/profile/:userId", authMiddleWare, patchProfile);
userRouter.patch(
  "/profile/:userId/changePassword",
  authMiddleWare,
  changePassword
);

userRouter.use("/:userId", authMiddleWare, userIdRouter);
export default userRouter;
