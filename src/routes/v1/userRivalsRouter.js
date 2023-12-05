import { Router } from "express";
import {
  deleteRivalDraft,
  getUserRivalById,
  getUserRivals,
  testRival,
} from "#controllers/rivalsController.js";
import { testRivalValidator } from "#middlewares/validators/rivalsValidators.js";

const userRivalsRouter = Router({ mergeParams: true });

userRivalsRouter.get("/", getUserRivals);
userRivalsRouter.get("/:rivalId", getUserRivalById);
userRivalsRouter.post("/:rivalId", testRivalValidator, testRival);
userRivalsRouter.delete("/:rivalId", deleteRivalDraft);

export default userRivalsRouter;
