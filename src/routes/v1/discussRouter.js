import { Router } from "express";
import {
  getDiscussById,
  replieDiscuss,
} from "#controllers/discussController.js";
import authMiddleware from "#middlewares/authorization/authMiddleware.js";

const discussRouter = Router();

discussRouter.get("/:id", getDiscussById);
discussRouter.post("/:id", authMiddleware, replieDiscuss);

export default discussRouter;
