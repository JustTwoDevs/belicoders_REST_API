import { States } from "../models/Problem.js";
import Rival from "../models/Rival.js";
import Tag from "../models/Tag.js";

export const getRivals = async (req, res, next) => {
  try {
    const { tags, search, sort, difficulty, page } = req.query;
    const query = {};
    const problemsPerPage = 10;
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

    const foundProblems = await Rival.find(query)
      .skip((parseInt(page) - 1) * problemsPerPage || 0)
      .limit(problemsPerPage)
      .populate("tags")
      .sort({ "grades.value": parseInt(sort) || -1 });

    res.json(foundProblems);
  } catch (error) {
    next(error);
  }
};

export const getRivalById = async (req, res, next) => {
  try {
    const foundProblem = await Rival.findById(req.params.problemId);
    if (foundProblem != null) res.json(foundProblem);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

const findTagsAndCreate = async (tags) => {
  if (!tags) return [];
  const foundTags = await Tag.find({ name: { $in: tags } }, "_id name");
  for (const tag of tags) {
    if (!foundTags.find((t) => t.name === tag)) {
      const newTag = await Tag.create({ name: tag });
      foundTags.push(newTag);
    }
  }
  return foundTags.map((tag) => tag._id);
};

export const createRivalDraft = async (req, res, next) => {
  try {
    // Validate(req.body) can be the problem created?

    const tags = await findTagsAndCreate(req.body.tags);

    const problemData = {
      title: req.body.title,
      statement: req.body.statement,
      difficulty: req.body.difficulty,
      runtime: req.body.runtime,
      createdBy: req.params.userId,
      tags,
    };

    const newRival = Rival.create(problemData);
    res.status(201).json({ problemId: newRival.id });
  } catch (error) {
    next(error);
  }
};

export const publishRival = async (req, res, next) => {
  try {
    const foundRival = await Rival.findById(req.params.rivalId);
    if (foundRival == null) return res.sendStatus(404);
    const { succesfull, errorMessage } = foundRival.publish();
    if (succesfull === false)
      return res.status(409).json({ message: errorMessage });
    await foundRival.save();
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const patchRivalDraft = async (req, res, next) => {
  try {
    const foundRival = await Rival.findById(req.params.rivalId);
    if (foundRival == null) return res.sendStatus(404);
    if (foundRival.state !== States.DRAFT)
      return res.status(409).json({ message: "The problem is not a draft" });

    const tags = await findTagsAndCreate(req.body.tags);

    const rivalData = {
      title: req.body.title,
      statement: req.body.statement,
      difficulty: req.body.difficulty,
      runtime: req.body.runtime,
      tags,
    };

    foundRival.set(rivalData);
    await foundRival.save();
  } catch (error) {
    next(error);
  }
};
