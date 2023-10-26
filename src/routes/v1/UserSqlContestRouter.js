import { Router } from "express";
import {
  createSqlContest,
  patchSqlContest,
} from "#controllers/sqlContestsController.js";
import { createSqlContestValidator } from "#middlewares/validators/sqlContestsValidator.js";
const UserSqlContestRouter = Router();

UserSqlContestRouter.post("/", createSqlContestValidator, createSqlContest);
UserSqlContestRouter.post("/:rivalId", patchSqlContest);

export default UserSqlContestRouter;
