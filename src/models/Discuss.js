import pkg from "mongoose";

const { Schema, model, models } = pkg;

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

export default models.Discuss || model("Discuss", discussSchema);
