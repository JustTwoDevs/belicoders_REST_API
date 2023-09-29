import { Router } from "express";
import userRouter from "./usersRoutes.js";
import authRouter from "./authRouter.js";

const mainRouterV1 = Router();
mainRouterV1.get("/", (req, res) => {
  res.send("Hello World");
});

mainRouterV1.use("/user", userRouter);
mainRouterV1.use("/auth", authRouter);

export default mainRouterV1;
