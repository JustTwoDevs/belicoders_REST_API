import { Problem, States } from "../models/Problem.js";

export const getProblems = async (req, res, next) => {
  try {
    const { tags, search, sort, difficulty, state, page } = req.query;
    const query = {};
    const problemsPerPage = 10;
    if (difficulty) query.difficulty = parseInt(difficulty);
    if (state) query.state = parseInt(state);
    if (search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { statement: { $regex: req.query.search, $options: "i" } },
      ];
    }
    if (tags) query["tags.name"] = { $all: tags.split(",") };

    console.log(query);

    const foundProblems = await Problem.find(query)
      .skip((parseInt(page) - 1) * problemsPerPage || 0)
      .limit(problemsPerPage)
      .sort({ "grades.value": parseInt(sort) || -1 });

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
