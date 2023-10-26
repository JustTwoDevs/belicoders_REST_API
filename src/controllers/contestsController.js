import Contest from "../models/Contest.js";

export const getContests = async (_req, res, next) => {
  try {
    const contests = await Contest.find();
    res.status(200).json(contests);
  } catch (error) {
    next(error);
  }
};

export const getContestByType = async (req, res, next) => {
  try {
    const contests = await Contest.find({
      type: { $regex: req.params.type, $options: "i" },
    });
    res.status(200).json(contests);
  } catch (error) {
    next(error);
  }
}