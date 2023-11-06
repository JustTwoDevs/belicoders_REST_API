import pkg from "mongoose";
import { States } from "#models/Rival.js";
const { Schema, model, models } = pkg;

const Kinds = Object.freeze({
  ALGORITHM: "Algorithm",
  SQL: "SQL",
  MISCELLANEOUS: "Miscellaneous",
});

const contestSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    // Remove extra spaces and tabs before it gets to the database.
    set: (value) => value.replace(/\s+/g, " ").trim(),
    match: /^[a-zA-Z0-9_ &']+$/,
    unique: true,
  },
  kind: { type: String, enum: Object.values(Kinds) },
  // markdown
  description: { type: String, trim: true },
  state: { type: String, enum: Object.values(States), default: States.DRAFT },
  rivals: [{ type: Schema.Types.ObjectId, ref: "Rival" }],
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

contestSchema.methods.calculateContestKind = function () {
  let algorithmFlag = false;
  let sqlFlag = false;
  for (const rival of this.rivals) {
    if (rival.__t === "AlgorithmRival") {
      if (sqlFlag) break;
      else algorithmFlag = true;
    } else if (rival.__t === "SqlRival") {
      if (algorithmFlag) break;
      else sqlFlag = true;
    }
  }
  if (algorithmFlag && sqlFlag) this.kind = "Miscellaneous";
  if (algorithmFlag) this.kind = "Algorithm";
  if (sqlFlag) this.kind = "SQL";
};

export default models.Contest || model("Contest", contestSchema);
