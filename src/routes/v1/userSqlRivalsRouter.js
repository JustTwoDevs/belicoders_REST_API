import { Router } from "express";
import {
  createSqlRivalDraft,
  publishSqlRival,
  patchSqlRivalDraft,
  dropSqlRival,
  compareUserSolution
} from "#controllers/sqlRivalsController.js";
import {
  publishSqlRivalValidator,
  patchSqlRivalValidator,
} from "#middlewares/validators/sqlRivalsValidator.js";

const userSqlRivalRouter = Router();

userSqlRivalRouter.post("/", createSqlRivalDraft);
userSqlRivalRouter.post("/:rivalId", publishSqlRivalValidator, publishSqlRival);
userSqlRivalRouter.patch(
  "/:rivalId",
  patchSqlRivalValidator,
  patchSqlRivalDraft,
);
userSqlRivalRouter.delete("/:rivalId", dropSqlRival);
userSqlRivalRouter.post("/submit", compareUserSolution);

export default userSqlRivalRouter;
