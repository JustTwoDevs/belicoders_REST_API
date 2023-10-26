import { Router } from "express";
import {
  getUserRivalById,
  getUserRivals,
} from "#controllers/rivalsController.js";

const userRivalsRouter = Router({ mergeParams: true });

userRivalsRouter.get("/", getUserRivals);
userRivalsRouter.get("/:rivalId", getUserRivalById);

export default userRivalsRouter;
