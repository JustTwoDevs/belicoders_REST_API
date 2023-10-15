import { Router } from "express";
import {
  publishProblem,
  createProblemDraft,
  getProblemById,
  getProblems,
  patchProblemDraft,
  createTestCases,
} from "../../controllers/problemsController.js";

const problemsRouter = Router();

problemsRouter.get("/", getProblems);

problemsRouter.get("/:problemId", getProblemById);

problemsRouter.post("/:problemId/publish", publishProblem);

problemsRouter.post("/", createProblemDraft);

problemsRouter.post("/:problemId/testCases", createTestCases);

problemsRouter.patch("/:problemId", patchProblemDraft);

export default problemsRouter;
