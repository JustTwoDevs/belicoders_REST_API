import pkg, { Schema, model } from "mongoose";
const { models } = pkg;

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Tag = models.Tag || model("Tag", tagSchema);
