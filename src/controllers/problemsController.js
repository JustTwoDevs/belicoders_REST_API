import Problem from "../models/Problem.js";

export const getProblems = async (req, res, next) => {
  try {
    const problems = await Problem.find({ ...req.query });
    res.json(problems);
  } catch (error) {
    next(error);
  }
};

export const createProblem = async (req, res, next) => {
  try {
    const newProblem = new Problem(req.body);
    await newProblem.save();
    res.status(201).json({ problemId: newProblem.id });
  } catch (error) {
    next(error);
  }
};
