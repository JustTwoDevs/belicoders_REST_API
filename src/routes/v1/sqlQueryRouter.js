import {Router} from "express";
import {
     createSqlQuestion, listSqlQuestions
} from "../../controllers/sqlQuestionsController.js";

const sqlQueryRouter = Router();

sqlQueryRouter.post("/", createSqlQuestion);
sqlQueryRouter.get("/", listSqlQuestions);

export default sqlQueryRouter;