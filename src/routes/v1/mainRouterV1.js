import { Router } from "express";
import problemsRouter from "./problemsRouter.js";
import userRouter from "./usersRoutes.js";
import authRouter from "./authRouter.js";
import tagRouter from "./tagRouter.js";

const mainRouterV1 = Router();

mainRouterV1.get("/", (_req, res) => {
  res.send("Hello World");
});

mainRouterV1.use("/problems", problemsRouter);
mainRouterV1.use("/user", userRouter);
mainRouterV1.use("/auth", authRouter);
mainRouterV1.use("/tags", tagRouter);

export default mainRouterV1;
