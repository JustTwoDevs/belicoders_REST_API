import { Schema, model } from "mongoose";

const discussSchema = new Schema(
  {
    content: { type: String, required: true },
    repliesNumber: { type: Number, required: false },
    replies: [{ type: Schema.Types.ObjectId, ref: "Discuss", required: false }],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

export default model("Discuss", discussSchema);
