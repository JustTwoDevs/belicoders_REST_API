import Rival from "./Rival.js";
import { execSync } from "child_process";
import pkg from "mongoose";
const { models, Schema } = pkg;

const algorithmRivalSchema = new Schema({
  inputCases: { type: String },
});

algorithmRivalSchema.methods.generateExpectedOutput = function () {
  if (this.solutionCode === undefined || this.inputCases === undefined) return;
  try {
    const outputBuffer = execSync(
      `echo "${this.inputCases}" | python -c "${this.solutionCode}"`,
    );
    this.expectedOutput = outputBuffer.toString();
    console.log(this.expectedOutput);
  } catch (error) {
    console.error(error.message);
  }
};

export default models.AlgorithmRival ||
  Rival.discriminator("AlgorithmRival", algorithmRivalSchema);
