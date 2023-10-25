import models, { Schema, model } from "mongoose";

const Kinds = Object.freeze({
  ALGORITHM: 0,
  SQL: 1,
  MISCELLANEOUS: 2,
});

const contestSchema = new Schema({
  title: { type: String },
  kind: { type: Number, enum: Object.values(Kinds) },
  // markdown
  description: { type: String },
  rivals: [{ type: Schema.Types.ObjectId, ref: "Rival" }],
  createdBy: { type: String },
});

export default models.Contest || model("Contest", contestSchema);
