import mongoose from 'mongoose';
import { Problem } from './problemSchema';

const { Schema } = mongoose;

const SqlQuizSchema = Problem.discriminator(
  'SqlQuiz',
  new Schema({
    questions: [{ type: Schema.Types.ObjectId, ref: "SqlQuery", required: true }],
    validate: [
        {
          validator: function (questions) {
            return questions.length >= 1 && questions.length <= 20;
          },
          message: 'Quiz must have between 1 and 20 questions.',
        },
      ],
  })
);

export const QuizSQL = mongoose.model('QuizSQL', SqlQuizSchema);

