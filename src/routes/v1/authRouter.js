import { Router } from "express";
import recoveryMiddleware from "../../middlewares/recoveryMiddleware.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
  login,
  logout,
  verifyRecoveryCode,
  resetPassword,
} from "../../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verifyRecoveryCode", verifyRecoveryCode);
authRouter.post("/resetPassword", recoveryMiddleware, resetPassword);
authRouter.post("/verify", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

export default authRouter;
