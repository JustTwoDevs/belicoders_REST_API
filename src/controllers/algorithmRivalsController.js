import { States } from "../models/Rival.js";
import Tag from "../models/Tag.js";
import AlgorithmRival from "../models/AlgorithmRival.js";

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

export const createAlgorithmRivalDraft = async (req, res, next) => {
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

    const newRival = AlgorithmRival.create(problemData);
    res.status(201).json({ problemId: newRival.id });
  } catch (error) {
    next(error);
  }
};

export const publishAlgorithmRival = async (req, res, next) => {
  try {
    const foundRival = await AlgorithmRival.findById(req.params.rivalId);
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

export const patchAlgorithmRivalDraft = async (req, res, next) => {
  try {
    const foundRival = await AlgorithmRival.findById(req.params.rivalId);
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
