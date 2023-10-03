import { Router } from "express";
import {
  login,
  logout,
  generateRecoverCode,
  recovePassword,
  checkRecoverCode,
} from "../../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/recover/generate", generateRecoverCode);
authRouter.post("/recover/check", checkRecoverCode);
authRouter.patch("/recover", recovePassword);

export default authRouter;
