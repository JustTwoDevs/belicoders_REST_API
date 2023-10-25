import { Router } from "express";
import { getRivals, getRivalById } from "#controllers/rivalsController.js";

const rivalsRouter = Router();

rivalsRouter.get("/", getRivals);
rivalsRouter.get("/:rivalId", getRivalById);

export default rivalsRouter;
