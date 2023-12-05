import {
  createContestDraft,
  deleteContestDraft,
  getUserContest,
  getUserContests,
  patchContestDraft,
  publishContest,
} from "#controllers/contestsController.js";
import {
  createContestDraftValidator,
  deleteContestDraftValidator,
  patchContestDraftValidator,
  publishContestValidator,
} from "#middlewares/validators/contestValidators.js";
import { Router } from "express";

const userContestsRouter = Router();

userContestsRouter.get("/", getUserContests);
userContestsRouter.get("/:contestId", getUserContest);
userContestsRouter.post("/", createContestDraftValidator, createContestDraft);
userContestsRouter.post(
  "/:contestId/publish",
  publishContestValidator,
  publishContest,
);
userContestsRouter.patch(
  "/:contestId",
  patchContestDraftValidator,
  patchContestDraft,
);
userContestsRouter.delete(
  "/:contestId",
  deleteContestDraftValidator,
  deleteContestDraft,
);

export default userContestsRouter;
