import { Schema, model } from "mongoose";

const submissionSchema = new Schema(
  {
    code: { type: String, required: true },
    state: { type: Number, required: true },
    output: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default model("Submission", submissionSchema);
