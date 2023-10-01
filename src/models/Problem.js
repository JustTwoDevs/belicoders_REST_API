import pkg, { Schema, model } from "mongoose";

const { models } = pkg;

export const States = Object.freeze({
  DRAFT: 0,
  PUBLISHED: 1,
});

const problemSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    statement: { type: String, required: [true, "Statement is required"] },
    testCasesFile: { type: String, required: false },
    inputCases: { type: String, required: false },
    outputAnswers: { type: String, required: false },
    runtime: { type: Number, required: false },
    difficulty: { type: Number, required: [true, "Difficulty is required"] },
    state: { type: Number, required: false },
    // To search by tags with query string the format is: ?tags=name1, name2, ...
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
  }
);

export const Problem = models.Problem || model("Problem", problemSchema);
