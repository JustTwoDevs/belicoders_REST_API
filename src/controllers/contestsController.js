import Contest from "#models/Contest.js";
import Rival, { States } from "#models/Rival.js";
import Tag from "#models/Tag.js";

async function calculateContestKind(rivalsIds) {
  const rivals = await Rival.find({ _id: { $in: rivalsIds } });
  let algorithmFlag = false;
  let sqlFlag = false;
  for (const rival of rivals) {
    if (rival.__t === "AlgorithmRival") {
      if (sqlFlag) return "Miscellaneous";
      else algorithmFlag = true;
    } else if (rival.__t === "SqlRival") {
      if (algorithmFlag) return "Miscellaneous";
      else sqlFlag = true;
    }
  }
  if (algorithmFlag) return "Algorithm";
  if (sqlFlag) return "SQL";
}

async function calculateContestTags(rivalsIds) {
  const rivals = await Rival.find({ _id: { $in: rivalsIds } });
  const calculdatedTags = [];
  rivals.forEach((rival) => {
    for (const tag of rival.tags) {
      if (!calculdatedTags.includes(tag)) calculdatedTags.push(tag);
    }
  });
  return calculdatedTags;
}

export const getContests = async (req, res, next) => {
  try {
    const { tags } = req.query;
    const query = {};
    if (tags) {
      const foundTags = await Tag.find({ name: { $in: tags.split(",") } });
      if (foundTags.length)
        query.tags = { $in: foundTags.map((tag) => tag._id) };
    }
    query.state = States.PUBLISHED;
    const contests = await Contest.find(query)
      .populate("createdBy", "name")
      .populate("tags", "name");
    res.status(200).json(contests);
  } catch (error) {
    next(error);
  }
};

// Should we LowerCase the title?
export const getContestByTitle = async (req, res, next) => {
  try {
    req.contest = await req.contest.populate("rivals");
    req.contest = await req.contest.populate("tags", "name");
    res.status(200).json(req.contest);
  } catch (error) {
    next(error);
  }
};

export const getUserContests = async (req, res, next) => {
  try {
    const { tags } = req.query;
    const query = {};
    if (tags) {
      const foundTags = await Tag.find({ name: { $in: tags.split(",") } });
      if (foundTags.length)
        query.tags = { $in: foundTags.map((tag) => tag._id) };
    }
    query.state = States.PUBLISHED;
    query.createdBy = req.user.id;
    const contests = await Contest.find(query)
      .populate("createdBy", "name")
      .populate("tags", "name");
    res.status(200).json(contests);
  } catch (error) {
    next(error);
  }
};

export const getUserContest = async (req, res, next) => {
  try {
    req.contest = await req.contest.populate("rivals");
    req.contest = await req.contest.populate("tags", "name");
    req.contest.tags = calculateContestTags(req.contest);
    res.status(200).json(req.contest);
  } catch (error) {
    next(error);
  }
};

export const createContestDraft = async (req, res, next) => {
  try {
    const contestData = {
      title: req.body.title,
      description: req.body.description,
      rivals: req.body.rivals,
      createdBy: req.user.id,
    };
    const contest = new Contest(contestData);
    contest.kind = await calculateContestKind(contest.rivals);
    contest.tags = await calculateContestTags(contest.rivals);
    await contest.save();
    res.status(201).json(contest);
  } catch (error) {
    next(error);
  }
};

export const patchContestDraft = async (req, res, next) => {
  try {
    if (req.body.title) req.contest.title = req.body.title;
    if (req.body.description) req.contest.description = req.body.description;
    if (req.body.rivals) req.contest.rivals = req.body.rivals;
    req.contest.kind = await calculateContestKind(req.contest.rivals);
    req.contest.tags = await calculateContestTags(req.contest.rivals);
    const savedContest = await req.contest.save();
    res.status(200).json(savedContest);
  } catch (error) {
    next(error);
  }
};

export const publishContest = async (req, res, next) => {
  try {
    req.contest.calculateContestKind();
    req.contest.state = States.PUBLISHED;
    const savedContest = await req.contest.save();
    res.status(200).json(savedContest);
  } catch (error) {
    next(error);
  }
};

export const deleteContestDraft = async (req, res, next) => {
  try {
    await Contest.findByIdAndDelete(req.contest._id);
    res.status(200).json({ message: "Contest deleted succesfully" });
  } catch (error) {
    next(error);
  }
};
