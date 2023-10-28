import { States } from "../models/Rival.js";
import SqlRival from "../models/SqlRival.js";
import Submission from "#models/Submission.js";
import Discuss from "#models/Discuss.js";
import Grade from "#models/Grade.js";
import { findTagsAndCreate } from "./rivalsController.js";

export const createSqlRivalDraft = async (req, res, next) => {
  try {
    // Validate(req.body) can be the problem created?
    const problemData = {
    databaseName: req.body.databaseName,
      title: req.body.title,
      solutionMD: req.body.solutionMD,
       statement: req.body.statement,
       creationScript: req.body.creationScript,
      solutionCode: req.body.solutionCode,
       difficulty: req.body.difficulty,
       runtime: req.body.runtime,
       createdBy: req.user.id,
       tags: await findTagsAndCreate(req.body.tags),
     };

    const newRival = new SqlRival(problemData);
     newRival.generateExpectedOutput();
   
      await newRival.save();
      res.status(201).json({ newRival });
    
  } catch (error) {
    next(error);
  }
};

export const publishSqlRival = async (req, res, next) => {
  try {
    const foundRival = req.foundRival;
    foundRival.state = States.PUBLISHED;

    await req.foundRival.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const patchSqlRivalDraft = async (req, res, next) => {
  try {
    const foundRival = req.findRival;

    const tags = await findTagsAndCreate(req.body.tags);

    if (foundRival.title) foundRival.title = req.body.title;
    if (foundRival.statement) foundRival.statement = req.body.statement;
    if (foundRival.difficulty) foundRival.difficulty = req.body.difficulty;
    if (foundRival.runtime) foundRival.runtime = req.body.runtime;
    if (foundRival.tags) foundRival.tags = tags;
    if (foundRival.creationScript)
      foundRival.creationScript = req.body.creationScript;
    if (foundRival.solutionCode)
      foundRival.solutionCode = req.body.solutionCode;
    await foundRival.save();
    res.status(200).json({ foundRival });
  } catch (error) {
    next(error);
  }
};

export const getSqlRivals = async (_req, res, next) => {
  try {
    const rivals = await SqlRival.find();
    res.status(200).json(rivals);
  } catch (error) {
    next(error);
  }
};

export const dropSqlRival = async (req, res, next) => {
  try {
    const foundRival = req.foundRival;
    await Submission.deleteMany({ rival: foundRival._id });
    await Grade.deleteMany({ rival: foundRival._id });
    await Discuss.deleteMany({ rival: foundRival._id });
    await req.foundRival.remove();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
