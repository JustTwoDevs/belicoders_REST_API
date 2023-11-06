import { Router } from "express";
import {
  getDiscussById,
  replieDiscuss,
  deleteDiscuss,
  editDiscuss,
} from "#controllers/discussController.js";
import authMiddleware from "#middlewares/authorization/authMiddleware.js";

const discussRouter = Router();

discussRouter.get("/:id", authMiddleware, getDiscussById);
discussRouter.post("/:id", authMiddleware, replieDiscuss);
discussRouter.delete("/:id", authMiddleware, deleteDiscuss);
discussRouter.put("/:id", authMiddleware, editDiscuss);

export default discussRouter;
