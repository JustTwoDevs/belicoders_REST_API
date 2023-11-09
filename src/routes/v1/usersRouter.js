import { Router } from "express";
import {
  register, getProfile
} from "../../controllers/usersController.js";
import { registerValidator } from "#middlewares/validators/usersValidators.js";

const userRouter = Router();

userRouter.post("/register", registerValidator, register);
userRouter.get("/", getProfile);

export default userRouter;
