import SqlRival from "#models/SqlRival.js";
import { States } from "#models/Rival.js";

export const patchSqlRivalValidator = async (req, res, next) => {
  try {
    const foundRival = await SqlRival.findById(req.params.rivalId);

    if (!foundRival) {
      return res.sendStatus(404);
    }

    if (foundRival.state !== States.DRAFT) {
      return res.status(409).json({ message: "The rival is not a draft" });
    }

    req.foundRival = foundRival;
    next();
  } catch (error) {
    next(error);
  }
};

export const publishSqlRivalValidator = async (req, res, next) => {
  try {
    const foundRival = await SqlRival.findById(req.params.rivalId);

    if (!foundRival) {
      return res.sendStatus(404);
    }

    if (foundRival.state !== States.DRAFT) {
      return res.status(409).json({ message: "The rival is not a draft" });
    }

    req.foundRival = foundRival;
    next();
  } catch (error) {
    next(error);
  }
};
