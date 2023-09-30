import { Problem, States } from "../models/Problem.js";

export const getProblems = async (req, res, next) => {
  try {
    const foundProblems = await Problem.find({ ...req.query });
    res.json(foundProblems);
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (req, res, next) => {
  try {
    const foundProblem = await Problem.findById(req.params.problemId);
    if (foundProblem != null) res.json(foundProblem);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

export const createProblemDraft = async (req, res, next) => {
  try {
    // Validate(req.body) can be the problem created?
    const newProblem = new Problem(req.body);
    newProblem.state = States.DRAFT;
    await newProblem.save();
    res.status(201).json({ problemId: newProblem.id });
  } catch (error) {
    next(error);
  }
};

export const patchProblemDraft = async (req, res, next) => {
  try {
    // validate(req.body) can be the draft patched?
    const patchedProblem = Problem.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
    );
    if (patchedProblem != null) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

export const PublishProblem = async (req, res, next) => {
  try {
    // validate(req.body) can be the problem published?
    const PublishedProblem = Problem.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
    );
    if (PublishedProblem != null) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};
