
import SqlQuery from "../models/SqlQuery.js";
import db from "./sqlDatabase.js";

export const createSqlQuestion = async (req, res, next) => {
    try {
      if (!req.body.input) {
        return res.status(400).json({ error: "The database name is required" });
      }
  
      const database = req.body.input;
      const sql = `SHOW DATABASES LIKE '${database}'`;
  
      const results = await executeSqlQuery(sql);
  
      if (results.length > 0) {
        const newQuestion = new SqlQuery(req.body);
  
        const savedQuestion = await newQuestion.save();
  
        res.status(201).json({
          QuestionId: savedQuestion.id,
          QuestionName: savedQuestion.title,
        });
      } else {
        res.status(400).json({ error: "The database does not exist" });
      }
    } catch (error) {
      next(error);
    }
  };
  
  
  const executeSqlQuery = (sql) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
  
  export const listSqlQuestions = async (req, res, next) => {
    try {
      const sqlQuestions = await SqlQuery.find();
  
      res.status(200).json(sqlQuestions);
    } catch (error) {
      next(error);
    }
  };
  