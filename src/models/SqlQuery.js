import models, { Schema } from "mongoose";
import Question from "./Question.js";

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

export default models.SqlQuery ||
  Question.discriminator("SqlQuery", sqlQuerySchema);
