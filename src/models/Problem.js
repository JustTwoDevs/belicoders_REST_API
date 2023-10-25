import pkg from "mongoose";

const { Schema, model, models } = pkg;

// I'm Defining const for this model.

export const States = Object.freeze({
  DRAFT: 0,
  PUBLISHED: 1,
});


const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      // Remove extra spaces and tabs before it gets to the database.
      set: (value) => value.replace(/\s+/g, " ").trim(),
      match: /^[a-zA-Z0-9_ ]+$/,
    },
 
    state: {
      type: Number,
      required: false,
      enum: Object.values(States),
      default: States.DRAFT,
    },
    correctAnswersPercentaje:{
      type: Number,
      required: false,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: false }],
    grades: [{ type: Schema.Types.ObjectId, ref: "Grade", required: false }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);


export const Problem = models.Problem || model("Problem", problemSchema);
