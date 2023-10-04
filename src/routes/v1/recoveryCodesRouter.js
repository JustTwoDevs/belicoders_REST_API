import { Router } from "express";
import {
  generateRecoveryCode,
  regenerateRecoveryCode,
} from "../../controllers/recoveryCodesController.js";

const recoveryCodesRouter = Router();

recoveryCodesRouter.post("/", generateRecoveryCode);
recoveryCodesRouter.put("/", regenerateRecoveryCode);

export default recoveryCodesRouter;
