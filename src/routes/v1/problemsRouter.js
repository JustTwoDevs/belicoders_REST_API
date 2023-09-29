import { Router } from "express";
import {
  PublishProblem,
  createProblemDraft,
  getProblemById,
  getProblems,
  patchProblemDraft,
} from "../../controllers/problemsController.js";

const problemsRouter = Router();

problemsRouter.get("/", getProblems);

problemsRouter.get("/:problemId", getProblemById);

problemsRouter.post("/", createProblemDraft);

problemsRouter.patch("/", patchProblemDraft);

problemsRouter.post("/publish", PublishProblem);

export default problemsRouter;
