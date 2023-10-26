import { Router } from "express";
import { createSqlContest, patchSqlContest } from "#controllers/sqlContestsController.js";
import { validation } from "#middlewares/sqlContest/validations.js";
const UserSqlContestRouter = Router();

UserSqlContestRouter.post("/", validation,  createSqlContest);
UserSqlContestRouter.post("/:rivalId", patchSqlContest);

export default UserSqlContestRouter;
