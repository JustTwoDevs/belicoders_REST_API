import { Router } from "express";
import {
  createProblem,
  getProblems,
} from "../../controllers/problemsController.js";

const problemsRouter = Router();

problemsRouter.get("/", getProblems);

problemsRouter.post("/", createProblem);

export default problemsRouter;
