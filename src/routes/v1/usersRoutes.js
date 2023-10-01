import { Router } from "express";
import {
  register,
  getProfile,
  patchProfile,
} from "../../controllers/usersController.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.get("/profile/:id", getProfile);
userRouter.patch("/profile/:id", patchProfile);

export default userRouter;
