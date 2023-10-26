import models, { Schema, model } from "mongoose";

// I'm Defining const for this model.

export const States = Object.freeze({
  DRAFT: 0,
  PUBLISHED: 1,
});

export const difficulties = Object.freeze({
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
});

export const MAX_RUNTIME = 3000;
export const MIN_RUNTIME = 100;

const rivalSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      // Remove extra spaces and tabs before it gets to the database.
      set: (value) => value.replace(/\s+/g, " ").trim(),
      match: /^[a-zA-Z0-9_ &']+$/,
      unique: true,
    },
    // Valentina, este es el markdown que se muestra en el apartado de solución del front-end.
    solutionMD: { type: String },
    statement: {
      type: String,
      trim: true,
    },
    solutionCode: { type: String },
    expectedOutput: { type: String },
    runtime: {
      type: Number,
      required: false,
      min: MIN_RUNTIME,
      max: MAX_RUNTIME,
      default: MAX_RUNTIME,
    },
    difficulty: {
      type: Number,
      required: [true, "Difficulty is required"],
      // enum takes a list of values that can be setted to the field,
      // in this case, the values are the values of the difficulties constants object.
      enum: Object.values(difficulties),
    },
    state: {
      type: Number,
      required: false,
      enum: Object.values(States),
      default: States.DRAFT,
    },
    // To search by tags with query string the format is: ?tags=name1, name2, ...
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    discussion: [
      { type: Schema.Types.ObjectId, ref: "Discuss", required: false },
    ],
    grades: [{ type: Schema.Types.ObjectId, ref: "Grade", required: false }],
    submissions: [
      { type: Schema.Types.ObjectId, ref: "Submission", required: false },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

export default models.Rival || model("Rival", rivalSchema);
