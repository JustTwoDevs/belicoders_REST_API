import { Schema, model } from "mongoose";

const tagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  },
);

export default model("Tag", tagSchema);
