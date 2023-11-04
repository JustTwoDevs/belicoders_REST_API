import { Router } from "express";
import {
  getContests,
  getContestByTitle,
} from "#controllers/contestsController.js";
import { getContestByTitleValidator } from "#middlewares/validators/contestValidators.js";

const contestsRouter = Router();

contestsRouter.get("/", getContests);
contestsRouter.get(
  "/:contestTitle",
  getContestByTitleValidator,
  getContestByTitle,
);

export default contestsRouter;
