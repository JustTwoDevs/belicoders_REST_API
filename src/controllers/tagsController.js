import Tag from "#models/Tag.js";

export const getTags = async (_req, res, next) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

export const getTagsByName = async (req, res, next) => {
  try {
    const tags = await Tag.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    res.status(200).json(tags);
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const newTag = new Tag(req.body);
    await newTag.save();
    res.status(201).json({ tagId: newTag.id, tagName: newTag.name });
  } catch (error) {
    next(error);
  }
};
