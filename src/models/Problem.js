import { Schema, model } from "mongoose";

export const States = Object.freeze({
  DRAFT: 0,
  PUBLISHED: 1,
});

const problemSchema = new Schema(
  {
    title: { type: String, required: true },
    statement: { type: String, required: true },
    testCasesFile: { type: String, required: false },
    inputCases: { type: String, required: false },
    outputAnswers: { type: String, required: false },
    runtime: { type: Number, required: false },
    difficulty: { type: Number, required: true },
    state: { type: Number, required: false },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: false }],
    discussion: [
      { type: Schema.Types.ObjectId, ref: "Discuss", required: false },
    ],
    grades: [{ type: Schema.Types.ObjectId, ref: "Grade", required: false }],
    submissions: [
      { type: Schema.Types.ObjectId, reg: "Submission", required: false },
    ],
  },
  {
    timestamps: true,
  },
);

export const Problem = model("Problem", problemSchema);
