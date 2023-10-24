import { Router } from "express";
import {
  getRivals,
  getRivalById,
  publishRival,
  patchRivalDraft,
} from "../../controllers/rivalsController.js";

const rivalsRouter = Router();

rivalsRouter.get("/", getRivals);
rivalsRouter.get("/:rivalId", getRivalById);
rivalsRouter.post("/:rivalId/publish", publishRival);
rivalsRouter.patch("/:rivalId", patchRivalDraft);
