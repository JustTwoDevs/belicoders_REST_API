import { States } from "#models/Rival.js";
import AlgorithmRival from "#models/AlgorithmRival.js";
import { findTagsAndCreate } from "./rivalsController.js";
import { unlinkSync, writeFileSync } from "fs";
import { execSync } from "child_process";

export const createAlgorithmRivalDraft = async (req, res, next) => {
  try {
    const rivalData = {
      title: req.body.title,
      solutionMd: req.body.solutionMd,
      statement: req.body.statement,
      solutionCode: req.body.solutionCode,
      inputCases: req.body.inputCases,
      sampleInputCases: req.body.sampleInputCases,
      runtime: req.body.runtime,
      difficulty: req.body.difficulty,
      createdBy: req.user.id,
      tags: await findTagsAndCreate(req.body.tags),
    };

    const newAlgorithmRival = new AlgorithmRival(rivalData);
    // Generate expected output
    newAlgorithmRival.generateExpectedOutput(req.user);
    await newAlgorithmRival.save();
    res.status(201).json({ newRival: newAlgorithmRival });
  } catch (error) {
    next(error);
  }
};

export const publishAlgorithmRival = async (req, res, next) => {
  try {
    const foundRival = await AlgorithmRival.findOne({
      _id: req.params.rivalId,
      createdBy: req.user.id,
    });
    if (foundRival === null) return res.sendStatus(404);
    if (foundRival.state === States.PUBLISHED)
      return res
        .status(409)
        .json({ message: "The problem is already published" });
    if (!foundRival.solutionCode)
      return res
        .status(400)
        .json({ message: "The problem has no solution code" });
    if (!foundRival.inputCases)
      return res
        .status(400)
        .json({ message: "The problem has no input cases" });
    if (!foundRival.expectedOutput)
      return res
        .status(400)
        .json({ message: "The problem has no expected output" });
    foundRival.state = States.PUBLISHED;
    await foundRival.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const patchAlgorithmRivalDraft = async (req, res, next) => {
  try {
    const foundRival = await AlgorithmRival.findOne({
      _id: req.params.rivalId,
      createdBy: req.user.id,
    });
    if (foundRival == null) return res.sendStatus(404);
    if (foundRival.state !== States.DRAFT)
      return res.status(409).json({ message: "The problem is not a draft" });

    if (req.body.title) foundRival.title = req.body.title;
    if (req.body.solutionMd) foundRival.solutionMd = req.body.solutionMd;
    if (req.body.statement) foundRival.statement = req.body.statement;
    if (req.body.solutionCode) foundRival.solutionCode = req.body.solutionCode;
    if (req.body.inputCases) foundRival.inputCases = req.body.inputCases;
    if (req.body.runtime) foundRival.runtime = req.body.runtime;
    if (req.body.difficulty) foundRival.difficulty = req.body.difficulty;
    foundRival.tags = await findTagsAndCreate(req.body.tags);
    foundRival.generateExpectedOutput();
    await foundRival.save();
    res.status(200).json(foundRival);
  } catch (error) {
    next(error);
  }
};

export const testAlgorithmRival = async (req, res, rival) => {
  const { userCode } = req.body;
  const { inputCases, expectedOutput, runtime } = rival;
  try {
    writeFileSync(`${req.user.id}.txt`, inputCases);
    writeFileSync(`${req.user.id}.py`, userCode);
    const userOutput = execSync(
      `python ${req.user.id}.py < ${req.user.id}.txt`,
      { timeout: runtime },
    ).toString();
    if (expectedOutput !== userOutput)
      return res
        .status(200)
        .json({ state: "WRONG_ANSWER", userOutput, expectedOutput });
    return res
      .status(200)
      .json({ state: "ACCEPTED", userOutput, expectedOutput });
  } catch (error) {
    const errorState = error.message.includes("ENOBUFS")
      ? "RUNTIME_ERROR"
      : "TIME_LIMIT_EXCEEDED";
    return res
      .status(200)
      .json({ state: errorState, errorOutput: error.message });
  } finally {
    unlinkSync(`${req.user.id}.txt`);
    unlinkSync(`${req.user.id}.py`);
  }
};
