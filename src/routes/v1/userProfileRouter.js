import { Router } from "express";
import {
  patchProfile,
  changePassword,
  getProfile,
} from "../../controllers/usersController.js";

const userProfileRouter = Router();

userProfileRouter.get("/", getProfile);
userProfileRouter.patch("/", patchProfile);
userProfileRouter.patch(
  "/changePassword",
  changePassword,
);

export default userProfileRouter;
