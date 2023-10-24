import models, { Schema, model } from "mongoose";

// I'm Defining const for this model.

export const States = Object.freeze({
  DRAFT: 0,
  VALID: 1,
});

export const difficulties = Object.freeze({
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
});

const questionSchema = new Schema({
  statement: {
    type: String,
    trim: true,
  },
  submission: {
    type: Schema.Types.ObjectId,
    ref: "Submission",
    required: false,
  },
  state: {
    type: Number,
    required: false,
    enum: Object.values(States),
    default: States.DRAFT,
  },
});

export default models.Question || model("Question", questionSchema);
