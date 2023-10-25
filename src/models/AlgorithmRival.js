import Rival from "./Rival.js";
import models, { Schema } from "mongoose";

const algorithmRivalSchema = new Schema({
  solutionCode: { type: String },
  inputCases: { type: String },
  expectedOutput: { type: String },
});

export default models.AlgorithmRival |
  Rival.discriminator("AlgorithmRival", algorithmRivalSchema);
