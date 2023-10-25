import models, { Schema, model } from "mongoose";

const submissionSchema = new Schema(
  {
    code: { type: String, required: true },
    state: { type: Number, required: false },
    output: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

export default models.Submission || model("Submission", submissionSchema);
