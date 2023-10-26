import { States } from "../models/Rival.js";
import Tag from "../models/Tag.js";
import SqlRival from "../models/SqlRival.js";
import Submission from "#models/Submission.js";
import Discuss from "#models/Discuss.js";
import Grade from "#models/Grade.js";

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

export const createSqlRivalDraft = async (req, res, next) => {
  try {
    // Validate(req.body) can be the problem created?

    const tags = await findTagsAndCreate(req.body.tags);

    const problemData = {
      title: req.body.sqlScript,
      type: req.body.title,
      description: req.body.statement,
      rivals: req.body.difficulty,
      runtime: req.body.runtime,
      createdBy: req.params.userId,
      tags,
    };

    const newRival = SqlRival.create(problemData);
    res.status(201).json({ problemId: newRival.id });
  } catch (error) {
    next(error);
  }
};

export const publishSqlRival = async (req, res, next) => {
    try {
        const foundRival = req.foundRival;

        if (foundRival == null) return res.sendStatus(404);
        foundRival.state= States.PUBLISHED;
    
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

    foundRival.title = req.body.title;
    foundRival.statement = req.body.statement;
    foundRival.difficulty = req.body.difficulty;
    foundRival.runtime = req.body.runtime;
    foundRival.tags = tags;
    foundRival.creationScript = req.body.sqlScript;
    await foundRival.save();
    res.sendStatus(200);
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

