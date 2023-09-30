import { Schema, model } from "mongoose";

const gradeSchema = new Schema(
  {
    value: { type: Number, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Grade", gradeSchema);
