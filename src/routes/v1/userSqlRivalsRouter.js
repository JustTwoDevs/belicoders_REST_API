import { Router } from "express";
import {
  createSqlRivalDraft,
  publishSqlRival,
  patchSqlRivalDraft,
  dropSqlRival, 
  getSqlRivals
} from "#controllers/sqlRivalsController.js";
import {
  publishSqlRivalValidator,
  patchSqlRivalValidator,
} from "#middlewares/validators/sqlRivalsValidator.js";

const userSqlRivalRouter = Router();

userSqlRivalRouter.get("/", getSqlRivals);
userSqlRivalRouter.post("/", createSqlRivalDraft);
userSqlRivalRouter.post("/:rivalId", publishSqlRivalValidator, publishSqlRival);
userSqlRivalRouter.patch( "/:rivalId",
  patchSqlRivalValidator,
  patchSqlRivalDraft,
);
userSqlRivalRouter.delete("/:rivalId", dropSqlRival);


export default userSqlRivalRouter;
