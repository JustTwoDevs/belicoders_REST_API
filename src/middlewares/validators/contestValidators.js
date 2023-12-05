import validator from "./validator.js";
import Rival, { States } from "#models/Rival.js";
import { isValidObjectId } from "mongoose";

const contestRequestValidator = async (body, errors) => {
  if (body.state) {
    errors.push({
      on: "state",
      message: "The state cannot be set manually",
    });
  }

  if (body.kind) {
    errors.push({
      on: "kind",
      message: "The kind cannot be set manually",
    });
  }

  // Check if the rivalIds are casteable and if the rivals exist
  if (body.rivals?.length > 0) {
    for (const rivalId of body.rivals) {
      if (!isValidObjectId(rivalId)) {
        errors.push({
          on: "rivals",
          message: `The id '${rivalId}' is not a valid id`,
        });
      } else {
        const rival = await Rival.findOne({
          _id: rivalId,
          state: States.PUBLISHED,
        });
        if (!rival) {
          errors.push({
            on: "rivals",
            message: `The rival with id '${rivalId}' does not exist or has not been published`,
          });
        }
      }
    }
  }
};

export const createContestDraftValidator = validator(
  contestRequestValidator,
  null,
);

export const patchContestDraftValidator = validator(contestRequestValidator, {
  model: "Contest",
  validator: async (contest, errors) => {
    if (contest.state !== States.DRAFT) {
      errors.push({
        on: "state",
        message: "The Contest must be in Draft state to be modified",
      });
    }
  },
});

export const publishContestValidator = validator(null, {
  model: "Contest",
  populate: "rivals",
  validator: async (contest, errors) => {
    if (contest.state === States.PUBLISHED) {
      errors.push({
        on: "state",
        message: "The contest is already Published",
      });
    }
    if (contest.description === "") {
      errors.push({
        on: "description",
        message: "The contest must have a description",
      });
    }
    if (contest.rivals.length < 2) {
      errors.push({
        on: "rivals",
        message: "The contest must have at least 2 rivals",
      });
    }
  },
});

export const deleteContestDraftValidator = validator(null, {
  model: "Contest",
  validator: async (contest, errors) => {
    if (contest.state !== States.DRAFT) {
      errors.push({
        on: "state",
        message: "The contest must be in Draft state to be deleted",
      });
    }
  },
});
