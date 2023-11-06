import Discuss from "#models/Discuss.js";
import Rival, { States } from "#models/Rival.js";
import Tag from "#models/Tag.js";

export const getRivals = async (req, res, next) => {
  try {
    const { tags } = req.query;
    const query = {};
    if (tags) {
      const foundTags = await Tag.find({ name: { $in: tags.split(",") } });
      if (foundTags.length)
        query.tags = { $in: foundTags.map((tag) => tag._id) };
    }
    query.state = "Published";

    const foundRivals = await Rival.find(query).populate("createdBy");
    res.json(foundRivals);
  } catch (error) {
    next(error);
  }
};

export const getRivalByName = async (req, res, next) => {
  try {
    const name = req.params.rivalName.replace(/-/g, " ");
    console.log(name);
    const foundRival = await Rival.findOne({
      title: name,
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
  if (!tags) return []

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
    const name = req.params.rivalName.replace(/-/g, " ");
    const foundRival = await Rival.findOne({ title: name });
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
