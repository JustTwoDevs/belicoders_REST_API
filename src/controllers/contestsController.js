import Contest from "#models/Contest.js";
import { States } from "#models/Rival.js";

export const getContests = async (_req, res, next) => {
  try {
    const contests = await Contest.find({ state: States.PUBLISHED }).populate(
      "createdBy",
      "name",
    );
    res.status(200).json(contests);
  } catch (error) {
    next(error);
  }
};

// Should we LowerCase the title?
export const getContestByTitle = async (req, res, next) => {
  try {
    req.contest = await req.contest.populate("rivals");
    res.status(200).json(req.contest);
  } catch (error) {
    next(error);
  }
};

export const getUserContests = async (req, res, next) => {
  try {
    const contests = await Contest.find({ createdBy: req.user.id });
    res.status(200).json(contests);
  } catch (error) {
    next(error);
  }
};

export const getUserContest = async (req, res, next) => {
  try {
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
    contest.calculateContestKind();
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
    req.contest.calculateContestKind();
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
