import { Router } from "express";
import { login, logout } from "../../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/logout", logout);

export default authRouter;
