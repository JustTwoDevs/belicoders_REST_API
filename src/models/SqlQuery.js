import pkg from "mongoose";
const { Schema, model, models } = pkg;
import Question from './Question.js';

const sqlQuerySchema = new Schema({
  statement: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});

const SqlQuery = Question.discriminator('SqlQuery', sqlQuerySchema);

export default SqlQuery || model('SqlQuery', sqlQuerySchema);
