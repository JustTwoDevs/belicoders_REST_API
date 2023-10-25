import { Router } from "express";
import {
 listDatabases,
 createDatabases,
} from "#controllers/SqlDatabaseController.js";

const sqlDatabaseRouter = Router();

sqlDatabaseRouter.get("/", listDatabases);
sqlDatabaseRouter.post("/", createDatabases);

export default sqlDatabaseRouter;
