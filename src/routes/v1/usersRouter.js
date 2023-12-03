import { Router } from "express";
import {
  register, getProfileByUsername, getRivals, getContests
} from "../../controllers/usersController.js";
import { registerValidator } from "#middlewares/validators/usersValidators.js";

const userRouter = Router();

userRouter.post("/register", registerValidator, register);
userRouter.get("/:username", getProfileByUsername);
userRouter.get("/:username/rivals", getRivals);
userRouter.get("/:username/contests", getContests);

export default userRouter;


