import { Router } from "express";
import {
  patchProfile,
  changePassword,
} from "../../controllers/usersController.js";

const userProfileRouter = Router();

userProfileRouter.patch("/", patchProfile);
userProfileRouter.patch(
  "/changePassword",
  changePassword,
);

export default userProfileRouter;
