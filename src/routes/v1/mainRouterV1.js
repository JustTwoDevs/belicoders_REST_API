import { Router } from "express";
import problemsRouter from "./problemsRouter.js";

const mainRouterV1 = Router();

mainRouterV1.get("/", (_req, res) => {
  res.send("Hello World");
});

mainRouterV1.use("/problems", problemsRouter);

export default mainRouterV1;
