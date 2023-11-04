import { Router } from "express";
import {
  createAlgorithmRivalDraft,
  patchAlgorithmRivalDraft,
  publishAlgorithmRival,
} from "#controllers/algorithmRivalsController.js";
const userAlgorithmRivalsRouter = Router({ mergeParams: true });

userAlgorithmRivalsRouter.post("/", createAlgorithmRivalDraft);
userAlgorithmRivalsRouter.patch("/:rivalId", patchAlgorithmRivalDraft);
userAlgorithmRivalsRouter.post("/:rivalId/publish", publishAlgorithmRival);

export default userAlgorithmRivalsRouter;
