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

const questionSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  input: {
    type: String,
    required: true,
  },
  statement: {
    type: String,
    required: [true, "Statement is required"],
    trim: true,
  },
  submission: {
    type: Schema.Types.ObjectId,
    ref: 'Submission',
    required: false,
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
 
   
});

const Question =model('Question', questionSchema);

export default Question || mongoose.model('Question', questionSchema);
