import { Router } from "express";
import { createAlgorithmRivalDraft } from "#controllers/algorithmRivalsController.js";
const userAlgorithmRivalsRouter = Router();

userAlgorithmRivalsRouter.post("/", createAlgorithmRivalDraft);

export default userAlgorithmRivalsRouter;
