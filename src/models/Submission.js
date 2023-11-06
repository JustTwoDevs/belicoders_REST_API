import pkg from "mongoose";
const { Schema, model, models } = pkg;

export const States = Object.freeze({
  ACCEPTED: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  RUNTIME_ERROR: "Runtime Error",
  COMPILATION_ERROR: "Compilation Error",
});

const submissionSchema = new Schema(
  {
    code: { type: String, required: true },
    state: { type: String, required: true },
    output: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default models.Submission || model("Submission", submissionSchema);
