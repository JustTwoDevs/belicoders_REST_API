import { Router } from "express";
import authMiddleware from "#middlewares/authorization/authMiddleware.js";
import {
  runAlgorithmCode,
  runSQLCode,
} from "#controllers/runCodeController.js";

const discussRouter = Router();

discussRouter.post("/algorithm", authMiddleware, runAlgorithmCode);
discussRouter.post("/SQL", authMiddleware, runSQLCode);

export default discussRouter;
