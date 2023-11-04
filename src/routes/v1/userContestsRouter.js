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
  getUserContestValidator,
  patchContestDraftValidator,
  publishContestValidator,
} from "#middlewares/validators/contestValidators.js";
import { Router } from "express";

const userContestsRouter = Router();

userContestsRouter.get("/", getUserContests);
userContestsRouter.get("/:contestId", getUserContestValidator, getUserContest);
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
