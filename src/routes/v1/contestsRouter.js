import { Router } from "express";
import {
  getContests,
  getContestByTitle,
} from "#controllers/contestsController.js";

const contestsRouter = Router();

contestsRouter.get("/", getContests);
contestsRouter.get("/:contestTitle", getContestByTitle);

export default contestsRouter;
