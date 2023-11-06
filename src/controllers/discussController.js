import Discuss from "#models/Discuss.js";

export const getDiscussById = async (req, res, next) => {
  try {
    const foundDiscuss = await Discuss.findById(req.params.id)
      .populate("userId")
      .populate("replies");
    if (foundDiscuss != null) res.json(foundDiscuss);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

export const replieDiscuss = async (req, res, next) => {
  try {
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

export const deleteDiscuss = async (req, res, next) => {
  try {
    const deleted = await Discuss.deleteOne({ _id: req.params.id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: "Discuss not found" });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const editDiscuss = async (req, res, next) => {
  try {
    const editDiscuss = await Discuss.findOneAndUpdate(
      { _id: req.params.id },
      {
        content: req.body.content,
      }
    );
    if (!editDiscuss) {
      return res.status(404).json({ error: "Discuss not found" });
    }
    await editDiscuss.save();
    res.json(editDiscuss);
  } catch (error) {
    next(error);
  }
};
