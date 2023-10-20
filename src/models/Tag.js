import pkg, { Schema, model } from "mongoose";
const { models } = pkg;

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      set: (value) => value.replace(/\s+/g, " ").trim(),
      maxlength: [15, "The tag name should be less than 15 characters"],
      validate: [
        {
          validator: (value) => /^[a-zA-Z0-9&_]*$/.test(value),
          message:
            "Invalid tag name, the name should only contain alphanumeric characters or the special charaters '_' '&'",
        },
        {
          validator: (value) => /^[^\s]*\s?[^\s]*$/.test(value),
          message: "The tag name should only containt one space",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

export const Tag = models.Tag || model("Tag", tagSchema);
