import { Router } from "express";

const mainRouterV1 = Router();
mainRouter.get("/", (req, res) => {
  res.send("Hello World");
});

export default mainRouterV1;
