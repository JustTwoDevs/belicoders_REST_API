import Rival from "./Rival.js";
import { execSync } from "child_process";
import pkg from "mongoose";
const { models, Schema } = pkg;
import { writeFileSync, unlinkSync } from "fs";

const algorithmRivalSchema = new Schema({
  inputCases: { type: String },
});


algorithmRivalSchema.methods.generateExpectedOutput = function (user) {
  if (this.solutionCode === undefined || this.inputCases === undefined) return;
  try {
    writeFileSync(`${user.id}.txt`, this.inputCases);
    writeFileSync(`${user.id}.py`, this.solutionCode);
    const outputBuffer = execSync(`python ${user.id}.py < ${user.id}.txt`);
    this.expectedOutput = outputBuffer.toString();
  } catch (err) {
    this.expectedOutput = err.message;
  }
  unlinkSync(`${user.id}.txt`);
  unlinkSync(`${user.id}.py`);
};

export default models.AlgorithmRival ||
  Rival.discriminator("AlgorithmRival", algorithmRivalSchema);
