import Discuss from "#models/Discuss.js";
import Rival, { States } from "#models/Rival.js";
import Tag from "#models/Tag.js";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import Submission, { States as SubmissionStates } from "#models/Submission.js";
import { executeQuery } from "#databaseConnections/mysqlConnection.js";
import { testAlgorithmRival } from "./algorithmRivalsController.js";
import { testSQLRival } from "./sqlRivalsController.js";

export const getRivals = async (req, res, next) => {
  try {
    const { tags } = req.query;
    const query = {};
    if (tags) {
      const foundTags = await Tag.find({ name: { $in: tags.split(",") } });
      if (foundTags.length)
        query.tags = { $in: foundTags.map((tag) => tag._id) };
    }
    query.state = States.PUBLISHED;

    const foundRivals = await Rival.find(query).populate("createdBy");
    res.json(foundRivals);
  } catch (error) {
    next(error);
  }
};

export const getRivalByTitle = async (req, res, next) => {
  try {
    const title = req.params.rivalTitle.replace(/-/g, " ");
    const foundRival = await Rival.findOne({
      title,
      state: States.PUBLISHED,
    })
      .populate("createdBy")
      .populate("tags", "name")
      .populate("grades")
      .populate({
        path: "discussion",
        populate: {
          path: "userId",
          select: "username",
        },
      })
      .populate({
        path: "discussion",
        populate: {
          path: "replies",
          populate: {
            path: "userId",
            select: "username",
          },
        },
      })
      .exec();
    if (foundRival != null) res.json(foundRival);
  } catch (error) {
    next(error);
  }
};

export const getUserRivals = async (req, res, next) => {
  try {
    const { tags, search, sort, difficulty, page } = req.query;
    const query = { createdBy: req.user.id };
    const rivalsPerPage = 10;
    if (difficulty) query.difficulty = parseInt(difficulty);
    if (search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { statement: { $regex: req.query.search, $options: "i" } },
      ];
    }
    if (tags) {
      const foundTags = await Tag.find({ name: { $in: tags.split(",") } });
      if (foundTags.length)
        query.tags = { $in: foundTags.map((tag) => tag._id) };
    }

    const foundRivals = await Rival.find(query)
      .skip((parseInt(page) - 1) * rivalsPerPage || 0)
      .limit(rivalsPerPage)
      .populate("tags", "createdBy")
      .sort({ "grades.value": parseInt(sort) || -1 });

    res.json(foundRivals);
  } catch (error) {
    next(error);
  }
};

