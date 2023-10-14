import pkg from "mongoose";

const { Schema, model, models } = pkg;

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

const problemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      // Remove extra spaces and tabs before it gets to the database.
      set: (value) => value.replace(/\s+/g, " ").trim(),
      match: /^[a-zA-Z0-9_ ]+$/,
    },
    statement: {
      type: String,
      required: [true, "Statement is required"],
      trim: true,
    },
    testCasesFile: { type: String, required: false },
    inputCases: { type: String, required: false },
    outputAnswers: { type: String, required: false },
    runtime: {
      type: Number,
      required: false,
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
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: false }],
    discussion: [
      { type: Schema.Types.ObjectId, ref: "Discuss", required: false },
    ],
    grades: [{ type: Schema.Types.ObjectId, ref: "Grade", required: false }],
    submissions: [
      { type: Schema.Types.ObjectId, reg: "Submission", required: false },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
);

problemSchema.methods.createTestCases = function(testCasesFile) {
  const testCases = testCasesFile.split(";");
  if (testCases.length < 2) return [false, "Test cases are not separated by ;"];
  console.log(testCases);
  for (let i = 0; i < testCases.length; i++) {
    testCases[i] = testCases[i].split(":");
    if (testCases[i].length !== 2)
      return [false, "input and output are not separated by :"];
  }
  console.log(testCases);

  this.inputCases = testCases.map((testCase) => testCase[0]).join(";");
  this.outputAnswers = testCases.map((testCase) => testCase[1]).join(";");
  this.testCasesFile = testCasesFile;
  return [true];
};

export const Problem = models.Problem || model("Problem", problemSchema);
