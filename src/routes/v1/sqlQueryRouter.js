import {Router} from "express";
import {
     createSqlQuestion, listSqlQuestions, evaluateSolution
} from "../../controllers/sqlQuestionsController.js";

const sqlQueryRouter = Router();

sqlQueryRouter.post("/", createSqlQuestion);
sqlQueryRouter.get("/", listSqlQuestions);
sqlQueryRouter.post("/evaluate", evaluateSolution);

export default sqlQueryRouter;