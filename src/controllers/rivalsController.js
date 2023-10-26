import Rival from "#models/Rival.js";
import Tag from "#models/Tag.js";

export const getRivals = async (req, res, next) => {
  try {
    const { tags, search, sort, difficulty, page } = req.query;
    const query = {};
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
      .populate("tags")
      .sort({ "grades.value": parseInt(sort) || -1 });

    res.json(foundRivals);
  } catch (error) {
    next(error);
  }
};

export const getRivalById = async (req, res, next) => {
  try {
    const foundRival = await Rival.findById(req.params.rivalId);
    if (foundRival != null) res.json(foundRival);
    else res.sendStatus(404);
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
      .populate("tags")
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
  const foundTags = await Tag.find({ name: { $in: tags } }, "_id name");
  for (const tag of tags) {
    if (!foundTags.find((t) => t.name === tag)) {
      const newTag = await Tag.create({ name: tag });
      foundTags.push(newTag);
    }
  }
  return foundTags.map((tag) => tag._id);
};
