import { Router } from "express";
import {
  createSqlRivalDraft,
  publishSqlRival,
  patchSqlRivalDraft,
  dropSqlRival,
} from "#controllers/sqlRivalsController.js";
import patchSqlRivalMiddleware from "#middlewares/sqlRival/patchSqlRivalMiddleware.js";
import publishSqlRivalMiddleware from "#middlewares/sqlRival/publishSqlRivalMiddleware.js";

const userSqlRivalRouter = Router();

userSqlRivalRouter.post("/", createSqlRivalDraft);
userSqlRivalRouter.post("/:id", publishSqlRivalMiddleware, publishSqlRival);
userSqlRivalRouter.patch("/:id", patchSqlRivalMiddleware, patchSqlRivalDraft);
userSqlRivalRouter.delete("/:id", dropSqlRival);

export default userSqlRivalRouter;
