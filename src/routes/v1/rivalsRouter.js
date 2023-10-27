import { Router } from "express";
import {
  getRivals,
  getRivalByName,
  createDiscuss,
} from "#controllers/rivalsController.js";
import authMiddleware from "#middlewares/authorization/authMiddleware.js";

const rivalsRouter = Router();

rivalsRouter.get("/", getRivals);
rivalsRouter.get("/:rivalName", getRivalByName);
rivalsRouter.post("/:rivalName/discuss", authMiddleware, createDiscuss);

export default rivalsRouter;
