import { Router } from "express";
import {
  getRivals,
  createDiscuss,
  getRivalByTitle,
  submission,
  getSubmissions,
  getLastSubmission,
} from "#controllers/rivalsController.js";
import authMiddleware from "#middlewares/authorization/authMiddleware.js";

const rivalsRouter = Router();

rivalsRouter.get("/", getRivals);
rivalsRouter.get("/:rivalTitle", authMiddleware, getRivalByTitle);
rivalsRouter.post("/:rivalTitle/discuss", authMiddleware, createDiscuss);
rivalsRouter.post("/:rivalTitle/submission", authMiddleware, submission);
rivalsRouter.get("/:rivalId/submission", authMiddleware, getSubmissions);
rivalsRouter.get("/:rivalId/lastSubmission", authMiddleware, getLastSubmission);

export default rivalsRouter;
