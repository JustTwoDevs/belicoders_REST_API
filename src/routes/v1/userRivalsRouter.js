import { Router } from "express";
import { createRivalDraft } from "../../controllers/rivalsController";

const userRivalsRouter = Router();

userRivalsRouter.post("/", createRivalDraft);

export default userRivalsRouter;
