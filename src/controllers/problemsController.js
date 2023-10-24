import Problem, { States } from "../models/Problem.js";
import Tag from "../models/Tag.js";

export const getProblems = async (req, res, next) => {
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

    const foundProblems = await Problem.find(query)
      .skip((parseInt(page) - 1) * problemsPerPage || 0)
      .limit(problemsPerPage)
      .populate("tags")
      .sort({ "grades.value": parseInt(sort) || -1 });

    res.json(foundProblems);
  } catch (error) {
    next(error);
  }
};

export const getProblemById = async (req, res, next) => {
  try {
    const foundProblem = await Problem.findById(req.params.problemId);
    if (foundProblem != null) res.json(foundProblem);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

const findTagsAndCreate = async (tags) => {
  const foundTags = await Tag.find({ name: { $in: tags } }, "_id name");
  for (const tag of tags) {
    if (!foundTags.find((t) => t.name === tag)) {
      const newTag = await Tag.create({ name: tag });
      foundTags.push(newTag);
    }
  }
  return foundTags.map((tag) => tag._id);
};

export const createProblemDraft = async (req, res, next) => {
  try {
    // Validate(req.body) can be the problem created?
    if (!Problem.validateTags(req.body.tags))
      return res.status(400).json({
        message: "you should add one and only one type tag sql or algorithm",
      });

    const tags = await findTagsAndCreate(req.body.tags);

    const problemData = {
      title: req.body.title,
      statement: req.body.statement,
      difficulty: req.body.difficulty,
      runtime: req.body.runtime,
      createdBy: req.body.createdBy,
      tags,
    };

    const newProblem = new Problem(problemData);
    await newProblem.save();
    res.status(201).json({ problemId: newProblem.id });
  } catch (error) {
    next(error);
  }
};

export const patchProblemDraft = async (req, res, next) => {
  try {
    // validate(req.body) can be the draft patched?

    if (!Problem.validateTags(req.body.tags))
      return res.status(400).json({
        message: "you should add one and only one type tag sql or algorithm",
      });

    const foundProblem = await Problem.findById(req.params.problemId).populate(
      "tags",
      "name",
    );
    if (foundProblem === null) return res.sendStatus(404);
    if (foundProblem.state !== States.DRAFT)
      return res
        .status(409)
        .json({ message: "Can't modify a problem that is already published" });
    if (
      foundProblem.tags.find(
        (tag) => tag.name === "sql" || tag.name === "algorithm",
      ).name !==
      req.body.tags.find((tag) => tag === "algorithm" || tag === "sql")
    )
      return res.status(409).json({
        message: "can't change the type of the problem",
      });

    const tags = await findTagsAndCreate(req.body.tags);

    const problemData = {
      title: req.body.title,
      statement: req.body.statement,
      difficulty: req.body.difficulty,
      runtime: req.body.runtime,
      tags,
    };

    const patchedProblem = await Problem.findOneAndUpdate(
      { _id: req.params.problemId },
      problemData,
    );
    if (patchedProblem != null) res.sendStatus(204);
    else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};

export const publishProblem = async (req, res, next) => {
  try {
    // validate(req.body) can be the problem published?
    const foundProblem = await Problem.findById(req.params.problemId);
    if (foundProblem === null) return res.sendStatus(404);
    if (foundProblem.state === States.PUBLISHED)
      return res
        .status(409)
        .json({ message: "the problem is already published" });
    if (
      !foundProblem.testCasesFile ||
      !foundProblem.inputCases ||
      !foundProblem.outputAnswers
    )
      return res.status(400).json({
        message:
          "you should upload your test cases before you can publish the problem",
      });

    foundProblem.state = States.PUBLISHED;
    await foundProblem.save();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const createTestCases = async (req, res, next) => {
  try {
    const foundProblem = await Problem.findById(req.params.problemId);
    if (foundProblem != null) {
      if (foundProblem.state !== States.DRAFT) return res.sendStatus(409);
      const isCreated = foundProblem.createTestCases(req.body.testCasesFile);
      if (isCreated[0] === true) {
        await foundProblem.save();
        res.sendStatus(201);
      } else return res.status(400).json({ message: isCreated[1] });
    } else res.sendStatus(404);
  } catch (error) {
    next(error);
  }
};
