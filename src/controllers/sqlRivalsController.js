import { States } from "../models/Rival.js";
import SqlRival from "../models/SqlRival.js";
import Submission from "#models/Submission.js";
import Discuss from "#models/Discuss.js";
import Grade from "#models/Grade.js";
import { findTagsAndCreate } from "./rivalsController.js";
import { executeQuery } from "#databaseConnections/mysqlConnection.js";


export const createSqlRivalDraft = async (req, res, next) => {
  try {
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

    await req.foundRival.save().json({ foundRival });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const patchSqlRivalDraft = async (req, res, next) => {
  try {
    const foundRival = await SqlRival.findOne({
      _id: req.params.rivalId,
      createdBy: req.user.id,
    });
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
    const rivals = await SqlRival.find({});
    res.status(200).json(rivals);
  } catch (error) {
    next(error);
  }
};

export const dropSqlRival = async (req, res, next) => {
  try {
    const foundRival = await SqlRival.findOne({
      _id: req.params.rivalId,
    });
    await Submission.deleteMany({ rival: foundRival._id });
    await Grade.deleteMany({ rival: foundRival._id });
    await Discuss.deleteMany({ rival: foundRival._id });
    await req.foundRival.remove();
    res.sendStatus(202);
  } catch (error) {
    next(error);
  }
};

export const testSQLRival = async (req, res, rival) => {
  const { userCode } = req.body;
  const { expectedOutput, databaseName, creationScript } = rival;
  try {
    await executeQuery({
      query: `CREATE DATABASE ${databaseName}`,
      useExecute: true,
    });
    await executeQuery({
      query: `USE ${databaseName};${creationScript}`,
      useExecute: false,
    });

    const userOutput = await executeQuery({
      query: userCode,
      useExecute: false,
    });
    if (JSON.stringify(userOutput) !== expectedOutput) {
      return res
        .status(200)
        .json({ state: "WRONG_ANSWER", userOutput, expectedOutput });
    }
    return res
      .status(200)
      .json({ state: "ACCEPTED", userOutput, expectedOutput });
  } catch (error) {
    return res
      .status(200)
      .json({ state: "COMPILATION_ERROR", output: error.message });
  } finally {
    executeQuery({
      query: `DROP DATABASE ${rival.databaseName}`,
      useExecute: true,
    });
  }
};
