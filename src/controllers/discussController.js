import Discuss from "#models/Discuss.js";

export const getDiscussById = async (req, res, next) => {
  try {
    const foundDiscuss = await Discuss.findById(req.params.id)
      .populate("createdBy")
      .populate("tags.name")
      .populate("grades")
      .populate("submissions");
    if (foundDiscuss != null) res.json(foundDiscuss);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

export const replieDiscuss = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const foundDiscuss = await Discuss.findById(req.params.id);
    if (!foundDiscuss) {
      return res.status(404).json({ error: "Discuss not found" });
    }
    const { content } = req.body;
    const newDiscuss = await Discuss.create({
      content,
      userId: req.user.id,
    });
    foundDiscuss.replies.push(newDiscuss._id);
    await foundDiscuss.save();
    res.json(newDiscuss);
  } catch (error) {
    next(error);
  }
};
