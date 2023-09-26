import { Router } from "express";

const mainRouter = Router();
mainRouter.get("/", (req, res) => {
  res.send("Hello World");
});

export default mainRouter;
