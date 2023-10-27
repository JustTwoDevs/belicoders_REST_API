import { Router } from "express";
import {
  deleteRivalDraft,
  getUserRivalById,
  getUserRivals,
} from "#controllers/rivalsController.js";

const userRivalsRouter = Router({ mergeParams: true });

userRivalsRouter.get("/", getUserRivals);
userRivalsRouter.get("/:rivalId", getUserRivalById);
userRivalsRouter.delete("/:rivalId", deleteRivalDraft);

export default userRivalsRouter;
