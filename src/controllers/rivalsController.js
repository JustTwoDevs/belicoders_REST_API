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
