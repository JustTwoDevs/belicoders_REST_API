import { Schema, model, models } from "mongoose";

const tagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

export default models.Tag || model("Tag", tagSchema);
