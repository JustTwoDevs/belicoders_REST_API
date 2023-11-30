import { Router } from "express";
import {
  register, getProfileById, getRivals, getContests
} from "../../controllers/usersController.js";
import { registerValidator } from "#middlewares/validators/usersValidators.js";

const userRouter = Router();

userRouter.post("/register", registerValidator, register);
userRouter.get("/:userId", getProfileById);
userRouter.get("/:userId/rivals", getRivals);
userRouter.get("/:userId/contests", getContests);

export default userRouter;


