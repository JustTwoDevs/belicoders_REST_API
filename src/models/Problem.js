import { Schema, model } from "mongoose";

const problemSchema = new Schema(
  {
    statement: { type: String, required: true },
    inputCases: { type: String, required: false },
    outputAnswers: { type: String, required: true },
    runtime: { type: Number, required: false },
    difficulty: { type: Number, required: true },
    state: { type: Number, required: true },
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

export default model("Problem", problemSchema);
