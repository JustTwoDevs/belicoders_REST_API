import models, { Schema } from "mongoose";
import Problem, { States } from "../models/Problem.js";

const MAX_RUNTIME = 3000;
const MIN_RUNTIME = 100;

const rivalSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  runtime: {
    type: Number,
    required: false,
    min: MIN_RUNTIME,
    max: MAX_RUNTIME,
    default: MAX_RUNTIME,
  },
});

rivalSchema.methods.publish = function () {
  if (this.state === States.PUBLISHED)
    return {
      succesfull: false,
      errorMessage: "The problem is already published",
    };
  if (!this.question) {
    return {
      succesfull: false,
      errorMessage: "You should upload your question before you can publish it",
    };
  }
};

export default models.Rival || Problem.discriminator("Rival", rivalSchema);
