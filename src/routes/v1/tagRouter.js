import { Router } from "express";
import {
  getTags,
  getTagsByName,
  createTag,
} from "../../controllers/tagController.js";

const tagRouter = Router();

tagRouter.get("/", getTags);
tagRouter.get("/:name", getTagsByName);
tagRouter.post("/", createTag);

export default tagRouter;
