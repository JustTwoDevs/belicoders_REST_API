import Rival from "./Rival.js";
import models, { Schema } from "mongoose";

const algorithmRivalSchema = new Schema({
  inputCases: { type: String },
});

export default models.AlgorithmRival |
  Rival.discriminator("AlgorithmRival", algorithmRivalSchema);