export const getUserRivalById = async (req, res, next) => {
  try {
    const foundRival = await Rival.findOne({
      _id: req.params.rivalId,
      createdBy: req.user.id,
    });
    if (foundRival != null) res.json(foundRival);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

export const findTagsAndCreate = async (tags) => {
  if (!tags) return [];

  const lowerTags = tags.map((tag) => tag.toLowerCase());
  const foundTags = await Tag.find({ name: { $in: lowerTags } }, "_id name");
  for (const tag of lowerTags) {
    if (!foundTags.find((t) => t.name === tag)) {
      const newTag = await Tag.create({ name: tag });
      foundTags.push(newTag);
    }
  }
  return foundTags.map((tag) => tag._id);
};

export const createDiscuss = async (req, res, next) => {
  try {
    const { content } = req.body;
    const title = req.params.rivalTitle.replace(/-/g, " ");
    const foundRival = await Rival.findOne({ title });
    if (foundRival) {
      const newDiscuss = await Discuss.create({
        content,
        userId: req.user.id,
      });
      foundRival.discussion.push(newDiscuss._id);
      await foundRival.save();
      res.json(newDiscuss);
    } else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

export const deleteRivalDraft = async (req, res, next) => {
  try {
    const foundRival = await Rival.findOne({
      _id: req.params.rivalId,
      createdBy: req.user.id,
    });
    if (foundRival === null) return res.sendStatus(404);
    if (foundRival.state !== States.DRAFT)
      return res.status(409).json({ message: "The problem is not a draft" });
    await foundRival.delete();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const submission = async (req, res, next) => {
  try {
    const title = req.params.rivalTitle.replace(/-/g, " ");
    const foundRival = await Rival.findOne({ title });
    if (!foundRival) return res.sendStatus(404);
    if (foundRival.__t === "AlgorithmRival")
      submissionAlgorithm(req, res, foundRival);
    else if (foundRival.__t === "SqlRival") submissionSQL(req, res, foundRival);
    else res.sendStatus(404);
  } catch (error) {
    res.sendStatus(500).json({ message: error.message });
  }
};

export const testRival = async (req, res, next) => {
  try {
    if (req.user.id !== req.rival.createdBy)
      return res
        .status(403)
        .json({ message: "You are not authorized to acces this endpoint" });
    if (req.rival.__t === "AlgorithmRival")
      testAlgorithmRival(req, res, req.rival);
    else if (req.rival.__t === "SqlRival") testSQLRival(req, res, req.rival);
  } catch (error) {
    next(error);
  }
};

const submissionAlgorithm = async (req, res, rival) => {
  const { userCode } = req.body;
  if (userCode === undefined)
    return res.status(400).json({ message: "No code" });
  const inputCases = rival.inputCases;
  const runTime = rival.runTime;
  const solutionOutput = rival.expectedOutput;
  try {
    writeFileSync(`${req.user.id}.txt`, inputCases);
    writeFileSync(`${req.user.id}.py`, userCode);
    const outputUser = execSync(
      `python ${req.user.id}.py < ${req.user.id}.txt`,
      { timeout: runTime },
    );
    const userOutput = outputUser.toString();
    unlinkSync(`${req.user.id}.txt`);
    unlinkSync(`${req.user.id}.py`);
    // Imprimir los outputs. Incluyendo caracteres especiales como \n
    console.log(userOutput.toString() === solutionOutput);

    const newSubmission = await Submission.create({
      code: userCode,
      state:
        userOutput === solutionOutput
          ? SubmissionStates.ACCEPTED
          : SubmissionStates.WRONG_ANSWER,
      output:
        userOutput === solutionOutput ? " " : "Did not pass the test cases",
      userId: req.user.id,
    });

    rival.submissions.push(newSubmission._id);
    await rival.save();
    await newSubmission.save();
    newSubmission.submission = true;

    return res.status(200).json({ ...newSubmission._doc, submission: true });
  } catch (err) {
    const errorOutput = err.message;
    console.log(errorOutput);
    await new Promise((resolve) => setTimeout(resolve, 100));
    unlinkSync(`${req.user.id}.py`);
    unlinkSync(`${req.user.id}.txt`);
    const newSubmission = await Submission.create({
      code: userCode,
      state: errorOutput.includes("ENOBUFS")
        ? SubmissionStates.RUNTIME_ERROR
        : SubmissionStates.COMPILATION_ERROR,
      output: errorOutput.includes("ENOBUFS") ? "" : errorOutput,
      userId: req.user.id,
    });

    rival.submissions.push(newSubmission._id);
    await rival.save();

    await newSubmission.save();
    return res.status(200).json({ ...newSubmission._doc, submission: true });
  }
};

const submissionSQL = async (req, res, rival) => {
  const { userCode } = req.body;
  if (userCode === undefined || userCode === null || userCode === "") {
    return res.status(400).json({ message: "write some code" });
  }
  try {
    const expectedOutput = rival.expectedOutput;
    await executeQuery({
      query: `CREATE DATABASE ${rival.databaseName}`,
      useExecute: true,
    });
    await executeQuery({
      query: `USE ${rival.databaseName};${rival.creationScript}`,
      useExecute: false,
    });
    const result = await executeQuery({
      query: userCode,
      useExecute: false,
    });

    executeQuery({
      query: `DROP DATABASE ${rival.databaseName}`,
      useExecute: true,
    });
    const isCorrect = JSON.stringify(result) === expectedOutput;

    const newSubmission = await Submission.create({
      userId: req.user.id,
      code: userCode,
      output: JSON.stringify(result),
      state: isCorrect
        ? SubmissionStates.ACCEPTED
        : SubmissionStates.WRONG_ANSWER,
    });
    rival.submissions.push(newSubmission._id);
    await rival.save();
    await newSubmission.save();
    return res.status(200).json({ ...newSubmission._doc, submission: true });
  } catch (error) {
    executeQuery({
      query: `DROP DATABASE ${rival.databaseName}`,
      useExecute: true,
    });

    console.log("entre a error");
    const newSubmission = await Submission.create({
      userId: req.user.id,
      code: userCode,
      output: error.message,
      state: SubmissionStates.COMPILATION_ERROR,
    });

    rival.submissions.push(newSubmission._id);
    await rival.save();
    await newSubmission.save();
    newSubmission.submission = true;

    return res.status(200).json({ ...newSubmission._doc, submission: true });
  }
};

export const getSubmissions = async (req, res, next) => {
  const rival = await Rival.findOne({
    _id: req.params.rivalId,
  }).populate("submissions");

  if (!rival) return res.sendStatus(404);

  const submissions = rival.submissions.filter(
    (submission) => submission.userId.toString() === req.user.id,
  );

  if (submissions.length === 0) return res.sendStatus(404);
  res.json(submissions);
};

export const getLastSubmission = async (req, res, next) => {
  const rival = await Rival.findOne({
    _id: req.params.rivalId,
  }).populate("submissions");

  if (!rival) return res.sendStatus(404);

  const submissions = rival.submissions.filter(
    (submission) => submission.userId.toString() === req.user.id,
  );

  submissions.sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    if (a.createdAt > b.createdAt) return -1;
    return 0;
  });

  if (submissions.length === 0) return res.sendStatus(404);
  res.json(submissions[0]);
};
